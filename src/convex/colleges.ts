import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("colleges").filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.city) {
      query = query.filter((q) => q.eq(q.field("city"), args.city));
    }
    
    if (args.state) {
      query = query.filter((q) => q.eq(q.field("state"), args.state));
    }
    
    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }
    
    return await query.take(args.limit || 50);
  },
});

export const getById = query({
  args: { id: v.id("colleges") },
  handler: async (ctx, args) => {
    const college = await ctx.db.get(args.id);
    if (!college) return null;
    
    // Get course details for courses offered
    const courses = await Promise.all(
      college.coursesOffered.map(courseId => ctx.db.get(courseId))
    );
    
    return {
      ...college,
      courses: courses.filter(Boolean),
    };
  },
});

export const getNearby = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radius: v.optional(v.number()), // in km
  },
  handler: async (ctx, args) => {
    // Simplified nearby search - in production use geospatial queries
    const colleges = await ctx.db
      .query("colleges")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    const radius = args.radius || 50; // default 50km
    
    return colleges.filter(college => {
      if (!college.latitude || !college.longitude) return false;
      
      // Simple distance calculation (Haversine formula would be more accurate)
      const latDiff = Math.abs(college.latitude - args.latitude);
      const lonDiff = Math.abs(college.longitude - args.longitude);
      const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // rough km conversion
      
      return distance <= radius;
    });
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const colleges = await ctx.db
      .query("colleges")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return colleges.filter(college => 
      college.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      college.city.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      college.state.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});
