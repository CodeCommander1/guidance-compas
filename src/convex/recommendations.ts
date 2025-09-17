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
      
      // Match interests (safely access optional custom user fields)
      const userInterests = (user as { interests?: string[] } | undefined)?.interests;
      if (userInterests && userInterests.length > 0) {
        const matchingInterests = userInterests.filter((interest: string) =>
          course.subjects.some((subject: string) =>
            subject.toLowerCase().includes(interest.toLowerCase())
          ) ||
          course.careerOpportunities.some((career: string) =>
            career.toLowerCase().includes(interest.toLowerCase())
          )
        );
        
        if (matchingInterests.length > 0) {
          score += matchingInterests.length * 15;
          reasons.push(`Matches your interests: ${matchingInterests.join(", ")}`);
        }
      }
      
      // Education level compatibility (safely access optional custom user field)
      const educationLevel = (user as { educationLevel?: string } | undefined)?.educationLevel;
      if (educationLevel === "class_12") {
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

export const computeStreamRecommendation = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const user = args.userId ? await ctx.db.get(args.userId) : await getCurrentUser(ctx);
    if (!user) throw new Error("User not found");

    // Get latest marks and assessment
    const marks = await ctx.db
      .query("studentMarks")
      .withIndex("by_student", (q) => q.eq("studentId", user._id))
      .order("desc")
      .first();

    const assessment = await ctx.db
      .query("assessments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (!marks || !assessment) {
      return {
        error: "Missing data",
        hasMarks: !!marks,
        hasAssessment: !!assessment,
      };
    }

    // Normalize interest scores to 0-100 scale
    // Max possible per stream depends on how many questions map to it
    const maxScores = {
      science: 20, // 4 questions max (3 direct + 1 shared) * 5 points
      commerce: 20, // 4 questions max (3 direct + 1 shared) * 5 points  
      arts: 20, // 4 questions max (3 direct + 1 shared) * 5 points
      vocational: 15, // 3 questions max (3 direct) * 5 points
    };

    const normalizedInterest = {
      science: (assessment.interestScores.science / maxScores.science) * 100,
      commerce: (assessment.interestScores.commerce / maxScores.commerce) * 100,
      arts: (assessment.interestScores.arts / maxScores.arts) * 100,
      vocational: (assessment.interestScores.vocational / maxScores.vocational) * 100,
    };

    // Apply weighted formula: 60% academic + 40% interest
    const finalScores = {
      science: (0.6 * marks.averages.science) + (0.4 * normalizedInterest.science),
      commerce: (0.6 * marks.averages.commerce) + (0.4 * normalizedInterest.commerce),
      arts: (0.6 * marks.averages.arts) + (0.4 * normalizedInterest.arts),
      vocational: (0.6 * marks.averages.vocational) + (0.4 * normalizedInterest.vocational),
    };

    // Find primary and alternative recommendations
    const sortedStreams = Object.entries(finalScores)
      .sort(([,a], [,b]) => b - a)
      .map(([stream, score]) => ({ stream: stream as keyof typeof finalScores, score }));

    const primary = sortedStreams[0];
    const second = sortedStreams[1];

    let alternative: { stream: string; reason: "within_5" | "within_10" } | undefined;

    if (second && primary.score > 0) {
      const percentDiff = ((primary.score - second.score) / primary.score) * 100;
      if (percentDiff <= 5) {
        alternative = { stream: second.stream, reason: "within_5" };
      } else if (percentDiff <= 10) {
        alternative = { stream: second.stream, reason: "within_10" };
      }
    }

    return {
      primary: primary.stream,
      alternative,
      scores: finalScores,
      academic: marks.averages,
      interest: normalizedInterest,
      rawInterest: assessment.interestScores,
    };
  },
});