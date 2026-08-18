import Link from "next/link";
import Image from "next/image";
import { Store, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A19] font-sans antialiased">
      {/* Header */}
      <header className="border-b border-[#E8E2DC] bg-[#FAFAF7] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A19] flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">EazzyShop</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#1A1A19] hover:text-[#C4653A] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white px-3.5 py-2 rounded-md transition-colors"
            >
              Start free store
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-5">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#1A1A19]">
              Turn your social media catalog into direct WhatsApp sales.
            </h1>

            <p className="text-sm sm:text-base text-[#6B6560] leading-relaxed max-w-lg">
              EazzyShop gives social sellers a clean mobile catalog. Buyers build a cart and send structured orders directly to your WhatsApp Business number with no payment gateway fees.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/register"
                className="px-5 py-2.5 bg-[#C4653A] hover:bg-[#A8522E] text-white rounded-md font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                Create your store
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-white border border-[#E8E2DC] hover:bg-[#F5F0EB] text-[#1A1A19] rounded-md font-semibold text-xs transition-colors"
              >
                Sign in
              </Link>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-[#6B6560]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#3D7A4A]" /> No monthly fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#3D7A4A]" /> Works with M-Pesa & Cash
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#3D7A4A]" /> Local & global currencies
              </span>
            </div>
          </div>

          {/* Storefront Image Mockup */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-[24px] p-2 bg-[#1A1A19] shadow-lg">
              <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-white">
                <Image
                  src="/images/storefront-preview.jpg"
                  alt="Mobile Storefront Preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Order Delivery Demo */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#E8E2DC]">
        <div className="mb-6">
          <h2 className="font-heading text-xl font-bold text-[#1A1A19]">
            How cart orders arrive in your WhatsApp
          </h2>
          <p className="text-xs text-[#6B6560] mt-1">Structured order summary generated automatically when a customer checks out</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E2DC] p-5 shadow-sm font-sans">
          <div className="bg-[#F5F0EB] p-4 rounded-lg font-mono text-xs sm:text-sm leading-relaxed text-[#1A1A19] whitespace-pre-wrap">
{`🛍️ *NEW ORDER — URBAN THREADS*
Order Ref: #1024
──────────────────
👤 *Customer Details:*
• Name: Jane Doe
• Phone: 0712 345 678
• Delivery: Nairobi CBD (KSh 200)

📦 *Items Ordered:*
1. Adama Linen Shirt (Size: M, Color: Terracotta)
   Qty: 2 × KSh 3,500 = KSh 7,000

──────────────────
• Subtotal: KSh 7,000
• Delivery Fee: KSh 200
💰 *TOTAL: KSh 7,200*`}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#E8E2DC]">
        <div className="mb-8">
          <h2 className="font-heading text-xl font-bold text-[#1A1A19] mb-2">
            Merchant dashboard & back-office
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6560]">
            Manage products, variants, customer records, and log manual sales from your phone or desktop.
          </p>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-[#E8E2DC] shadow-md mb-10 bg-white">
          <Image
            src="/images/dashboard-preview.jpg"
            alt="Merchant Dashboard Preview"
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8E2DC] space-y-2">
            <h3 className="font-heading text-sm font-bold text-[#1A1A19]">Product Variants</h3>
            <p className="text-[#6B6560] text-xs leading-relaxed">
              Configure sizing, colors, and stock options for clothing, shoes, or electronics.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8E2DC] space-y-2">
            <h3 className="font-heading text-sm font-bold text-[#1A1A19]">Direct Payments</h3>
            <p className="text-[#6B6560] text-xs leading-relaxed">
              Accept M-Pesa, Cash on Delivery, or Bank Transfer directly from your buyers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8E2DC] space-y-2">
            <h3 className="font-heading text-sm font-bold text-[#1A1A19]">Customer Directory</h3>
            <p className="text-[#6B6560] text-xs leading-relaxed">
              Auto-save customer phone numbers and purchase history for quick WhatsApp re-engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E2DC] py-8 px-4 text-center text-xs text-[#6B6560] bg-[#FAFAF7]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-heading font-bold text-[#1A1A19]">
            EazzyShop Platform
          </div>
          <p>© {new Date().getFullYear()} EazzyShop.</p>
        </div>
      </footer>
    </div>
  );
}
