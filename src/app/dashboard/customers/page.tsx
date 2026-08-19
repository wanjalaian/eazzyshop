'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatPrice } from '@/lib/currencies';
import { normalizePhone } from '@/lib/format-whatsapp';
import { MessageSquare, Search, Tag, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const store = useQuery(api.stores.getByOwner);
  const customers = useQuery(
    api.customers.listByStore,
    store?._id ? { storeId: store._id } : ('skip' as any)
  );

  const updateCustomer = useMutation(api.customers.update);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const filteredCustomers = customers?.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSaveNotes = async (customerId: any) => {
    if (!store?._id) return;
    try {
      const tagsArray = tagInput
        ? tagInput.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined;

      await updateCustomer({
        storeId: store._id,
        customerId,
        notes: noteInput || undefined,
        tags: tagsArray,
      });
      toast.success('Customer details updated!');
      setEditingId(null);
    } catch (e: any) {
      toast.error('Failed to update customer.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Customer CRM</h2>
          <p className="text-xs text-[#6B6560]">Buyers and lead profiles aggregated from WhatsApp storefront orders</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89F97]" size={16} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#E8E2DC] rounded-lg text-xs bg-white text-[#1A1A19]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E8E2DC] rounded-xl overflow-hidden shadow-sm">
        {customers === undefined ? (
          <p className="p-6 text-sm text-[#6B6560]">Loading customers...</p>
        ) : filteredCustomers?.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#6B6560]">
            No customer profiles found. Customers are automatically saved when they place an order via WhatsApp.
          </div>
        ) : (
          <div className="divide-y divide-[#E8E2DC]">
            {filteredCustomers?.map((customer: any) => {
              const cleanPhone = normalizePhone(customer.phone, '254');
              const isEditing = editingId === customer._id;

              return (
                <div key={customer._id} className="p-5 hover:bg-[#FAFAF7] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-bold text-base text-[#1A1A19]">
                          {customer.name}
                        </span>
                        <span className="text-xs font-mono text-[#6B6560] bg-[#F5F0EB] px-2 py-0.5 rounded">
                          {customer.phone}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6560] mt-0.5">
                        {customer.orderCount} orders • Delivery Address: {customer.deliveryAddress || 'N/A'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="block text-xs text-[#6B6560] uppercase font-bold tracking-wider">Total Spent</span>
                        <span className="font-heading font-bold text-base text-[#1A1A19]">
                          {store && formatPrice(customer.totalSpent, (store.currency as any) || 'KES')}
                        </span>
                      </div>

                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3D7A4A] hover:bg-[#3D7A4A]/90 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <MessageSquare size={14} /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Customer Tags & Notes */}
                  {isEditing ? (
                    <div className="bg-[#F5F0EB] p-3 rounded-lg space-y-2 border border-[#E8E2DC]">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A19] mb-1">Customer Notes</label>
                        <input
                          type="text"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="e.g. Prefers morning delivery, VIP buyer"
                          className="w-full px-3 py-1.5 border border-[#E8E2DC] rounded bg-white text-xs text-[#1A1A19]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A19] mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="VIP, Repeat, Wholesale"
                          className="w-full px-3 py-1.5 border border-[#E8E2DC] rounded bg-white text-xs text-[#1A1A19]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 border border-[#E8E2DC] text-xs font-semibold rounded bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(customer._id)}
                          className="px-3 py-1 bg-[#1A1A19] text-white text-xs font-bold rounded flex items-center gap-1"
                        >
                          <Check size={12} /> Save Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-[#6B6560] pt-1">
                      <div className="flex items-center gap-4 flex-wrap">
                        {customer.notes && (
                          <span className="flex items-center gap-1 bg-[#F3E8E2] text-[#C4653A] px-2 py-0.5 rounded font-medium">
                            <FileText size={12} /> {customer.notes}
                          </span>
                        )}
                        {customer.tags && customer.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={12} className="text-[#A89F97]" />
                            {customer.tags.map((tag: string, tIdx: number) => (
                              <span key={tIdx} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setEditingId(customer._id);
                          setNoteInput(customer.notes || '');
                          setTagInput(customer.tags ? customer.tags.join(', ') : '');
                        }}
                        className="text-xs text-[#1A1A19] font-bold hover:underline"
                      >
                        Edit Notes/Tags
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
