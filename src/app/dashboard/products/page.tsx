'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currencies';

export default function ProductsPage() {
  const store = useQuery(api.stores.getByOwner);
  const products = useQuery(
    api.products.listByStore,
    store?._id ? { storeId: store._id } : "skip" as any
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#1A1A19]">Products</h2>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center px-4 py-2 bg-[#1A1A19] text-white text-sm font-medium rounded-md hover:bg-[#1A1A19]/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </div>
      
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E2DC] text-[#6B6560] text-sm">
              <th className="py-3 font-medium">Product</th>
              <th className="py-3 font-medium">Price</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr key={product._id} className="border-b border-[#E8E2DC] last:border-0">
                <td className="py-4 flex items-center gap-3">
                  <span className="text-[#1A1A19] font-medium">{product.title}</span>
                </td>
                <td className="py-4 text-[#1A1A19]">{store && formatPrice(product.price, (store.currency as any) || "KES")}</td>
                <td className="py-4"><span className={product.isAvailable ? 'text-[#3D7A4A]' : 'text-[#6B6560]'}>{product.isAvailable ? 'Available' : 'Hidden'}</span></td>
                <td className="py-4 text-right">
                  <button className="px-3 py-1 text-sm border border-[#E8E2DC] rounded hover:bg-[#F5F0EB]">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
