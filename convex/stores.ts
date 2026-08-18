import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { verifyStoreOwnership } from "./utils";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!store || !store.isLive) {
      return null;
    }

    const logoUrl = store.logoStorageId
      ? await ctx.storage.getUrl(store.logoStorageId)
      : null;
    const bannerUrl = store.bannerStorageId
      ? await ctx.storage.getUrl(store.bannerStorageId)
      : null;

    return { ...store, logoUrl, bannerUrl };
  },
});

export const getByOwner = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const store = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    if (!store) return null;

    const logoUrl = store.logoStorageId
      ? await ctx.storage.getUrl(store.logoStorageId)
      : null;
    const bannerUrl = store.bannerStorageId
      ? await ctx.storage.getUrl(store.bannerStorageId)
      : null;

    return { ...store, logoUrl, bannerUrl };
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    whatsappNumber: v.string(),
    currency: v.string(),
    currencySymbol: v.string(),
    primaryColor: v.optional(v.string()),
    isLive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // 1. If merchant already owns a store, update it
    const ownerStore = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    if (ownerStore) {
      await ctx.db.patch(ownerStore._id, {
        ...args,
        isLive: args.isLive ?? true,
      });
      return ownerStore._id;
    }

    // 2. Auto-resolve slug collision if taken by another user
    let finalSlug = args.slug;
    const existing = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", finalSlug))
      .first();

    if (existing) {
      finalSlug = `${args.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const storeId = await ctx.db.insert("stores", {
      ...args,
      slug: finalSlug,
      ownerId: userId,
      isLive: args.isLive ?? true,
      orderCounter: 1000,
      createdAt: Date.now(),
    });

    return storeId;
  },
});

export const update = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    currency: v.optional(v.string()),
    currencySymbol: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        tiktok: v.optional(v.string()),
        facebook: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { storeId, ...updates } = args;
    await verifyStoreOwnership(ctx, storeId);
    await ctx.db.patch(storeId, updates);
  },
});

export const updateBranding = mutation({
  args: {
    storeId: v.id("stores"),
    logoStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    primaryColor: v.optional(v.string()),
    announcementBar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { storeId, ...updates } = args;
    await verifyStoreOwnership(ctx, storeId);
    await ctx.db.patch(storeId, updates);
  },
});

export const updateDeliveryLocations = mutation({
  args: {
    storeId: v.id("stores"),
    deliveryLocations: v.array(
      v.object({
        name: v.string(),
        fee: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { storeId, deliveryLocations } = args;
    await verifyStoreOwnership(ctx, storeId);
    await ctx.db.patch(storeId, { deliveryLocations });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const toggleLive = mutation({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const { store } = await verifyStoreOwnership(ctx, args.storeId);
    await ctx.db.patch(args.storeId, { isLive: !store.isLive });
  },
});
