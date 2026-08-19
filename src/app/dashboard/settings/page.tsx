'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getSortedCurrencyOptions, formatPrice } from '@/lib/currencies';
import { normalizePhone } from '@/lib/format-whatsapp';
import { Plus, Trash2, Save, Store, Truck, Palette, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const store = useQuery(api.stores.getByOwner);
  const updateStore = useMutation(api.stores.update);
  const updateBranding = useMutation(api.stores.updateBranding);
  const updateDelivery = useMutation(api.stores.updateDeliveryLocations);
  const toggleLive = useMutation(api.stores.toggleLive);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [currencySymbol, setCurrencySymbol] = useState('KSh');
  const [primaryColor, setPrimaryColor] = useState('#C4653A');
  const [announcementBar, setAnnouncementBar] = useState('');
  const [deliveryLocations, setDeliveryLocations] = useState<
    { name: string; fee: number }[]
  >([]);

  const [newLocName, setNewLocName] = useState('');
  const [newLocFee, setNewLocFee] = useState('');
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);

  const currencyGroups = getSortedCurrencyOptions();

  useEffect(() => {
    if (store) {
      setName(store.name || '');
      setDescription(store.description || '');
      setWhatsappNumber(store.whatsappNumber || '');
      setCurrency(store.currency || 'KES');
      setCurrencySymbol(store.currencySymbol || 'KSh');
      setPrimaryColor(store.primaryColor || '#C4653A');
      setAnnouncementBar(store.announcementBar || '');
      setDeliveryLocations(store.deliveryLocations || []);
    }
  }, [store]);

  if (!store) return <p className="p-6 text-sm text-[#6B6560]">Loading store settings...</p>;

  const handleCurrencySelect = (code: string) => {
    setCurrency(code);
    let foundSymbol = '$';
    currencyGroups.forEach((g) => {
      g.options.forEach((o: any) => {
        if (o.value === code) foundSymbol = o.symbol;
      });
    });
    setCurrencySymbol(foundSymbol);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    try {
      const cleanPhone = normalizePhone(whatsappNumber, '254');
      await updateStore({
        storeId: store._id,
        name,
        description,
        whatsappNumber: cleanPhone,
        currency,
        currencySymbol,
      });
      toast.success('General settings saved!');
    } catch (err: any) {
      toast.error('Failed to update store general settings.');
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBranding(true);
    try {
      await updateBranding({
        storeId: store._id,
        primaryColor,
        announcementBar: announcementBar || undefined,
      });
      toast.success('Branding settings saved!');
    } catch (err: any) {
      toast.error('Failed to update branding.');
    } finally {
      setSavingBranding(false);
    }
  };

  const handleAddDeliveryLocation = async () => {
    if (!newLocName.trim() || !newLocFee) return;
    const feeNum = parseFloat(newLocFee) || 0;
    const updated = [...deliveryLocations, { name: newLocName.trim(), fee: feeNum }];
    setDeliveryLocations(updated);

    setSavingDelivery(true);
    try {
      await updateDelivery({
        storeId: store._id,
        deliveryLocations: updated,
      });
      toast.success('Delivery location added!');
      setNewLocName('');
      setNewLocFee('');
    } catch (err: any) {
      toast.error('Failed to save delivery location.');
    } finally {
      setSavingDelivery(false);
    }
  };

  const handleRemoveDeliveryLocation = async (index: number) => {
    const updated = deliveryLocations.filter((_, i) => i !== index);
    setDeliveryLocations(updated);
    setSavingDelivery(true);
    try {
      await updateDelivery({
        storeId: store._id,
        deliveryLocations: updated,
      });
      toast.success('Delivery location removed!');
    } catch (err: any) {
      toast.error('Failed to remove delivery location.');
    } finally {
      setSavingDelivery(false);
    }
  };

  const handleToggleLive = async () => {
    try {
      await toggleLive({ storeId: store._id });
      toast.success(`Store status changed to ${!store.isLive ? 'Live' : 'Draft'}!`);
    } catch (err: any) {
      toast.error('Failed to toggle store status.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Store Settings</h2>
          <p className="text-xs text-[#6B6560]">Manage store profile, WhatsApp contact, delivery zones, and branding</p>
        </div>

        <button
          onClick={handleToggleLive}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            store.isLive
              ? 'bg-[#3D7A4A] text-white hover:bg-[#3D7A4A]/90'
              : 'bg-[#C9973E] text-white hover:bg-[#C9973E]/90'
          }`}
        >
          {store.isLive ? <Eye size={16} /> : <EyeOff size={16} />}
          {store.isLive ? 'Store is Live' : 'Store is Draft'}
        </button>
      </div>

      {/* General Settings Form */}
      <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E2DC] pb-3 mb-2">
          <Store className="w-5 h-5 text-[#C4653A]" />
          <h3 className="font-heading text-lg font-bold text-[#1A1A19]">General Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              Store Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              WhatsApp Business Phone *
            </label>
            <input
              type="tel"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 0712345678"
              className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
            Store Currency *
          </label>
          <select
            value={currency}
            onChange={(e) => handleCurrencySelect(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19] font-bold"
          >
            {currencyGroups.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
            Short Description / Bio
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingGeneral}
            className="px-6 py-2.5 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
          >
            {savingGeneral ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            Save General Settings
          </button>
        </div>
      </form>

      {/* Delivery Locations & Fees */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E2DC] pb-3 mb-2">
          <Truck className="w-5 h-5 text-[#C4653A]" />
          <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Delivery Zones & Fees</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Location Name (e.g. Nairobi CBD)"
            value={newLocName}
            onChange={(e) => setNewLocName(e.target.value)}
            className="px-3 py-2 border border-[#E8E2DC] rounded-lg text-xs text-[#1A1A19]"
          />
          <input
            type="number"
            min="0"
            step="any"
            placeholder={`Fee in ${currencySymbol} (e.g. 200)`}
            value={newLocFee}
            onChange={(e) => setNewLocFee(e.target.value)}
            className="px-3 py-2 border border-[#E8E2DC] rounded-lg text-xs font-bold text-[#1A1A19]"
          />
          <button
            type="button"
            onClick={handleAddDeliveryLocation}
            disabled={savingDelivery || !newLocName.trim() || !newLocFee}
            className="px-4 py-2 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5"
          >
            <Plus size={16} /> Add Zone
          </button>
        </div>

        <div className="divide-y divide-[#E8E2DC] border border-[#E8E2DC] rounded-lg overflow-hidden">
          {deliveryLocations.length === 0 ? (
            <p className="p-4 text-xs text-[#6B6560] text-center">No delivery zones configured yet.</p>
          ) : (
            deliveryLocations.map((loc, idx) => (
              <div key={idx} className="p-3 flex justify-between items-center bg-[#FAFAF7]">
                <span className="font-bold text-xs text-[#1A1A19]">{loc.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-[#1A1A19]">
                    +{formatPrice(loc.fee, (currency as any) || 'KES')}
                  </span>
                  <button
                    onClick={() => handleRemoveDeliveryLocation(idx)}
                    className="text-[#C43A3A] p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Branding & Announcement */}
      <form onSubmit={handleSaveBranding} className="bg-white p-6 rounded-xl border border-[#E8E2DC] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E2DC] pb-3 mb-2">
          <Palette className="w-5 h-5 text-[#C4653A]" />
          <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Storefront Branding</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              Store Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#E8E2DC] cursor-pointer"
              />
              <span className="font-mono text-sm font-bold text-[#1A1A19] uppercase">{primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A19] mb-1">
              Announcement Banner Bar Text
            </label>
            <input
              type="text"
              placeholder="e.g. 🔥 Free delivery in Nairobi for orders over KSh 5,000!"
              value={announcementBar}
              onChange={(e) => setAnnouncementBar(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingBranding}
            className="px-6 py-2.5 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
          >
            {savingBranding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            Save Branding
          </button>
        </div>
      </form>
    </div>
  );
}
