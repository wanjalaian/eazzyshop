import Link from "next/link";
import { Store, MessageSquare, Smartphone, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A19]">
      {/* Header */}
      <header className="border-b border-[#E8E2DC] bg-[#FAFAF7]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A19] flex items-center justify-center text-white">
              <Store size={18} />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight">EazzyShop</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#1A1A19] hover:text-[#C4653A] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-[#1A1A19] text-white px-4 py-2 rounded-lg hover:bg-[#1A1A19]/90 transition-colors"
            >
              Create Store
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#F5F0EB] border border-[#E8E2DC] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C4653A] mb-6">
          <Zap size={14} /> Built for WhatsApp Merchants
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-[#1A1A19] mb-6">
          Shopify simplicity, <br />
          <span className="text-[#C4653A]">WhatsApp direct delivery.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#6B6560] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          Set up your branded mobile catalog in under 2 minutes. Receive formatted order links directly in your merchant WhatsApp — no payment gateways, no transaction commissions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-[#C4653A] hover:bg-[#A8522E] text-white rounded-lg font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Start Free Store
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E8E2DC] hover:bg-[#F5F0EB] text-[#1A1A19] rounded-lg font-semibold text-sm transition-colors flex items-center justify-center"
          >
            Merchant Dashboard
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1A1A19]">Mobile-First Catalog</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Curated magazine-style product grids with variant matrix (sizes, colors, capacity) optimized for African mobile connections.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1A1A19]">Instant WhatsApp Orders</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Buyers build their cart, choose delivery zone, and send a beautifully formatted order directly to your WhatsApp Business number.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8E2] text-[#C4653A] flex items-center justify-center">
              <Store size={24} />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1A1A19]">CRM & Manual Sales</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Log sales from chat, manage repeat customers, track top buyers, and handle multi-currency pricing (KES, UGX, TZS, USD, EUR).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E2DC] py-12 px-4 text-center text-sm text-[#6B6560]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-heading font-bold text-[#1A1A19]">
            <Store size={16} /> EazzyShop
          </div>
          <p>© {new Date().getFullYear()} EazzyShop. Multi-Tenant WhatsApp Commerce Platform.</p>
        </div>
      </footer>
    </div>
  );
}
