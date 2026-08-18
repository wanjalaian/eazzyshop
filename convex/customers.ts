import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { verifyStoreOwnership } from "./utils";

export const listByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const getById = query({
  args: {
    storeId: v.id("stores"),
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.storeId !== args.storeId) return null;

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) => q.eq(q.field("customerId"), args.customerId))
      .collect();

    return { ...customer, orders };
  },
});

export const upsertFromOrder = internalMutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    phone: v.string(),
    deliveryAddress: v.optional(v.string()),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_store_and_phone", (q) =>
        q.eq("storeId", args.storeId).eq("phone", args.phone),
      )
      .first();

    if (existing) {
      const customerId = existing._id;
      await ctx.db.patch(customerId, {
        name: args.name,
        deliveryAddress: args.deliveryAddress || existing.deliveryAddress,
        totalSpent: existing.totalSpent + args.amount,
        orderCount: existing.orderCount + 1,
        lastOrderAt: Date.now(),
      });
      return customerId;
    } else {
      return await ctx.db.insert("customers", {
        storeId: args.storeId,
        name: args.name,
        phone: args.phone,
        deliveryAddress: args.deliveryAddress,
        totalSpent: args.amount,
        orderCount: 1,
        lastOrderAt: Date.now(),
      });
    }
  },
});

export const update = mutation({
  args: {
    storeId: v.id("stores"),
    customerId: v.id("customers"),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    deliveryAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const { storeId, customerId, ...updates } = args;
    await ctx.db.patch(customerId, updates);
  },
});

export const getTopBySpend = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);

    const customers = await ctx.db
      .query("customers")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    return customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
  },
});
