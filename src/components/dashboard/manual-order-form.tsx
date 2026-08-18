'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatPrice } from '@/lib/currencies';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

export function ManualOrderForm({ store, onSuccess }: { store: any; onSuccess?: () => void }) {
  const products = useQuery(api.products.listByStore, store?._id ? { storeId: store._id } : ('skip' as any));
  const createManual = useMutation(api.orders.createManual);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid_mpesa');
  const [items, setItems] = useState<any[]>([]);

  const handleAddItem = (productId: string) => {
    const prod = products?.find((p: any) => p._id === productId);
    if (!prod) return;
    setItems((prev) => [
      ...prev,
      {
        productId: prod._id,
        title: prod.title,
        quantity: 1,
        price: prod.price,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return toast.error('Please fill in customer details.');
    if (items.length === 0) return toast.error('Please add at least one product.');

    try {
      await createManual({
        storeId: store._id,
        customerName,
        customerPhone,
        deliveryLocation: deliveryLocation || undefined,
        deliveryFee: 0,
        items,
        discountAmount: 0,
        totalAmount,
        status: 'confirmed',
        paymentStatus,
      });
      toast.success('Manual order logged!');
      if (onSuccess) onSuccess();
    } catch (e: any) {
      toast.error('Failed to log order.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1A19]">Log Manual Sale</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Customer Name *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Delivery Location (Optional)"
          value={deliveryLocation}
          onChange={(e) => setDeliveryLocation(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm"
        />
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm"
        >
          <option value="paid_mpesa">Paid (M-Pesa)</option>
          <option value="paid_cash">Paid (Cash)</option>
          <option value="bank_transfer">Paid (Bank)</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="space-y-2 border-t border-[#E8E2DC] pt-3">
        <label className="text-sm font-medium text-[#1A1A19]">Add Items</label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleAddItem(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-3 py-2 border border-[#E8E2DC] rounded-md text-sm"
        >
          <option value="">Select a product to add...</option>
          {products?.map((p: any) => (
            <option key={p._id} value={p._id}>
              {p.title} — {store && formatPrice(p.price, (store.currency as any) || 'KES')}
            </option>
          ))}
        </select>

        <div className="space-y-2 mt-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-[#FAFAF7] p-2 rounded text-sm">
              <span>{item.title}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold">{store && formatPrice(item.price, (store.currency as any) || 'KES')}</span>
                <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-[#E8E2DC]">
        <span className="font-bold text-lg">Total: {store && formatPrice(totalAmount, (store.currency as any) || 'KES')}</span>
        <button type="submit" className="px-5 py-2 bg-[#1A1A19] text-white text-sm font-bold rounded-md">
          Save Order
        </button>
      </div>
    </form>
  );
}
