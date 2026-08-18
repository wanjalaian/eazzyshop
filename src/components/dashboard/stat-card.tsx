'use client';

import { Card } from '@/components/ui/card';

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-6 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white">
      <div className="text-3xl font-semibold text-[#1A1A19] font-dm-sans">{value}</div>
      <div className="text-sm text-[#6B6560] mt-1 font-dm-sans">{label}</div>
    </Card>
  );
}
