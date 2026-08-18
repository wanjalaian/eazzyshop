"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productTitle: string;
  variantId?: string;
  variantTitle?: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  storeSlug: string | null;

  // Actions
  setStoreSlug: (slug: string) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;

  // Computed helpers (call as functions)
  getItemCount: () => number;
  getSubtotal: () => number;
}

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      storeSlug: null,

      setStoreSlug: (slug) => {
        const current = get().storeSlug;
        // If switching stores, clear the cart
        if (current && current !== slug) {
          set({ items: [], storeSlug: slug });
        } else {
          set({ storeSlug: slug });
        }
      },

      addItem: (item, quantity = 1) => {
        set((state) => {
          const key = itemKey(item.productId, item.variantId);
          const existingIndex = state.items.findIndex(
            (i) => itemKey(i.productId, i.variantId) === key
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }

          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.variantId) !== itemKey(productId, variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            itemKey(item.productId, item.variantId) === itemKey(productId, variantId)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        );
      },
    }),
    {
      name: "eazzyshop-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        storeSlug: state.storeSlug,
      }),
    }
  )
);

// SSR-safe hook — prevents hydration mismatch
import { useState, useEffect } from "react";

export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    items: isHydrated ? cart.items : [],
    itemCount: isHydrated ? cart.getItemCount() : 0,
    subtotal: isHydrated ? cart.getSubtotal() : 0,
    storeSlug: isHydrated ? cart.storeSlug : null,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    setStoreSlug: cart.setStoreSlug,
    isHydrated,
  };
}
