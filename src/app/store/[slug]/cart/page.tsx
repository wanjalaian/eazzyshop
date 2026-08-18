"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/currencies";
import { buildWhatsAppUrl } from "@/lib/format-whatsapp";
import { useState, use } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const store = useQuery(api.stores.getBySlug, { slug });
  const cart = useCart();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [selectedFee, setSelectedFee] = useState(0);

  const logStorefrontLead = useMutation(api.orders.logStorefrontLead);

  if (store === undefined) return null;

  const storeItems = cart.items;
  const subtotal = cart.subtotal;
  const deliveryFee = selectedFee;
  const discountAmount = 0;
  const total = subtotal + deliveryFee - discountAmount;

  const handleDeliveryChange = (locationName: string) => {
    setDeliveryLocation(locationName);
    const loc = store?.deliveryLocations?.find((l) => l.name === locationName);
    setSelectedFee(loc ? loc.fee : 0);
  };

  const handleWhatsAppOrder = async () => {
    if (!name || !phone) return alert("Please fill in your name and phone number.");
    
    if (store?._id) {
      try {
        await logStorefrontLead({
          storeId: store._id,
          customerName: name,
          customerPhone: phone,
          deliveryLocation: deliveryLocation || undefined,
          deliveryFee,
          notes: notes || undefined,
          items: storeItems.map((item) => ({
            productId: item.productId as any,
            variantId: item.variantId,
            title: item.productTitle,
            variantTitle: item.variantTitle,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          discountAmount: 0,
          totalAmount: total,
        });
      } catch (e) {
        console.error("Failed to log order lead:", e);
      }
    }
    
    const url = buildWhatsAppUrl({
      storeName: store?.name || "Store",
      storePhone: store?.whatsappNumber || "",
      orderRef: String(store?.orderCounter || 1000),
      customer: {
        name,
        phone,
        deliveryLocation,
        deliveryFee,
        notes,
      },
      items: storeItems.map((item) => ({
        productTitle: item.productTitle,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
      })),
      subtotal,
      deliveryFee,
      totalAmount: total,
      currency: (store?.currency as any) || "KES",
    });
    
    window.open(url, "_blank");
  };

  if (storeItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-semibold text-[#1A1A19] mb-4">Your bag is empty</h1>
        <p className="text-[#6B6560] mb-8">Looks like you haven't added anything yet.</p>
        <a 
          href={`/store/${slug}`}
          className="inline-block px-8 py-3 bg-[var(--store-accent,#C4653A)] text-white rounded-[6px] font-bold text-sm tracking-[0.04em] uppercase"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-12">
      {/* Cart Items */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6">
        <h1 className="font-heading text-3xl font-semibold text-[#1A1A19]">Your Bag</h1>
        
        <div className="flex flex-col gap-6 mt-4">
          {storeItems.map((item) => (
            <div key={`${item.productId}-${item.variantId || ""}`} className="flex gap-4 bg-white p-4 rounded-[12px] shadow-sm border border-[#E8E2DC]">
              <div className="w-24 h-32 relative rounded-[8px] overflow-hidden bg-[#F5F0EB] flex-shrink-0">
                {item.imageUrl && <Image src={item.imageUrl} alt={item.productTitle} fill className="object-cover" />}
              </div>
              <div className="flex flex-col flex-1 justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-sans font-semibold text-[#1A1A19] text-lg leading-tight">{item.productTitle}</h3>
                    {item.variantTitle && (
                      <p className="text-sm text-[#6B6560] mt-1">{item.variantTitle}</p>
                    )}
                  </div>
                  <span className="font-bold text-[#1A1A19]">
                    {formatPrice(item.unitPrice * item.quantity, (store?.currency as any) || "KES")}
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-[#E8E2DC] rounded-[6px] bg-white">
                    <button 
                      className="w-8 h-8 flex items-center justify-center text-[#6B6560]"
                      onClick={() => cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.variantId)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-[#1A1A19] font-medium text-sm">{item.quantity}</span>
                    <button 
                      className="w-8 h-8 flex items-center justify-center text-[#6B6560]"
                      onClick={() => cart.updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => cart.removeItem(item.productId, item.variantId)}
                    className="text-[#C43A3A] text-sm flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="w-full lg:w-[40%] flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[12px] shadow-sm border border-[#E8E2DC] flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-semibold text-[#1A1A19]">Order Summary</h2>
          
          <div className="flex flex-col gap-4 text-[#1A1A19]">
            <div className="flex justify-between">
              <span className="text-[#6B6560]">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal, (store?.currency as any) || "KES")}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-[#6B6560]">Delivery Fee</span>
                <span className="font-medium">{formatPrice(deliveryFee, (store?.currency as any) || "KES")}</span>
              </div>
            )}
            <div className="h-px bg-[#E8E2DC] w-full my-2" />
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl">{formatPrice(total, (store?.currency as any) || "KES")}</span>
            </div>
          </div>

          <div className="h-px bg-[#E8E2DC] w-full" />
          
          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-semibold text-[#1A1A19]">Your Details</h3>
            
            <input 
              type="text" 
              placeholder="Full Name *" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8E2DC] rounded-[8px] bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-1 focus:ring-[var(--store-accent)]"
            />
            
            <input 
              type="tel" 
              placeholder="Phone Number *" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8E2DC] rounded-[8px] bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-1 focus:ring-[var(--store-accent)]"
            />

            {store?.deliveryLocations && store.deliveryLocations.length > 0 && (
              <select 
                value={deliveryLocation}
                onChange={(e) => handleDeliveryChange(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E2DC] rounded-[8px] bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-1 focus:ring-[var(--store-accent)] appearance-none"
              >
                <option value="">Select Delivery Area</option>
                {store.deliveryLocations.map((loc: any, idx: number) => (
                  <option key={idx} value={loc.name}>{loc.name} (+{formatPrice(loc.fee, (store.currency as any) || "KES")})</option>
                ))}
              </select>
            )}

            <textarea 
              placeholder="Order Notes (Optional)" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8E2DC] rounded-[8px] bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-1 focus:ring-[var(--store-accent)] min-h-[80px]"
            />
          </div>

          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-4 rounded-[6px] bg-[var(--store-accent,#C4653A)] hover:bg-[var(--store-accent-hover,#A8522E)] text-white font-sans font-bold text-sm tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition-colors mt-2"
          >
            Send order via WhatsApp
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
