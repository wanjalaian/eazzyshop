'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ProductForm } from '@/components/dashboard/product-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const store = useQuery(api.stores.getByOwner);
  const product = useQuery(
    api.products.getById,
    store?._id && id ? { storeId: store._id, productId: id as any } : ('skip' as any)
  );

  if (!store || !product) {
    return <p className="text-sm text-[#6B6560]">Loading product details...</p>;
  }

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
          <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Edit {product.title}</h2>
          <p className="text-xs text-[#6B6560]">Update details, pricing, and variants</p>
        </div>
      </div>

      <ProductForm store={store} initialData={product} />
    </div>
  );
}
