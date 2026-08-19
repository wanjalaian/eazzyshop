'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatPrice } from '@/lib/currencies';
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

export default function DiscountsPage() {
  const store = useQuery(api.stores.getByOwner);
  const discounts = useQuery(
    api.discounts.listByStore,
    store?._id ? { storeId: store._id } : ('skip' as any)
  );

  const createDiscount = useMutation(api.discounts.create);
  const toggleDiscount = useMutation(api.discounts.toggle);
  const removeDiscount = useMutation(api.discounts.remove);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<string>('');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value || !store?._id) return toast.error('Please enter code and discount value.');

    setSubmitting(true);
    try {
      await createDiscount({
        storeId: store._id,
        code: code.trim().toUpperCase(),
        type,
        value: parseFloat(value) || 0,
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
      });
      toast.success('Discount code created!');
      setCode('');
      setValue('');
      setMinOrderAmount('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create discount code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (discountId: any) => {
    if (!store?._id) return;
    await toggleDiscount({ storeId: store._id, discountId });
    toast.success('Discount status updated!');
  };

  const handleDelete = async (discountId: any) => {
    if (!store?._id) return;
    if (confirm('Delete this discount code?')) {
      await removeDiscount({ storeId: store._id, discountId });
      toast.success('Discount code deleted!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Discount Codes</h2>
        <p className="text-xs text-[#6B6560]">Create promo and coupon codes for your WhatsApp storefront</p>
      </div>

      {/* Add Discount Form */}
      <form onSubmit={handleCreate} className="bg-white p-5 rounded-xl border border-[#E8E2DC] space-y-4 shadow-sm">
        <h3 className="font-heading text-sm font-bold text-[#1A1A19]">Create Promo Code</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="PROMO CODE (e.g. SAVE10)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="px-3 py-2 border border-[#E8E2DC] rounded-lg text-xs font-mono font-bold text-[#1A1A19] uppercase"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
            className="px-3 py-2 border border-[#E8E2DC] rounded-lg text-xs font-medium text-[#1A1A19]"
          >
            <option value="percentage">Percentage Off (%)</option>
            <option value="fixed">Fixed Amount Off ({store?.currency || 'KES'})</option>
          </select>

          <input
            type="number"
            min="0"
            step="any"
            placeholder={type === 'percentage' ? 'Value (e.g. 15 for 15%)' : 'Value (e.g. 500)'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="px-3 py-2 border border-[#E8E2DC] rounded-lg text-xs font-bold text-[#1A1A19]"
          />

          <input
            type="number"
            min="0"
            step="any"
            placeholder="Min order amount (Optional)"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            className="px-3 py-2 border border-[#E8E2DC] rounded-lg text-xs text-[#1A1A19]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !code || !value}
            className="px-5 py-2.5 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> Create Promo Code
          </button>
        </div>
      </form>

      {/* Discounts List */}
      <div className="bg-white border border-[#E8E2DC] rounded-xl overflow-hidden shadow-sm">
        {discounts === undefined ? (
          <p className="p-6 text-sm text-[#6B6560]">Loading discount codes...</p>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B6560]">
            No active discount codes. Create one above to offer promo discounts on WhatsApp orders!
          </div>
        ) : (
          <div className="divide-y divide-[#E8E2DC]">
            {discounts.map((discount: any) => (
              <div key={discount._id} className="p-4 flex items-center justify-between hover:bg-[#FAFAF7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center font-bold">
                    <Tag size={18} />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-base text-[#1A1A19]">
                      {discount.code}
                    </span>
                    <p className="text-xs text-[#6B6560]">
                      {discount.type === 'percentage'
                        ? `${discount.value}% discount`
                        : `${store && formatPrice(discount.value, (store.currency as any) || 'KES')} discount`}{' '}
                      {discount.minOrderAmount
                        ? `(Min order: ${store && formatPrice(discount.minOrderAmount, (store.currency as any) || 'KES')})`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(discount._id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      discount.isActive
                        ? 'bg-[#3D7A4A]/10 text-[#3D7A4A]'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {discount.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {discount.isActive ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => handleDelete(discount._id)}
                    className="p-1.5 text-[#C43A3A] hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
