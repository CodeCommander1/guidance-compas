import { query } from "./_generated/server";
import { v } from "convex/values";
import { courseCategoryValidator } from "./schema";

export const getByCategory = query({
  args: { 
    category: courseCategoryValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(args.limit || 20);
  },
});

export const getAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(args.limit || 50);
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const resources = await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      resource.tags.some((tag: string) => 
        tag.toLowerCase().includes(args.searchTerm.toLowerCase())
      )
    );
  },
});