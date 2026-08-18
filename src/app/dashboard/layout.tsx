'use client';

import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const store = useQuery(api.stores.getByOwner);

  if (isLoading || store === undefined) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-[#1A1A19] w-8 h-8" /></div>;
  }

  if (!isAuthenticated) {
    redirect('/');
  }

  if (store === null) {
    redirect('/setup');
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:block">
        <DashboardSidebar store={store} />
      </div>
      <main className="flex-1 p-6 font-dm-sans">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#1A1A19]">{store.name}</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${store.isLive ? 'text-[#3D7A4A] bg-[#F5F0EB]' : 'text-[#C9973E] bg-[#F5F0EB]'}`}>
            {store.isLive ? 'Live' : 'Draft'}
          </span>
        </header>
        {children}
      </main>
      <div className="md:hidden fixed bottom-0 w-full h-14 bg-white border-t border-[#E8E2DC] z-50">
        {/* Mobile bottom nav here */}
      </div>
    </div>
  );
}
