import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EazzyShop — Your Store, Your Way",
  description:
    "Create your mobile storefront and receive orders directly on WhatsApp. No payment gateways, no complexity — just sell.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ConvexClientProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ConvexClientProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1A19",
              color: "#FAFAF7",
              border: "none",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
