'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatPrice } from '@/lib/currencies';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export function ManualOrderForm({ store, onSuccess }: { store: any; onSuccess?: () => void }) {
  const products = useQuery(api.products.listByStore, store?._id ? { storeId: store._id } : ('skip' as any));
  const createManual = useMutation(api.orders.createManual);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid_mpesa');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [mpesaAmount, setMpesaAmount] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<string>('');
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

    let finalPaymentStatus = paymentStatus;
    let notes = paymentNotes;

    if (paymentStatus.startsWith('split_')) {
      const mAmount = parseFloat(mpesaAmount) || 0;
      const cAmount = parseFloat(cashAmount) || 0;
      const splitBreakdown = `Split Payment: M-Pesa ${store.currency} ${mAmount}, Cash ${store.currency} ${cAmount}`;
      notes = notes ? `${notes} | ${splitBreakdown}` : splitBreakdown;
    }

    try {
      await createManual({
        storeId: store._id,
        customerName,
        customerPhone,
        deliveryLocation: deliveryLocation || undefined,
        deliveryFee: 0,
        notes: notes || undefined,
        items,
        discountAmount: 0,
        totalAmount,
        status: 'confirmed',
        paymentStatus: finalPaymentStatus,
      });
      toast.success('Manual order logged!');
      if (onSuccess) onSuccess();
    } catch (e: any) {
      toast.error('Failed to log order.');
    }
  };

  const isSplitPayment = paymentStatus.startsWith('split_');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold font-heading text-[#1A1A19]">Log Manual Sale</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Customer Name *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm text-[#1A1A19]"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm text-[#1A1A19]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Delivery Location (Optional)"
          value={deliveryLocation}
          onChange={(e) => setDeliveryLocation(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm text-[#1A1A19]"
        />
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-3 py-2 border border-[#E8E2DC] rounded-md text-sm text-[#1A1A19] font-medium"
        >
          <option value="paid_mpesa">Paid (M-Pesa Full)</option>
          <option value="paid_cash">Paid (Cash Full)</option>
          <option value="paid_bank">Paid (Bank Transfer Full)</option>
          <option value="split_mpesa_cash">Split Payment (M-Pesa + Cash)</option>
          <option value="split_mpesa_bank">Split Payment (M-Pesa + Bank)</option>
          <option value="split_cash_bank">Split Payment (Cash + Bank)</option>
          <option value="split_custom">Split / Combined Other</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {isSplitPayment && (
        <div className="bg-[#F5F0EB] p-3 rounded-lg space-y-2 border border-[#E8E2DC]">
          <p className="text-xs font-bold text-[#1A1A19] uppercase tracking-wider">
            Split Payment Breakdown ({store?.currency || 'KES'})
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6B6560] mb-0.5">
                M-Pesa / Mobile Portion
              </label>
              <input
                type="number"
                placeholder="e.g. 2000"
                value={mpesaAmount}
                onChange={(e) => setMpesaAmount(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8E2DC] rounded bg-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6B6560] mb-0.5">
                Cash / Other Portion
              </label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8E2DC] rounded bg-white text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Payment or Order Notes (Optional)"
          value={paymentNotes}
          onChange={(e) => setPaymentNotes(e.target.value)}
          className="w-full px-3 py-2 border border-[#E8E2DC] rounded-md text-xs text-[#1A1A19]"
        />
      </div>

      <div className="space-y-2 border-t border-[#E8E2DC] pt-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]">Add Products</label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleAddItem(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-3 py-2 border border-[#E8E2DC] rounded-md text-sm text-[#1A1A19]"
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
            <div key={idx} className="flex justify-between items-center bg-[#FAFAF7] p-2.5 rounded-lg border border-[#E8E2DC] text-sm">
              <span className="font-medium text-[#1A1A19]">{item.title}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold">{store && formatPrice(item.price, (store.currency as any) || 'KES')}</span>
                <button type="button" onClick={() => handleRemoveItem(idx)} className="text-[#C43A3A] p-1 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-[#E8E2DC]">
        <span className="font-bold text-lg text-[#1A1A19]">Total: {store && formatPrice(totalAmount, (store.currency as any) || 'KES')}</span>
        <button type="submit" className="px-5 py-2.5 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-xs font-bold uppercase tracking-wider rounded-md">
          Save Manual Order
        </button>
      </div>
    </form>
  );
}
