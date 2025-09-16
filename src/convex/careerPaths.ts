import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("careerPaths")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const careerPaths = await ctx.db
      .query("careerPaths")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(args.limit || 50);
    
    // Get course details for each career path
    const careerPathsWithCourses = await Promise.all(
      careerPaths.map(async (path) => {
        const course = await ctx.db.get(path.courseId);
        return {
          ...path,
          course,
        };
      })
    );
    
    return careerPathsWithCourses.filter(path => path.course);
  },
});
