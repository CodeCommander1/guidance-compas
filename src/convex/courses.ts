import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { courseCategoryValidator } from "./schema";

export const list = query({
  args: {
    category: v.optional(courseCategoryValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("courses").filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    const courses = await query.take(args.limit || 50);
    return courses;
  },
});

export const getById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPopular = query({
  args: {},
  handler: async (ctx) => {
    // Get popular courses (simplified - in real app would be based on user interactions)
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(6);
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Simple text search (in production, use full-text search)
    return courses.filter(course => 
      course.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      course.subjects.some((subject: string) => 
        subject.toLowerCase().includes(args.searchTerm.toLowerCase())
      )
    );
  },
});