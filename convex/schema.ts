import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  stores: defineTable({
    ownerId: v.string(),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    whatsappNumber: v.string(),
    currency: v.string(),
    currencySymbol: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    primaryColor: v.optional(v.string()),
    announcementBar: v.optional(v.string()),
    deliveryLocations: v.optional(
      v.array(
        v.object({
          name: v.string(),
          fee: v.number(),
        }),
      ),
    ),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        tiktok: v.optional(v.string()),
        facebook: v.optional(v.string()),
      }),
    ),
    isLive: v.boolean(),
    orderCounter: v.number(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  categories: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    slug: v.string(),
    sortOrder: v.number(),
  }).index("by_store", ["storeId"]),

  products: defineTable({
    storeId: v.id("stores"),
    categoryId: v.optional(v.id("categories")),
    title: v.string(),
    slug: v.string(),
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
    salesCount: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_store_and_available", ["storeId", "isAvailable"])
    .index("by_store_and_category", ["storeId", "categoryId"])
    .index("by_store_and_slug", ["storeId", "slug"]),

  customers: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    phone: v.string(),
    deliveryAddress: v.optional(v.string()),
    totalSpent: v.number(),
    orderCount: v.number(),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    lastOrderAt: v.optional(v.number()),
  })
    .index("by_store", ["storeId"])
    .index("by_store_and_phone", ["storeId", "phone"]),

  orders: defineTable({
    storeId: v.id("stores"),
    orderNumber: v.number(),
    customerId: v.optional(v.id("customers")),
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
    isManualEntry: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_store_and_status", ["storeId", "status"]),

  discounts: defineTable({
    storeId: v.id("stores"),
    code: v.string(),
    type: v.string(),
    value: v.number(),
    minOrderAmount: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_store", ["storeId"])
    .index("by_store_and_code", ["storeId", "code"]),
});
