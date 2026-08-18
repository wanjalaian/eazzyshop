"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import Image from "next/image";

export function StoreHeader({ store, slug }: { store: any, slug: string }) {
  const cart = useCart();
  const storeItemCount = cart.itemCount;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E8E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <button className="p-2 text-[#1A1A19] hover:bg-[#F5F0EB] rounded-full transition-colors md:hidden">
            <Search size={20} />
          </button>
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6560]" size={18} />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full bg-[#F5F0EB] border-transparent rounded-[20px] py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--store-accent)] focus:bg-white text-[#1A1A19]"
            />
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
          <Link href={`/store/${slug}`} className="flex items-center">
            {store?.logoUrl ? (
              <Image src={store.logoUrl} alt={store.name} width={120} height={40} className="max-h-10 object-contain" />
            ) : (
              <span className="font-serif text-2xl font-bold text-[#1A1A19] tracking-tight">{store?.name}</span>
            )}
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <Link 
            href={`/store/${slug}/cart`}
            className="relative p-2 text-[#1A1A19] hover:bg-[#F5F0EB] rounded-full transition-colors flex items-center"
          >
            <ShoppingBag size={20} />
            {storeItemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--store-accent,#C4653A)] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {storeItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
