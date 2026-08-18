"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSortedCurrencyOptions } from "@/lib/currencies";
import { normalizePhone } from "@/lib/format-whatsapp";
import { Store, ArrowRight, Check } from "lucide-react";

export default function SetupWizardPage() {
  const createStore = useMutation(api.stores.create);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [currencySymbol, setCurrencySymbol] = useState("KSh");
  const [primaryColor, setPrimaryColor] = useState("#C4653A");
  const [loading, setLoading] = useState(false);

  const currencyGroups = getSortedCurrencyOptions();

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSlug(autoSlug);
  };

  const handleCurrencySelect = (code: string) => {
    setCurrency(code);
    let foundSymbol = "$";
    currencyGroups.forEach((g) => {
      g.options.forEach((o: any) => {
        if (o.value === code) foundSymbol = o.symbol;
      });
    });
    setCurrencySymbol(foundSymbol);
  };

  const handleSubmit = async () => {
    if (!name || !slug || !whatsappNumber) {
      return toast.error("Please fill in store name, slug, and WhatsApp number.");
    }

    setLoading(true);
    try {
      const cleanPhone = normalizePhone(whatsappNumber, "254");
      await createStore({
        name,
        slug,
        description,
        whatsappNumber: cleanPhone,
        currency,
        currencySymbol,
        primaryColor,
        isLive: true,
      });
      toast.success("Store created and live!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create store. Slug might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1A19] flex items-center justify-center text-white mx-auto mb-3">
            <Store size={24} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#1A1A19]">Set up your store profile</h2>
          <p className="text-sm text-[#6B6560] mt-1">Step {step} of 2 — Configure branding & checkout</p>
        </div>

        <div className="bg-white py-8 px-6 border border-[#E8E2DC] rounded-2xl shadow-sm sm:px-10">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1A19] mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Urban Threads"
                  className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4653A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A19] mb-1">Subdomain / Store Link *</label>
                <div className="flex items-center border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] overflow-hidden">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="urban-threads"
                    className="w-full px-4 py-3 bg-transparent text-[#1A1A19] text-sm focus:outline-none"
                  />
                  <span className="px-3 text-xs text-[#A89F97] font-mono border-l border-[#E8E2DC] bg-[#F5F0EB] py-3">
                    .eazzyshop.com
                  </span>
                </div>
                <p className="text-xs text-[#6B6560] mt-1">Your storefront URL: {slug ? `${slug}.eazzyshop.com` : "yourstore.eazzyshop.com"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A19] mb-1">Short Bio / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Curated apparel & accessories crafted in Nairobi."
                  className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4653A]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!name || !slug) return toast.error("Please fill in name and subdomain.");
                  setStep(2);
                }}
                className="w-full py-3.5 px-4 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Next: Contact & Currency
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1A19] mb-1">WhatsApp Business Number *</label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 0712345678 or +254712345678"
                  className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4653A]"
                />
                <p className="text-xs text-[#6B6560] mt-1">Cart orders will be formatted and sent directly to this WhatsApp number.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A19] mb-1">Store Currency *</label>
                <select
                  value={currency}
                  onChange={(e) => handleCurrencySelect(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4653A]"
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
                <label className="block text-sm font-medium text-[#1A1A19] mb-1">Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-[#E8E2DC] cursor-pointer"
                  />
                  <span className="font-mono text-sm text-[#1A1A19] uppercase">{primaryColor}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 px-4 border border-[#E8E2DC] text-[#1A1A19] font-medium text-sm rounded-lg hover:bg-[#F5F0EB]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-2/3 py-3.5 px-4 bg-[#C4653A] hover:bg-[#A8522E] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? "Launching Store..." : "Launch Live Store"}
                  <Check size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
