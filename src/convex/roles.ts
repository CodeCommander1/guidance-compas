import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const getCurrentRole = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    return roleDoc ?? null;
  },
});

export const setRole = mutation({
  args: {
    role: v.union(v.literal("student"), v.literal("school"), v.literal("admin")),
    schoolName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    const data = {
      userId: user._id,
      role: args.role,
      schoolName: args.schoolName,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return { _id: existing._id, ...data };
    } else {
      const id = await ctx.db.insert("userRoles", data);
      return { _id: id, ...data };
    }
  },
});

export const isSchool = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    return roleDoc?.role === "school";
  },
});

async function upsertRoleFor(
  ctx: any,
  userId: any,
  role: "student" | "school" | "admin",
  schoolName?: string,
) {
  const existing = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .order("desc")
    .first();

  const data = { userId, role, schoolName };

  if (existing) {
    await ctx.db.patch(existing._id, data);
    return { _id: existing._id, ...data };
  } else {
    const id = await ctx.db.insert("userRoles", data);
    return { _id: id, ...data };
  }
}

export const setRoleByEmail = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("student"), v.literal("school"), v.literal("admin")),
    schoolName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to find the user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      return { ok: false, message: `User not found for email: ${args.email}` };
    }

    const res = await upsertRoleFor(ctx, user._id, args.role, args.schoolName);
    return { ok: true, roleDoc: res };
  },
});

export const assignPresetRoles = mutation({
  args: {},
  handler: async (ctx) => {
    const targets = [
      { email: "ns788476@gmail.com", role: "student" as const },
      { email: "nishanatsingh2131@gmail.com", role: "school" as const, schoolName: "Your School" },
    ];

    const results: Array<{ email: string; ok: boolean; message?: string }> = [];

    for (const t of targets) {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), t.email))
        .first();

      if (!user) {
        results.push({ email: t.email, ok: false, message: "User not found" });
        continue;
      }

      await upsertRoleFor(ctx, user._id, t.role, t.schoolName);
      results.push({ email: t.email, ok: true });
    }

    return { results };
  },
});