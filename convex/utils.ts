import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

export async function verifyStoreOwnership(
  ctx: QueryCtx | MutationCtx,
  storeId: Id<"stores">,
) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const store = await ctx.db.get(storeId);
  if (!store) {
    throw new Error("Store not found");
  }
  if (store.ownerId !== userId) {
    throw new Error("Unauthorized: You do not own this store");
  }
  return { userId, store };
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
