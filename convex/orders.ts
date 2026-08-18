import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyStoreOwnership } from "./utils";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const listByStore = query({
  args: {
    storeId: v.id("stores"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_store_and_status", (q) =>
          q.eq("storeId", args.storeId).eq("status", args.status!),
        )
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .take(limit);
  },
});

export const getById = query({
  args: {
    storeId: v.id("stores"),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const logStorefrontLead = mutation({
  args: {
    storeId: v.id("stores"),
    customerName: v.string(),
    customerPhone: v.string(),
    deliveryLocation: v.optional(v.string()),
    deliveryFee: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        variantId: v.optional(v.string()),
        title: v.string(),
        variantTitle: v.optional(v.string()),
        quantity: v.number(),
        price: v.number(),
      }),
    ),
    discountCode: v.optional(v.string()),
    discountAmount: v.number(),
    totalAmount: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"orders">> => {
    const store = await ctx.db.get(args.storeId);
    if (!store) throw new Error("Store not found");

    const orderNumber = store.orderCounter;
    await ctx.db.patch(args.storeId, { orderCounter: orderNumber + 1 });

    // Upsert customer inline to avoid circular reference issues
    const existingCustomer = await ctx.db
      .query("customers")
      .withIndex("by_store_and_phone", (q) =>
        q.eq("storeId", args.storeId).eq("phone", args.customerPhone),
      )
      .first();

    let customerId: Id<"customers">;

    if (existingCustomer) {
      customerId = existingCustomer._id;
      await ctx.db.patch(customerId, {
        name: args.customerName,
        deliveryAddress: args.deliveryLocation || existingCustomer.deliveryAddress,
        totalSpent: existingCustomer.totalSpent + args.totalAmount,
        orderCount: existingCustomer.orderCount + 1,
        lastOrderAt: Date.now(),
      });
    } else {
      customerId = await ctx.db.insert("customers", {
        storeId: args.storeId,
        name: args.customerName,
        phone: args.customerPhone,
        deliveryAddress: args.deliveryLocation,
        totalSpent: args.totalAmount,
        orderCount: 1,
        lastOrderAt: Date.now(),
      });
    }

    return await ctx.db.insert("orders", {
      ...args,
      customerId,
      orderNumber,
      status: "pending",
      paymentStatus: "unpaid",
      isManualEntry: false,
      createdAt: Date.now(),
    });
  },
});

export const createManual = mutation({
  args: {
    storeId: v.id("stores"),
    customerName: v.string(),
    customerPhone: v.string(),
    deliveryLocation: v.optional(v.string()),
    deliveryFee: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        variantId: v.optional(v.string()),
        title: v.string(),
        variantTitle: v.optional(v.string()),
        quantity: v.number(),
        price: v.number(),
      }),
    ),
    discountCode: v.optional(v.string()),
    discountAmount: v.number(),
    totalAmount: v.number(),
    status: v.string(),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"orders">> => {
    const { store } = await verifyStoreOwnership(ctx, args.storeId);

    const orderNumber = store.orderCounter;
    await ctx.db.patch(args.storeId, { orderCounter: orderNumber + 1 });

    // Upsert customer inline
    const existingCustomer = await ctx.db
      .query("customers")
      .withIndex("by_store_and_phone", (q) =>
        q.eq("storeId", args.storeId).eq("phone", args.customerPhone),
      )
      .first();

    let customerId: Id<"customers">;

    if (existingCustomer) {
      customerId = existingCustomer._id;
      await ctx.db.patch(customerId, {
        name: args.customerName,
        deliveryAddress: args.deliveryLocation || existingCustomer.deliveryAddress,
        totalSpent: existingCustomer.totalSpent + args.totalAmount,
        orderCount: existingCustomer.orderCount + 1,
        lastOrderAt: Date.now(),
      });
    } else {
      customerId = await ctx.db.insert("customers", {
        storeId: args.storeId,
        name: args.customerName,
        phone: args.customerPhone,
        deliveryAddress: args.deliveryLocation,
        totalSpent: args.totalAmount,
        orderCount: 1,
        lastOrderAt: Date.now(),
      });
    }

    return await ctx.db.insert("orders", {
      ...args,
      customerId,
      orderNumber,
      isManualEntry: true,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    storeId: v.id("stores"),
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});

export const updatePaymentStatus = mutation({
  args: {
    storeId: v.id("stores"),
    orderId: v.id("orders"),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    await ctx.db.patch(args.orderId, { paymentStatus: args.paymentStatus });
  },
});

export const getStats = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .take(1000);

    const paidOrders = orders.filter((o) => o.paymentStatus !== "unpaid");
    const revenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const aov = paidOrders.length > 0 ? revenue / paidOrders.length : 0;

    return {
      totalRevenue: revenue,
      orderCount: orders.length,
      paidOrderCount: paidOrders.length,
      averageOrderValue: Math.round(aov),
    };
  },
});
