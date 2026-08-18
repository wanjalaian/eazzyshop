import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { StoreHeader } from "@/components/storefront/store-header";
import { BottomNav } from "@/components/storefront/bottom-nav";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let store = null;
  try {
    store = await fetchQuery(api.stores.getBySlug, { slug });
  } catch (e) {
    // ignore
  }

  if (!store || !store.isLive) {
    notFound();
  }

  const primaryColor = store.primaryColor || "#C4653A";
  
  return (
    <div 
      className="min-h-screen bg-[#FAFAF7] text-[#1A1A19] font-sans pb-[56px] md:pb-0"
      style={{
        "--store-accent": primaryColor,
        "--store-accent-hover": "color-mix(in srgb, var(--store-accent) 85%, black)",
        "--store-accent-light": "color-mix(in srgb, var(--store-accent) 15%, white)",
      } as React.CSSProperties}
    >
      {store.announcementBar && (
        <AnnouncementBar text={store.announcementBar} />
      )}
      <StoreHeader store={store} slug={slug} />
      <main className="mx-auto w-full">{children}</main>
      <BottomNav storeSlug={slug} />
    </div>
  );
}
