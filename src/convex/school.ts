import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getCurrentUser } from "./users";

type StudentSummary = {
  userId: Id<"users">;
  name?: string;
  email?: string;
  classLevel?: "Class10" | "Class12";
  hasMarks: boolean;
  hasAssessment: boolean;
  hasRecommendations: boolean;
};

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all students via userRoles index
    const studentRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();

    const studentIds = studentRoles.map((r) => r.userId);

    // Count marks submitted (any class level)
    let marksSubmittedCount = 0;
    let assessmentsCompletedCount = 0;
    let recommendedStudentsSet = new Set<string>();
    const pendingStudents: Array<{ userId: Id<"users">; name?: string; email?: string }> = [];

    // Preload users for names/emails
    const usersMap = new Map<string, { _id: Id<"users">; name?: string; email?: string }>();
    for (const uid of studentIds) {
      const u = await ctx.db.get(uid);
      if (u) usersMap.set(uid, u);
    }

    for (const studentId of studentIds) {
      // marks
      const marks = await ctx.db
        .query("studentMarks")
        .withIndex("by_student", (q) => q.eq("studentId", studentId))
        .first();
      const hasMarks = !!marks;
      if (hasMarks) marksSubmittedCount += 1;

      // assessment
      const assessment = await ctx.db
        .query("assessments")
        .withIndex("by_user", (q) => q.eq("userId", studentId))
        .first();
      const hasAssessment = !!assessment;
      if (hasAssessment) assessmentsCompletedCount += 1;

      // recommendations (any exist)
      const rec = await ctx.db
        .query("recommendations")
        .withIndex("by_user", (q) => q.eq("userId", studentId))
        .first();
      if (rec) recommendedStudentsSet.add(studentId as unknown as string);

      if (!hasMarks) {
        const u = usersMap.get(studentId as unknown as string);
        pendingStudents.push({
          userId: studentId,
          name: u?.name,
          email: u?.email,
        });
      }
    }

    const totalStudents = studentIds.length;
    const marksSubmittedPercent =
      totalStudents > 0 ? Math.round((marksSubmittedCount / totalStudents) * 100) : 0;
    const assessmentsPercent =
      totalStudents > 0 ? Math.round((assessmentsCompletedCount / totalStudents) * 100) : 0;

    return {
      totalStudents,
      marksSubmittedCount,
      marksSubmittedPercent,
      pendingStudents: pendingStudents.slice(0, 10),
      assessmentsCompletedCount,
      assessmentsPercent,
      recommendedStudentsCount: recommendedStudentsSet.size,
    };
  },
});

export const listStudents = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();

    const limit = Math.max(1, Math.min(args.limit ?? 100, 200));
    const search = (args.search || "").toLowerCase();

    const out: StudentSummary[] = [];
    for (const r of roles) {
      const u = await ctx.db.get(r.userId);
      if (!u) continue;

      if (
        search &&
        !(
          (u.name && u.name.toLowerCase().includes(search)) ||
          (u.email && u.email.toLowerCase().includes(search))
        )
      ) {
        continue;
      }

      const marks = await ctx.db
        .query("studentMarks")
        .withIndex("by_student", (q) => q.eq("studentId", r.userId))
        .order("desc")
        .first();
      const assessment = await ctx.db
        .query("assessments")
        .withIndex("by_user", (q) => q.eq("userId", r.userId))
        .first();
      const rec = await ctx.db
        .query("recommendations")
        .withIndex("by_user", (q) => q.eq("userId", r.userId))
        .first();

      out.push({
        userId: r.userId,
        name: u.name,
        email: u.email,
        classLevel: marks?.classLevel,
        hasMarks: !!marks,
        hasAssessment: !!assessment,
        hasRecommendations: !!rec,
      });

      if (out.length >= limit) break;
    }

    return out;
  },
});

export const upsertMarksForStudentBySchool = mutation({
  args: {
    studentId: v.id("users"),
    classLevel: v.union(v.literal("Class10"), v.literal("Class12")),
    streams: v.object({
      science: v.object({
        physics: v.number(),
        chemistry: v.number(),
        biology: v.number(),
        mathematics: v.number(),
        computerScience: v.number(),
      }),
      commerce: v.object({
        accountancy: v.number(),
        businessStudies: v.number(),
        economics: v.number(),
        mathematics: v.number(),
        english: v.number(),
      }),
      arts: v.object({
        history: v.number(),
        politicalScience: v.number(),
        sociology: v.number(),
        psychology: v.number(),
        languages: v.number(),
        fineArts: v.number(),
      }),
      vocational: v.object({
        agriculture: v.number(),
        it: v.number(),
        homeScience: v.number(),
        hospitality: v.number(),
        design: v.number(),
        skills: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const current = await getCurrentUser(ctx);
    if (!current) throw new Error("Not authenticated");

    // Reuse studentMarks.upsertForStudent to keep single source of truth
    // But we cannot call it directly; replicate minimal logic or insert/patch here.
    // We'll compute same as studentMarks.upsertForStudent with schoolId set.

    // Normalize to 0-100
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    const normObj = <T extends Record<string, number>>(o: T): T => {
      const out = { ...o };
      for (const k of Object.keys(out)) {
        // @ts-expect-error generic assign
        out[k] = clamp(out[k] as unknown as number);
      }
      return out;
    };

    const streams = {
      science: normObj(args.streams.science),
      commerce: normObj(args.streams.commerce),
      arts: normObj(args.streams.arts),
      vocational: normObj(args.streams.vocational),
    };

    const avg = (o: Record<string, number>) =>
      Object.values(o).reduce((s, v) => s + v, 0) / Object.values(o).length;

    const averages = {
      science: avg(streams.science),
      commerce: avg(streams.commerce),
      arts: avg(streams.arts),
      vocational: avg(streams.vocational),
    };

    const existing = await ctx.db
      .query("studentMarks")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("classLevel"), args.classLevel))
      .first();

    const doc = {
      studentId: args.studentId,
      schoolId: current._id,
      classLevel: args.classLevel,
      streams,
      averages,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return { _id: existing._id, ...doc };
    } else {
      const _id = await ctx.db.insert("studentMarks", doc);
      return { _id, ...doc };
    }
  },
});
