"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/currencies";
import { useState, use } from "react";
import Image from "next/image";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { notFound } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = use(params);
  
  const store = useQuery(api.stores.getBySlug, { slug });
  const product = useQuery(api.products.getBySlug, { 
    storeId: store?._id ?? ("skip" as any), 
    slug: productSlug 
  });
  
  const cart = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (store === undefined || product === undefined) return null;
  if (!store || !product) return notFound();

  const price = selectedVariant?.price ?? product.price;
  const compareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const isAvailable = selectedVariant ? selectedVariant.isAvailable : product.isAvailable;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    
    cart.addItem(
      {
        productId: product._id,
        productTitle: product.title,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        unitPrice: price,
        imageUrl: undefined,
      },
      quantity
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-8 w-full flex flex-col md:flex-row gap-8">
      {/* Mobile Image & Desktop Image */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="relative w-full aspect-[3/4] md:aspect-square md:rounded-[12px] overflow-hidden bg-[#F5F0EB]">
          <div className="w-full h-full flex items-center justify-center text-[#A89F97]">
            {product.title}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/2 px-4 md:px-0 py-6 flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A19] mb-2">
            {product.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xl font-bold text-[#1A1A19]">
              {formatPrice(price, (store.currency as any) || "KES")}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <>
                <span className="font-sans text-lg text-[#A89F97] line-through">
                  {formatPrice(compareAtPrice, (store.currency as any) || "KES")}
                </span>
                <span className="bg-[#C4653A]/10 text-[#C4653A] text-xs font-bold px-2 py-1 rounded-[4px]">
                  SALE
                </span>
              </>
            )}
          </div>
        </div>

        {/* Variant Selector */}
        {product.hasVariants && product.variantOptions && product.variants && (
          <VariantSelector 
            options={product.variantOptions}
            variants={product.variants}
            onVariantChange={setSelectedVariant}
          />
        )}

        <div className="h-px bg-[#E8E2DC] w-full" />

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#1A1A19]">Quantity</span>
            <div className="flex items-center border border-[#E8E2DC] rounded-[8px] bg-white">
              <button 
                className="w-10 h-10 flex items-center justify-center text-[#6B6560]"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-[#1A1A19] font-medium">{quantity}</span>
              <button 
                className="w-10 h-10 flex items-center justify-center text-[#6B6560]"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-full py-4 rounded-[6px] font-sans font-bold text-sm tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition-colors ${
              isAvailable 
                ? "bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white" 
                : "bg-[#E8E2DC] text-[#A89F97] cursor-not-allowed"
            }`}
          >
            <ShoppingBag size={18} />
            {isAvailable ? "Add to bag" : "Out of stock"}
          </button>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-4 prose prose-sm prose-stone">
            <h3 className="font-serif text-lg text-[#1A1A19] font-semibold mb-2">Description</h3>
            <div 
              className="text-[#6B6560] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
