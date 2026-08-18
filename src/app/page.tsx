import Link from "next/link";
import Image from "next/image";
import { Store, MessageSquare, Smartphone, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A19] font-sans antialiased">
      {/* Header */}
      <header className="border-b border-[#E8E2DC] bg-[#FAFAF7]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A19] flex items-center justify-center text-white font-bold font-heading">
              E
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight">EazzyShop</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#1A1A19] hover:text-[#C4653A] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold bg-[#C4653A] hover:bg-[#A8522E] text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#F5F0EB] border border-[#E8E2DC] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#C4653A]">
              <Zap size={14} className="fill-[#C4653A]" /> ZERO COMMISSIONS • NO PAYMENT GATEWAYS
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#1A1A19]">
              Sell on WhatsApp. <br />
              <span className="text-[#C4653A]">No technical headache.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B6560] max-w-xl leading-relaxed">
              Create a high-converting mobile catalog in 2 minutes. Share your store link on Instagram, TikTok & WhatsApp. Receive clean, structured cart orders straight to your phone.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-4 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                Create Your Store Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white border border-[#E8E2DC] hover:bg-[#F5F0EB] text-[#1A1A19] rounded-xl font-bold text-sm transition-colors flex items-center justify-center"
              >
                Sign In to Dashboard
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs font-semibold text-[#6B6560]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#3D7A4A]" /> Free tier forever
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#3D7A4A]" /> M-Pesa & Cash ready
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#3D7A4A]" /> 12 Currencies
              </div>
            </div>
          </div>

          {/* Storefront Image Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-[36px] p-3 bg-[#1A1A19] shadow-2xl border-4 border-[#1A1A19]">
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-white">
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

      {/* Live Order Format Mockup */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A19]">
            Structured WhatsApp order delivery
          </h2>
          <p className="text-[#6B6560] text-sm mt-1">What you receive in your chat when a buyer checks out</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-lg text-left font-sans">
          <div className="flex items-center gap-3 border-b border-[#E8E2DC] pb-4 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-[#1A1A19] uppercase tracking-wider">Incoming WhatsApp Order</span>
          </div>
          <div className="bg-[#F5F0EB] p-4 rounded-xl font-mono text-xs sm:text-sm leading-relaxed text-[#1A1A19] whitespace-pre-wrap">
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

      {/* Merchant Dashboard Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E8E2DC]">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A19] mb-4">
            Powerful Back-Office on your phone or laptop
          </h2>
          <p className="text-[#6B6560] max-w-xl mx-auto text-sm sm:text-base">
            Track revenue, log manual sales from chat, manage size/color variants, and build customer loyalty.
          </p>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden border border-[#E8E2DC] shadow-xl mb-16 bg-white">
          <Image
            src="/images/dashboard-preview.jpg"
            alt="Merchant Dashboard Preview"
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center font-bold">
              <Smartphone size={22} />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Variants Matrix Ready</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Clothing sizes (S, M, L, XL), shoe colors, phone storage capacities (64GB, 128GB). Add option groups in seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center font-bold">
              <MessageSquare size={22} />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#1A1A19]">Direct M-Pesa & Cash Flow</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Collect payments via M-Pesa Till/Paybill, Cash on Delivery, or Bank Transfer. You get 100% of your money immediately.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center font-bold">
              <Zap size={22} />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#1A1A19]">1-Tap Re-engagement</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Auto-log customer phone numbers and purchase history. Message top buyers directly on WhatsApp with new drops.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 px-4 bg-[#1A1A19] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight">
            Ready to scale your WhatsApp sales?
          </h2>
          <p className="text-[#A89F97] max-w-lg mx-auto text-sm sm:text-base">
            Set up your storefront today. Free forever on Starter tier.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C4653A] hover:bg-[#A8522E] text-white font-bold text-sm rounded-xl uppercase tracking-wider transition-all shadow-md"
            >
              Build My Store Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E2DC] py-8 px-4 text-center text-xs text-[#6B6560] bg-[#FAFAF7]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-heading font-bold text-[#1A1A19]">
            EazzyShop Platform
          </div>
          <p>© {new Date().getFullYear()} EazzyShop. Built for African & Global Merchants.</p>
        </div>
      </footer>
    </div>
  );
}
