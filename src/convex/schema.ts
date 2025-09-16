import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Education levels
export const EDUCATION_LEVELS = {
  CLASS_10: "class_10",
  CLASS_12: "class_12",
  GRADUATE: "graduate",
} as const;

export const educationLevelValidator = v.union(
  v.literal(EDUCATION_LEVELS.CLASS_10),
  v.literal(EDUCATION_LEVELS.CLASS_12),
  v.literal(EDUCATION_LEVELS.GRADUATE),
);

// Course categories
export const COURSE_CATEGORIES = {
  ARTS: "arts",
  SCIENCE: "science",
  COMMERCE: "commerce",
  ENGINEERING: "engineering",
  MEDICAL: "medical",
  LAW: "law",
  MANAGEMENT: "management",
} as const;

export const courseCategoryValidator = v.union(
  v.literal(COURSE_CATEGORIES.ARTS),
  v.literal(COURSE_CATEGORIES.SCIENCE),
  v.literal(COURSE_CATEGORIES.COMMERCE),
  v.literal(COURSE_CATEGORIES.ENGINEERING),
  v.literal(COURSE_CATEGORIES.MEDICAL),
  v.literal(COURSE_CATEGORIES.LAW),
  v.literal(COURSE_CATEGORIES.MANAGEMENT),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Student profile fields
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
      educationLevel: v.optional(educationLevelValidator),
      interests: v.optional(v.array(v.string())),
      location: v.optional(v.string()),
      state: v.optional(v.string()),
      city: v.optional(v.string()),
      preferredLanguage: v.optional(v.string()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Courses table
    courses: defineTable({
      name: v.string(),
      shortName: v.string(), // B.A., B.Sc., etc.
      description: v.string(),
      category: courseCategoryValidator,
      duration: v.string(), // "3 years", "4 years"
      eligibility: v.string(),
      subjects: v.array(v.string()),
      careerOpportunities: v.array(v.string()),
      governmentExams: v.array(v.string()),
      averageSalary: v.optional(v.string()),
      isActive: v.boolean(),
    }).index("by_category", ["category"])
      .index("by_active", ["isActive"]),

    // Colleges table
    colleges: defineTable({
      name: v.string(),
      type: v.string(), // "Government", "Private", "Aided"
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
      facilities: v.array(v.string()), // ["Hostel", "Library", "Labs", "WiFi"]
      coursesOffered: v.array(v.id("courses")),
      cutoffs: v.optional(v.object({
        general: v.optional(v.number()),
        obc: v.optional(v.number()),
        sc: v.optional(v.number()),
        st: v.optional(v.number()),
      })),
      fees: v.optional(v.object({
        tuition: v.optional(v.number()),
        hostel: v.optional(v.number()),
        other: v.optional(v.number()),
      })),
      isActive: v.boolean(),
    }).index("by_city", ["city"])
      .index("by_state", ["state"])
      .index("by_type", ["type"])
      .index("by_active", ["isActive"]),

    // Career paths table
    careerPaths: defineTable({
      title: v.string(),
      description: v.string(),
      courseId: v.id("courses"),
      requiredSkills: v.array(v.string()),
      jobRoles: v.array(v.string()),
      salaryRange: v.string(),
      growthProspects: v.string(),
      industryDemand: v.string(), // "High", "Medium", "Low"
      workEnvironment: v.string(),
      isActive: v.boolean(),
    }).index("by_course", ["courseId"])
      .index("by_active", ["isActive"]),

    // User recommendations
    recommendations: defineTable({
      userId: v.id("users"),
      courseId: v.id("courses"),
      score: v.number(), // 0-100 match score
      reasons: v.array(v.string()),
      isViewed: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_user_and_score", ["userId", "score"]),

    // Important dates and notifications
    importantDates: defineTable({
      title: v.string(),
      description: v.string(),
      date: v.number(), // timestamp
      type: v.string(), // "admission", "exam", "scholarship", "counseling"
      courseIds: v.optional(v.array(v.id("courses"))),
      collegeIds: v.optional(v.array(v.id("colleges"))),
      state: v.optional(v.string()),
      isActive: v.boolean(),
    }).index("by_date", ["date"])
      .index("by_type", ["type"])
      .index("by_active", ["isActive"]),

    // Educational resources
    resources: defineTable({
      title: v.string(),
      description: v.string(),
      type: v.string(), // "ebook", "video", "article", "course"
      url: v.optional(v.string()),
      fileId: v.optional(v.id("_storage")),
      category: courseCategoryValidator,
      tags: v.array(v.string()),
      isActive: v.boolean(),
    }).index("by_category", ["category"])
      .index("by_type", ["type"])
      .index("by_active", ["isActive"]),

    // User bookmarks
    bookmarks: defineTable({
      userId: v.id("users"),
      type: v.string(), // "course", "college", "career", "resource"
      itemId: v.string(), // ID of the bookmarked item
    }).index("by_user", ["userId"])
      .index("by_user_and_type", ["userId", "type"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;