'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatPrice } from '@/lib/currencies';

export default function DashboardPage() {
  const store = useQuery(api.stores.getByOwner);
  const stats = useQuery(
    api.orders.getStats,
    store?._id ? { storeId: store._id } : "skip" as any
  );
  const topCustomers = useQuery(
    api.customers.getTopBySpend,
    store?._id ? { storeId: store._id } : "skip" as any
  );

  if (!stats || !store) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue, (store.currency as any) || "KES")} />
        <StatCard label="Orders" value={stats.orderCount} />
        <StatCard label="Avg Order Value" value={formatPrice(stats.averageOrderValue, (store.currency as any) || "KES")} />
        <StatCard label="Paid Orders" value={stats.paidOrderCount} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#1A1A19]">Top Customers</h2>
          <div className="space-y-2">
            {topCustomers?.map((c: any) => (
              <div key={c._id} className="p-3 border border-[#E8E2DC] rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#1A1A19]">{c.name}</p>
                  <p className="text-sm text-[#6B6560]">{c.phone}</p>
                </div>
                <p className="font-bold text-[#1A1A19]">{formatPrice(c.totalSpent, (store.currency as any) || "KES")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
