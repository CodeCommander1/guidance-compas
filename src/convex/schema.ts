import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const courseCategoryValidator = v.union(
  v.literal("science"),
  v.literal("commerce"), 
  v.literal("arts"),
  v.literal("management"),
  v.literal("vocational")
);

export default defineSchema({
  // Register Convex Auth tables and extend the users table with your fields
  ...authTables,

  courses: defineTable({
    name: v.string(),
    shortName: v.string(),
    description: v.string(),
    category: courseCategoryValidator,
    duration: v.string(),
    eligibility: v.string(),
    subjects: v.array(v.string()),
    careerOpportunities: v.array(v.string()),
    governmentExams: v.array(v.string()),
    averageSalary: v.string(),
    isActive: v.boolean(),
  }).index("by_category", ["category"]),

  colleges: defineTable({
    name: v.string(),
    type: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    establishedYear: v.optional(v.number()),
    affiliation: v.optional(v.string()),
    accreditation: v.optional(v.string()),
    facilities: v.array(v.string()),
    coursesOffered: v.array(v.id("courses")),
    cutoffs: v.optional(v.object({
      general: v.number(),
      obc: v.number(),
      sc: v.number(),
      st: v.number(),
    })),
    fees: v.optional(v.object({
      tuition: v.number(),
      hostel: v.number(),
      other: v.number(),
    })),
    isActive: v.boolean(),
  }).index("by_city", ["city"])
    .index("by_state", ["state"])
    .index("by_type", ["type"]),

  careerPaths: defineTable({
    title: v.string(),
    description: v.string(),
    courseId: v.id("courses"),
    requiredSkills: v.array(v.string()),
    jobRoles: v.array(v.string()),
    salaryRange: v.string(),
    growthProspects: v.string(),
    industryDemand: v.string(),
    workEnvironment: v.string(),
    isActive: v.boolean(),
  }).index("by_course", ["courseId"]),

  recommendations: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    score: v.number(),
    reasons: v.array(v.string()),
    isViewed: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_user_and_score", ["userId", "score"]),

  importantDates: defineTable({
    title: v.string(),
    description: v.string(),
    date: v.number(),
    type: v.string(),
    courseIds: v.optional(v.array(v.id("courses"))),
    collegeIds: v.optional(v.array(v.id("colleges"))),
    state: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_date", ["date"])
    .index("by_type", ["type"]),

  resources: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    url: v.string(),
    category: courseCategoryValidator,
    tags: v.array(v.string()),
    isActive: v.boolean(),
  }).index("by_category", ["category"]),

  // New tables for enhanced recommendation system
  studentMarks: defineTable({
    studentId: v.id("users"),
    schoolId: v.optional(v.id("users")),
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
    averages: v.object({
      science: v.number(),
      commerce: v.number(),
      arts: v.number(),
      vocational: v.number(),
    }),
  }).index("by_student", ["studentId"])
    .index("by_school", ["schoolId"]),

  assessments: defineTable({
    userId: v.id("users"),
    answers: v.array(v.object({
      id: v.string(),
      value: v.number(),
    })),
    interestScores: v.object({
      science: v.number(),
      commerce: v.number(),
      arts: v.number(),
      vocational: v.number(),
    }),
    totalQuestions: v.number(),
  }).index("by_user", ["userId"]),
});