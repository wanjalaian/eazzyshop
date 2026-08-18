"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function BottomNav({ storeSlug }: { storeSlug: string }) {
  const pathname = usePathname();
  const cart = useCart();
  
  // Just use count for any items as this is store specific anyway based on route
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { icon: Home, label: "Home", href: `/store/${storeSlug}` },
    { icon: Search, label: "Search", href: `/store/${storeSlug}/search` },
    { icon: ShoppingBag, label: "Bag", href: `/store/${storeSlug}/cart`, badge: itemCount },
    { icon: User, label: "Account", href: `/store/${storeSlug}/account` },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-[#FAFAF7] border-t border-[#E8E2DC] flex items-center justify-around z-50 md:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 relative ${
              isActive ? "text-[var(--store-accent)]" : "text-[#6B6560]"
            }`}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge ? (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-[var(--store-accent)] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium font-sans">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
