import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const updateMyName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    await ctx.db.patch(user._id, { name: args.name });
    return true;
  },
});
