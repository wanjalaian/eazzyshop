import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/storefront/product-card";
import { Search } from "lucide-react";
import Image from "next/image";

export default async function StoreHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const store = await fetchQuery(api.stores.getBySlug, { slug });
  if (!store) return null;

  const products = await fetchQuery(api.products.listByStore, { storeId: store._id });
  const categories = await fetchQuery(api.categories.listByStore, { storeId: store._id });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full relative h-[30vh] min-h-[250px] bg-slate-100 flex items-center justify-center overflow-hidden">
        {store.bannerUrl ? (
          <Image 
            src={store.bannerUrl} 
            alt={store.name} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-[#F5F0EB] w-full h-full flex items-center justify-center">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A19]">
              {store.name}
            </h1>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#6B6560]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-[#E8E2DC] rounded-lg bg-white placeholder-[#A89F97] focus:outline-none focus:ring-1 focus:ring-[var(--store-accent)] focus:border-[var(--store-accent)] sm:text-sm text-[#1A1A19]"
            placeholder="Search products..."
          />
        </div>

        {/* Categories (Horizontal Scroll) */}
        {categories && categories.length > 0 && (
          <div className="flex overflow-x-auto scrollbar-hide py-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3">
            <button className="whitespace-nowrap px-5 py-2 rounded-full bg-[var(--store-accent,#C4653A)] text-white text-sm font-medium">
              All
            </button>
            {categories.map((cat: any) => (
              <button 
                key={cat._id}
                className="whitespace-nowrap px-5 py-2 rounded-[20px] bg-[#F5F0EB] text-[#6B6560] hover:text-[#1A1A19] text-sm font-medium transition-colors border border-transparent"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A19]">All Products</h2>
          <select className="text-sm border-none bg-transparent text-[#6B6560] font-medium focus:ring-0 cursor-pointer">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Sellers</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {products?.map((product: any) => (
            <ProductCard key={product._id} product={product} storeSlug={slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
