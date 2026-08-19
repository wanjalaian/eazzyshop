'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ImageUploader } from './image-uploader';
import { VariantBuilder, VariantOption, ProductVariant } from './variant-builder';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
  store: any;
  initialData?: any;
  onSuccess?: () => void;
}

export function ProductForm({ store, initialData, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const categories = useQuery(
    api.categories.listByStore,
    store?._id ? { storeId: store._id } : ('skip' as any)
  );

  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(initialData?.compareAtPrice);
  const [categoryId, setCategoryId] = useState<Id<'categories'> | undefined>(initialData?.categoryId);
  const [imageStorageIds, setImageStorageIds] = useState<Id<'_storage'>[]>(
    initialData?.imageStorageIds || []
  );
  const [hasVariants, setHasVariants] = useState<boolean>(initialData?.hasVariants || false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>(initialData?.variantOptions || []);
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);
  const [isAvailable, setIsAvailable] = useState<boolean>(initialData?.isAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price <= 0) {
      return toast.error('Please enter a valid product title and price.');
    }

    setSubmitting(true);
    try {
      if (initialData?._id) {
        await updateProduct({
          storeId: store._id,
          productId: initialData._id,
          categoryId,
          title,
          description,
          price,
          compareAtPrice: compareAtPrice || undefined,
          imageStorageIds,
          hasVariants,
          variantOptions: hasVariants ? variantOptions : undefined,
          variants: hasVariants ? variants : undefined,
          isAvailable,
          isFeatured,
        });
        toast.success('Product updated!');
      } else {
        await createProduct({
          storeId: store._id,
          categoryId,
          title,
          description,
          price,
          compareAtPrice: compareAtPrice || undefined,
          imageStorageIds,
          hasVariants,
          variantOptions: hasVariants ? variantOptions : undefined,
          variants: hasVariants ? variants : undefined,
          isAvailable,
          isFeatured,
        });
        toast.success('Product created!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/products');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#1A1A19]">General Information</h3>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
            Product Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Adama Linen Shirt"
            className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              Category
            </label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? (e.target.value as any) : undefined)}
              className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
            >
              <option value="">Uncategorized</option>
              {categories?.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#1A1A19]">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              Available for sale
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#1A1A19]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured on home
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Crafted from 100% breathable organic linen..."
            className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Pricing ({store?.currency || 'KES'})</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              Selling Price *
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={price || ''}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              placeholder="3500"
              className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19] font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              Compare-at Price (Original)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={compareAtPrice || ''}
              onChange={(e) =>
                setCompareAtPrice(e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="4500"
              className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Product Images</h3>
        <ImageUploader imageStorageIds={imageStorageIds} onChange={setImageStorageIds} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Variants & Options</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasVariants}
              onChange={(e) => setHasVariants(e.target.checked)}
            />
            <span className="text-sm font-medium text-[#1A1A19]">This product has variants (Sizes, Colors, etc.)</span>
          </label>
        </div>

        {hasVariants && (
          <VariantBuilder
            basePrice={price}
            initialOptions={variantOptions}
            initialVariants={variants}
            onChange={({ variantOptions, variants }) => {
              setVariantOptions(variantOptions);
              setVariants(variants);
            }}
          />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard/products')}
          className="px-6 py-3 border border-[#E8E2DC] text-[#1A1A19] text-sm font-bold rounded-lg hover:bg-[#F5F0EB]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-sm font-bold rounded-lg flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
