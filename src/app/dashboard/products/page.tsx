'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Edit2, Copy, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currencies';
import { toast } from 'sonner';

export default function ProductsPage() {
  const store = useQuery(api.stores.getByOwner);
  const products = useQuery(
    api.products.listByStore,
    store?._id ? { storeId: store._id } : ('skip' as any)
  );

  const toggleAvailability = useMutation(api.products.toggleAvailability);
  const toggleFeatured = useMutation(api.products.toggleFeatured);
  const duplicateProduct = useMutation(api.products.duplicate);
  const removeProduct = useMutation(api.products.remove);

  const handleToggleAvailability = async (productId: any) => {
    if (!store?._id) return;
    await toggleAvailability({ storeId: store._id, productId });
    toast.success('Availability updated!');
  };

  const handleToggleFeatured = async (productId: any) => {
    if (!store?._id) return;
    await toggleFeatured({ storeId: store._id, productId });
    toast.success('Featured status updated!');
  };

  const handleDuplicate = async (productId: any) => {
    if (!store?._id) return;
    await duplicateProduct({ storeId: store._id, productId });
    toast.success('Product duplicated!');
  };

  const handleDelete = async (productId: any) => {
    if (!store?._id) return;
    if (confirm('Are you sure you want to delete this product?')) {
      await removeProduct({ storeId: store._id, productId });
      toast.success('Product deleted!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Products</h2>
          <p className="text-xs text-[#6B6560]">Manage your storefront catalog and variants</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A19] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#1A1A19]/90 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#E8E2DC] rounded-xl overflow-hidden shadow-sm">
        {products === undefined ? (
          <p className="p-6 text-sm text-[#6B6560]">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-heading font-bold text-lg text-[#1A1A19] mb-1">No products in your store</p>
            <p className="text-xs text-[#6B6560] mb-6">Create your first product to display it on your WhatsApp storefront link.</p>
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C4653A] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
            >
              <Plus size={16} /> Create Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2DC] bg-[#FAFAF7] text-[#6B6560] text-xs uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Sales</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2DC]">
                {products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-[#FAFAF7] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F5F0EB] overflow-hidden flex-shrink-0 relative border border-[#E8E2DC] flex items-center justify-center text-[10px] text-[#A89F97]">
                        {product.imageUrls && product.imageUrls[0] ? (
                          <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          'No Img'
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1A19]">{product.title}</p>
                        <p className="text-xs text-[#6B6560]">/{product.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-[#1A1A19]">
                      {store && formatPrice(product.price, (store?.currency as any) || 'KES')}
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="block text-xs text-[#A89F97] line-through font-normal">
                          {store && formatPrice(product.compareAtPrice, (store?.currency as any) || 'KES')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6B6560]">
                      {product.hasVariants && product.variants ? `${product.variants.length} combinations` : 'Simple Product'}
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-[#1A1A19]">
                      {product.salesCount || 0}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(product._id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
                          product.isAvailable
                            ? 'bg-[#3D7A4A]/10 text-[#3D7A4A]'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {product.isAvailable ? <Eye size={12} /> : <EyeOff size={12} />}
                        {product.isAvailable ? 'Available' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleFeatured(product._id)}
                          title="Toggle Featured"
                          className={`p-1.5 rounded hover:bg-[#F5F0EB] ${product.isFeatured ? 'text-[#C9973E]' : 'text-[#A89F97]'}`}
                        >
                          <Star size={16} className={product.isFeatured ? 'fill-[#C9973E]' : ''} />
                        </button>
                        <Link
                          href={`/dashboard/products/${product._id}`}
                          title="Edit product"
                          className="p-1.5 text-[#1A1A19] hover:bg-[#F5F0EB] rounded"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product._id)}
                          title="Duplicate product"
                          className="p-1.5 text-[#6B6560] hover:bg-[#F5F0EB] rounded"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          title="Delete product"
                          className="p-1.5 text-[#C43A3A] hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
