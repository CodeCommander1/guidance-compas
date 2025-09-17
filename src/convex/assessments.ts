import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Question mapping to streams - backend source of truth
export const QUESTION_MAPPING = [
  { id: "q1", streams: ["science"] }, // I enjoy solving complex mathematical problems
  { id: "q2", streams: ["science"] }, // I am curious about how things work scientifically
  { id: "q3", streams: ["science"] }, // I like conducting experiments and analyzing results
  { id: "q4", streams: ["commerce"] }, // I am interested in business and entrepreneurship
  { id: "q5", streams: ["commerce"] }, // I enjoy working with numbers and financial data
  { id: "q6", streams: ["commerce"] }, // I like understanding market trends and economics
  { id: "q7", streams: ["arts"] }, // I express myself well through writing or speaking
  { id: "q8", streams: ["arts"] }, // I am interested in history, culture, and society
  { id: "q9", streams: ["arts"] }, // I enjoy creative activities like art, music, or literature
  { id: "q10", streams: ["vocational"] }, // I prefer hands-on, practical work
  { id: "q11", streams: ["vocational"] }, // I enjoy building or creating things with my hands
  { id: "q12", streams: ["vocational"] }, // I like learning technical skills and crafts
  { id: "q13", streams: ["science", "commerce"] }, // I am good at logical reasoning and analysis
  { id: "q14", streams: ["arts", "vocational"] }, // I prefer working on projects that help people directly
  { id: "q15", streams: ["commerce", "arts"] }, // I am comfortable presenting ideas to groups
];

export const submitLikert = mutation({
  args: {
    answers: v.array(v.object({
      id: v.string(),
      value: v.number(), // 1-5 Likert scale
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    // Validate answers
    if (args.answers.length !== 15) {
      throw new Error("Must answer all 15 questions");
    }

    // Compute interest scores per stream
    const interestScores = {
      science: 0,
      commerce: 0,
      arts: 0,
      vocational: 0,
    };

    args.answers.forEach((answer) => {
      const mapping = QUESTION_MAPPING.find(q => q.id === answer.id);
      if (mapping) {
        mapping.streams.forEach((stream) => {
          if (stream in interestScores) {
            interestScores[stream as keyof typeof interestScores] += answer.value;
          }
        });
      }
    });

    // Delete existing assessment for this user
    const existing = await ctx.db
      .query("assessments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Insert new assessment
    const assessmentId = await ctx.db.insert("assessments", {
      userId: user._id,
      answers: args.answers,
      interestScores,
      totalQuestions: 15,
    });

    return { assessmentId, interestScores };
  },
});

export const getLatestForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("assessments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();
  },
});
