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
