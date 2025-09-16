import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUpcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db
      .query("importantDates")
      .withIndex("by_date", (q) => q.gte("date", now))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(args.limit || 10);
  },
});

export const getByType = query({
  args: { 
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("importantDates")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(args.limit || 20);
  },
});
