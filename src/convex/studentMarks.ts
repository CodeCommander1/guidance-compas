import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
 

export const upsertForStudent = mutation({
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
    schoolId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Normalize marks to 0-100 scale and compute averages
    const normalizeSubjects = <T extends Record<string, number>>(subjects: T): T => {
      const normalized = {} as T;
      (Object.keys(subjects) as Array<keyof T>).forEach((key) => {
        const value = subjects[key] as unknown as number;
        (normalized[key] as unknown as number) = Math.max(0, Math.min(100, value));
      });
      return normalized;
    };

    const computeAverage = <T extends Record<string, number>>(subjects: T): number => {
      const values = Object.values(subjects) as number[];
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    };

    // Normalize all streams
    const normalizedStreams: typeof args.streams = {
      science: normalizeSubjects(args.streams.science),
      commerce: normalizeSubjects(args.streams.commerce),
      arts: normalizeSubjects(args.streams.arts),
      vocational: normalizeSubjects(args.streams.vocational),
    };

    // Compute averages per stream
    const averages = {
      science: computeAverage(normalizedStreams.science),
      commerce: computeAverage(normalizedStreams.commerce),
      arts: computeAverage(normalizedStreams.arts),
      vocational: computeAverage(normalizedStreams.vocational),
    };

    // Check if record exists for this student and class level
    const existing = await ctx.db
      .query("studentMarks")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("classLevel"), args.classLevel))
      .first();

    const data = {
      studentId: args.studentId,
      schoolId: args.schoolId,
      classLevel: args.classLevel,
      streams: normalizedStreams,
      averages,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return { ...data, _id: existing._id };
    } else {
      const id = await ctx.db.insert("studentMarks", data);
      return { ...data, _id: id };
    }
  },
});

export const getForStudent = query({
  args: {
    studentId: v.id("users"),
    classLevel: v.optional(v.union(v.literal("Class10"), v.literal("Class12"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("studentMarks")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId));

    if (args.classLevel) {
      query = query.filter((q) => q.eq(q.field("classLevel"), args.classLevel));
    }

    const results = await query.order("desc").take(1);
    return results[0] || null;
  },
});

export const getCurrentUserMarks = query({
  args: {
    classLevel: v.optional(v.union(v.literal("Class10"), v.literal("Class12"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    // Directly query studentMarks instead of runQuery to avoid circular refs
    let q = ctx.db
      .query("studentMarks")
      .withIndex("by_student", (q) => q.eq("studentId", user._id));

    if (args.classLevel) {
      q = q.filter((q) => q.eq(q.field("classLevel"), args.classLevel));
    }

    const results = await q.order("desc").take(1);
    return results[0] || null;
  },
});