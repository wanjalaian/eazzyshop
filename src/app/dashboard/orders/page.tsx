'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { formatPrice } from '@/lib/currencies';
import { ManualOrderForm } from '@/components/dashboard/manual-order-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

const STATUSES = ['All', 'pending', 'confirmed', 'dispatched', 'completed', 'cancelled'];

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [manualOpen, setManualOpen] = useState(false);
  const store = useQuery(api.stores.getByOwner);
  const orders = useQuery(
    api.orders.listByStore,
    store?._id
      ? {
          storeId: store._id,
          status: selectedStatus === 'All' ? undefined : selectedStatus,
        }
      : ('skip' as any)
  );

  const updateStatus = useMutation(api.orders.updateStatus);
  const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);

  const handleStatusChange = async (orderId: any, status: string) => {
    if (!store?._id) return;
    await updateStatus({ storeId: store._id, orderId, status });
  };

  const handlePaymentStatusChange = async (orderId: any, paymentStatus: string) => {
    if (!store?._id) return;
    await updatePaymentStatus({ storeId: store._id, orderId, paymentStatus });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A19]">Orders</h2>
          <p className="text-sm text-[#6B6560]">Manage and log orders from WhatsApp</p>
        </div>
        <Dialog open={manualOpen} onOpenChange={setManualOpen}>
          <DialogTrigger>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A19] text-white text-sm font-medium rounded-md hover:bg-[#1A1A19]/90 transition-colors">
              <Plus size={16} /> Log Manual Sale
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            {store && <ManualOrderForm store={store} onSuccess={() => setManualOpen(false)} />}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#E8E2DC] pb-2 overflow-x-auto">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
              selectedStatus === status
                ? 'bg-[#1A1A19] text-white'
                : 'text-[#6B6560] hover:bg-[#F5F0EB]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders === undefined ? (
          <p className="text-sm text-[#6B6560]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#E8E2DC] rounded-xl">
            <Package className="mx-auto h-10 w-10 text-[#A89F97] mb-2" />
            <p className="text-[#6B6560] font-medium">No orders found</p>
            <p className="text-sm text-[#A89F97]">Log a manual sale or share your store link on WhatsApp.</p>
          </div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order._id}
              className="p-5 bg-white border border-[#E8E2DC] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#1A1A19]">#{order.orderNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                      order.status === 'completed'
                        ? 'bg-[#3D7A4A]/10 text-[#3D7A4A]'
                        : order.status === 'cancelled'
                          ? 'bg-[#C43A3A]/10 text-[#C43A3A]'
                          : order.status === 'dispatched'
                            ? 'bg-[#C9973E]/10 text-[#C9973E]'
                            : 'bg-[#F5F0EB] text-[#1A1A19]'
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.isManualEntry && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-stone-100 text-stone-600 rounded">
                      Manual Log
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-[#1A1A19]">
                  {order.customerName} ({order.customerPhone})
                </p>
                <p className="text-xs text-[#6B6560]">
                  {order.items.length} items • Delivery: {order.deliveryLocation || 'N/A'}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <span className="font-heading text-lg font-bold text-[#1A1A19]">
                  {store && formatPrice(order.totalAmount, (store.currency as any) || 'KES')}
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-xs bg-[#F5F0EB] border border-[#E8E2DC] rounded px-2 py-1 font-medium text-[#1A1A19]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    className="text-xs bg-[#F5F0EB] border border-[#E8E2DC] rounded px-2 py-1 font-medium text-[#1A1A19]"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid_mpesa">Paid (M-Pesa)</option>
                    <option value="paid_cash">Paid (Cash)</option>
                    <option value="bank_transfer">Paid (Bank)</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
