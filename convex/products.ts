import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyStoreOwnership, generateSlug } from "./utils";

export const listByStore = query({
  args: {
    storeId: v.id("stores"),
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.categoryId) {
      return await ctx.db
        .query("products")
        .withIndex("by_store_and_category", (q) =>
          q.eq("storeId", args.storeId).eq("categoryId", args.categoryId!),
        )
        .take(limit);
    }

    return await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .take(limit);
  },
});

export const getBySlug = query({
  args: {
    storeId: v.id("stores"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_store_and_slug", (q) =>
        q.eq("storeId", args.storeId).eq("slug", args.slug),
      )
      .first();
  },
});

export const search = query({
  args: {
    storeId: v.id("stores"),
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    const lowerQuery = args.searchQuery.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(lowerQuery));
  },
});

export const create = mutation({
  args: {
    storeId: v.id("stores"),
    categoryId: v.optional(v.id("categories")),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    imageStorageIds: v.array(v.id("_storage")),
    hasVariants: v.boolean(),
    variantOptions: v.optional(
      v.array(
        v.object({
          name: v.string(),
          values: v.array(v.string()),
        }),
      ),
    ),
    variants: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          price: v.number(),
          compareAtPrice: v.optional(v.number()),
          stockQuantity: v.optional(v.number()),
          isAvailable: v.boolean(),
        }),
      ),
    ),
    isAvailable: v.boolean(),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);

    if (args.imageStorageIds.length > 5) {
      throw new Error("Max 5 images allowed");
    }

    const slug = generateSlug(args.title);

    return await ctx.db.insert("products", {
      ...args,
      slug,
      salesCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    storeId: v.id("stores"),
    productId: v.id("products"),
    categoryId: v.optional(v.id("categories")),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    imageStorageIds: v.optional(v.array(v.id("_storage"))),
    hasVariants: v.optional(v.boolean()),
    variantOptions: v.optional(
      v.array(
        v.object({
          name: v.string(),
          values: v.array(v.string()),
        }),
      ),
    ),
    variants: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          price: v.number(),
          compareAtPrice: v.optional(v.number()),
          stockQuantity: v.optional(v.number()),
          isAvailable: v.boolean(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const { storeId, productId, ...updates } = args;
    await verifyStoreOwnership(ctx, storeId);

    if (updates.imageStorageIds && updates.imageStorageIds.length > 5) {
      throw new Error("Max 5 images allowed");
    }

    const patch: any = { ...updates };
    if (updates.title) {
      patch.slug = generateSlug(updates.title);
    }

    await ctx.db.patch(productId, patch);
  },
});

export const duplicate = mutation({
  args: {
    storeId: v.id("stores"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    const newTitle = `${product.title} (Copy)`;
    const newSlug = generateSlug(newTitle);

    const { _id, _creationTime, ...rest } = product;

    return await ctx.db.insert("products", {
      ...rest,
      title: newTitle,
      slug: newSlug,
      salesCount: 0,
    });
  },
});

export const toggleAvailability = mutation({
  args: {
    storeId: v.id("stores"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, { isAvailable: !product.isAvailable });
    }
  },
});

export const toggleFeatured = mutation({
  args: {
    storeId: v.id("stores"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, { isFeatured: !product.isFeatured });
    }
  },
});

export const remove = mutation({
  args: {
    storeId: v.id("stores"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await verifyStoreOwnership(ctx, args.storeId);
    const product = await ctx.db.get(args.productId);
    if (!product) return;

    for (const storageId of product.imageStorageIds) {
      await ctx.storage.delete(storageId);
    }

    await ctx.db.delete(args.productId);
  },
});

export const incrementSalesCount = mutation({
  args: {
    storeId: v.id("stores"),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (product && product.storeId === args.storeId) {
      await ctx.db.patch(args.productId, {
        salesCount: product.salesCount + args.quantity,
      });
    }
  },
});
