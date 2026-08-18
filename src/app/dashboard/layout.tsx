'use client';

import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const store = useQuery(
    api.stores.getByOwner,
    isAuthenticated ? {} : ('skip' as any)
  );
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && store === null) {
      router.push('/setup');
    }
  }, [isLoading, isAuthenticated, store, router]);

  if (isLoading || (isAuthenticated && store === undefined)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAF7] gap-3">
        <Loader2 className="animate-spin text-[#C4653A] w-8 h-8" />
        <p className="text-sm font-medium text-[#6B6560]">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated || !store) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="hidden md:block">
        <DashboardSidebar store={store} />
      </div>
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-heading text-[#1A1A19]">{store.name}</h1>
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${store.isLive ? 'text-[#3D7A4A] bg-[#3D7A4A]/10' : 'text-[#C9973E] bg-[#C9973E]/10'}`}>
            {store.isLive ? 'Live' : 'Draft'}
          </span>
        </header>
        {children}
      </main>
    </div>
  );
}
