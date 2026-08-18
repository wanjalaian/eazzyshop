import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyStoreOwnership, generateSlug } from "./utils";

export const listByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    return await ctx.db.insert("categories", {
      ...args,
      slug: generateSlug(args.name),
    });
  },
});

export const update = mutation({
  args: {
    storeId: v.id("stores"),
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const { storeId, categoryId, ...updates } = args;
    const patch: any = { ...updates };
    if (updates.name) {
      patch.slug = generateSlug(updates.name);
    }
    await ctx.db.patch(categoryId, patch);
  },
});

export const remove = mutation({
  args: {
    storeId: v.id("stores"),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    await ctx.db.delete(args.categoryId);
  },
});
