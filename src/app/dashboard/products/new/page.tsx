'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ProductForm } from '@/components/dashboard/product-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const store = useQuery(api.stores.getByOwner);

  if (!store) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/products"
          className="p-2 border border-[#E8E2DC] rounded-lg hover:bg-[#F5F0EB] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Add New Product</h2>
          <p className="text-xs text-[#6B6560]">Create a product listing for your WhatsApp catalog</p>
        </div>
      </div>

      <ProductForm store={store} />
    </div>
  );
}
