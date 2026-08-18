"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/currencies";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";

export function CartDrawer({ storeSlug, store, children }: { storeSlug: string, store: any, children: React.ReactNode }) {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  const storeItems = cart.items;
  const subtotal = cart.subtotal;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-[#FAFAF7] border-l-[#E8E2DC] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-[#E8E2DC]">
          <SheetTitle className="font-serif text-2xl font-semibold text-[#1A1A19]">Your Bag</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {storeItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#6B6560] gap-4">
              <p>Your bag is empty.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-[var(--store-accent,#C4653A)] text-white rounded-[6px] font-bold text-sm tracking-[0.04em] uppercase"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            storeItems.map((item) => (
              <div key={`${item.productId}-${item.variantId || ""}`} className="flex gap-4">
                <div className="w-20 h-24 relative rounded-[8px] overflow-hidden bg-[#F5F0EB] flex-shrink-0">
                  {item.imageUrl && <Image src={item.imageUrl} alt={item.productTitle} fill className="object-cover" />}
                </div>
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div>
                    <h3 className="font-sans font-semibold text-[#1A1A19] text-[15px] leading-tight">{item.productTitle}</h3>
                    {item.variantTitle && (
                      <p className="text-xs text-[#6B6560] mt-1">{item.variantTitle}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#E8E2DC] rounded-[6px] bg-white h-7">
                        <button 
                          className="w-7 h-7 flex items-center justify-center text-[#6B6560]"
                          onClick={() => cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.variantId)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-[#1A1A19] font-medium text-xs">{item.quantity}</span>
                        <button 
                          className="w-7 h-7 flex items-center justify-center text-[#6B6560]"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button 
                        onClick={() => cart.removeItem(item.productId, item.variantId)}
                        className="text-[#C43A3A] p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-[#1A1A19] text-sm">
                      {formatPrice(item.unitPrice * item.quantity, (store?.currency as any) || "KES")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {storeItems.length > 0 && (
          <div className="border-t border-[#E8E2DC] p-6 bg-white flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="font-sans font-medium text-[#6B6560]">Subtotal</span>
              <span className="font-bold text-xl text-[#1A1A19]">
                {formatPrice(subtotal, (store?.currency as any) || "KES")}
              </span>
            </div>
            <p className="text-xs text-[#A89F97]">Delivery and taxes calculated at checkout.</p>
            
            <Link 
              href={`/store/${storeSlug}/cart`}
              onClick={() => setIsOpen(false)}
              className="w-full py-4 rounded-[6px] bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white font-sans font-bold text-sm tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition-colors mt-2"
            >
              Checkout via WhatsApp
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
