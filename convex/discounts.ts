import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyStoreOwnership } from "./utils";

export const listByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    return await ctx.db
      .query("discounts")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const validate = query({
  args: {
    storeId: v.id("stores"),
    code: v.string(),
    cartTotal: v.number(),
  },
  handler: async (ctx, args) => {
    const discount = await ctx.db
      .query("discounts")
      .withIndex("by_store_and_code", (q) =>
        q.eq("storeId", args.storeId).eq("code", args.code.toUpperCase()),
      )
      .first();

    if (!discount || !discount.isActive) {
      return { valid: false, message: "Invalid or inactive discount code" };
    }

    if (discount.minOrderAmount && args.cartTotal < discount.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount is ${discount.minOrderAmount}`,
      };
    }

    return { valid: true, discount };
  },
});

export const create = mutation({
  args: {
    storeId: v.id("stores"),
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("fixed")),
    value: v.number(),
    minOrderAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    return await ctx.db.insert("discounts", {
      ...args,
      code: args.code.toUpperCase(),
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    storeId: v.id("stores"),
    discountId: v.id("discounts"),
    value: v.optional(v.number()),
    type: v.optional(v.union(v.literal("percentage"), v.literal("fixed"))),
    minOrderAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const { storeId, discountId, ...updates } = args;
    await ctx.db.patch(discountId, updates);
  },
});

export const toggle = mutation({
  args: {
    storeId: v.id("stores"),
    discountId: v.id("discounts"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const discount = await ctx.db.get(args.discountId);
    if (discount) {
      await ctx.db.patch(args.discountId, { isActive: !discount.isActive });
    }
  },
});

export const remove = mutation({
  args: {
    storeId: v.id("stores"),
    discountId: v.id("discounts"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    await ctx.db.delete(args.discountId);
  },
});
