import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const getForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    const recommendations = await ctx.db
      .query("recommendations")
      .withIndex("by_user_and_score", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);
    
    // Get course details for each recommendation
    const recommendationsWithCourses = await Promise.all(
      recommendations.map(async (rec) => {
        const course = await ctx.db.get(rec.courseId);
        return {
          ...rec,
          course,
        };
      })
    );
    
    return recommendationsWithCourses.filter(rec => rec.course);
  },
});

export const generateRecommendations = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");
    
    // Clear existing recommendations
    const existingRecs = await ctx.db
      .query("recommendations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    
    for (const rec of existingRecs) {
      await ctx.db.delete(rec._id);
    }
    
    // Get all courses
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Simple recommendation algorithm based on user interests and education level
    const recommendations = courses.map(course => {
      let score = 50; // base score
      const reasons: string[] = [];
      
      // Match interests
      if (user.interests) {
        const matchingInterests = user.interests.filter(interest =>
          course.subjects.some(subject => 
            subject.toLowerCase().includes(interest.toLowerCase())
          ) ||
          course.careerOpportunities.some(career =>
            career.toLowerCase().includes(interest.toLowerCase())
          )
        );
        
        if (matchingInterests.length > 0) {
          score += matchingInterests.length * 15;
          reasons.push(`Matches your interests: ${matchingInterests.join(", ")}`);
        }
      }
      
      // Education level compatibility
      if (user.educationLevel === "class_12") {
        if (course.category === "science" || course.category === "commerce" || course.category === "arts") {
          score += 10;
          reasons.push("Suitable for Class 12 students");
        }
      }
      
      // Popular courses get slight boost
      if (["engineering", "medical", "management"].includes(course.category)) {
        score += 5;
        reasons.push("High demand field");
      }
      
      return {
        courseId: course._id,
        score: Math.min(score, 100),
        reasons,
      };
    });
    
    // Sort by score and take top recommendations
    const topRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    // Save recommendations
    for (const rec of topRecommendations) {
      await ctx.db.insert("recommendations", {
        userId: user._id,
        courseId: rec.courseId,
        score: rec.score,
        reasons: rec.reasons,
        isViewed: false,
      });
    }
    
    return topRecommendations.length;
  },
});

export const markAsViewed = mutation({
  args: { recommendationId: v.id("recommendations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.recommendationId, { isViewed: true });
  },
});
