import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/currencies";

export function ProductCard({ product, storeSlug }: { product: any, storeSlug: string }) {
  const mainImage = product.images?.[0];
  const isOnSale = product.compareAtPrice > product.price;

  return (
    <Link href={`/store/${storeSlug}/product/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative w-full aspect-[3/4] rounded-[12px] overflow-hidden bg-[#F5F0EB] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(26,26,25,0.08)]">
        {mainImage ? (
          <Image 
            src={mainImage} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A89F97] text-sm img-loading">
            <span className="animate-pulse">Loading...</span>
          </div>
        )}
        
        {isOnSale && (
          <div className="absolute top-3 left-3 bg-[#C43A3A] text-white text-[10px] font-bold px-2 py-1 rounded-[4px] uppercase tracking-wider">
            Sale
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute top-3 left-3 bg-[#1A1A19] text-white text-[10px] font-bold px-2 py-1 rounded-[4px] uppercase tracking-wider">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="font-sans font-medium text-[15px] text-[#1A1A19] leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-sans font-bold text-[#1A1A19]">
            {formatPrice(product.price, 'USD')}
          </span>
          {isOnSale && (
            <span className="font-sans text-sm text-[#A89F97] line-through">
              {formatPrice(product.compareAtPrice, 'USD')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
