'use client';

import Link from 'next/link';
import { Home, Package, FolderTree, ShoppingBag, Users, Tag, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function DashboardSidebar({ store }: { store: any }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Discounts', href: '/dashboard/discounts', icon: Tag },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-60 h-screen border-r border-[#E8E2DC] bg-white flex flex-col font-dm-sans">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#1A1A19]">EazzyShop</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#F3E8E2] text-[#C4653A]' : 'text-[#6B6560] hover:bg-[#F5F0EB] hover:text-[#1A1A19]'}`}>
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#E8E2DC]">
        <a href={`/${store.slug}`} target="_blank" rel="noreferrer" className="text-sm text-[#6B6560] hover:text-[#1A1A19] truncate block">
          {store.slug}.eazzyshop.com
        </a>
      </div>
    </aside>
  );
}
