import { NextRequest, NextResponse } from "next/server";

const RESERVED_ROUTES = new Set([
  "login",
  "register",
  "setup",
  "dashboard",
  "store",
  "api",
  "_next",
  "favicon.ico",
  "images",
  "fonts",
]);

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const currentPath = request.nextUrl.pathname;

  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const baseDomain = isLocalhost ? "localhost" : (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "eazzyshop.com");

  let subdomain: string | null = null;

  if (isLocalhost) {
    // Dev: "urban-threads.localhost:3000" → "urban-threads"
    const parts = hostname.split(".localhost");
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "") {
      subdomain = parts[0];
    }
  } else {
    // Prod subdomain check: "urban-threads.eazzyshop.com" → "urban-threads"
    const parts = hostname.replace(`.${baseDomain}`, "").split(".");
    if (parts.length === 1 && parts[0] !== baseDomain.split(".")[0] && !hostname.includes("vercel.app")) {
      subdomain = parts[0];
    }
  }

  // 1. If accessed via Subdomain (e.g., urban-threads.eazzyshop.com)
  if (subdomain) {
    if (
      currentPath.startsWith("/dashboard") ||
      currentPath.startsWith("/api") ||
      currentPath.startsWith("/_next") ||
      currentPath.startsWith("/favicon")
    ) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = `/store/${subdomain}${currentPath}`;
    return NextResponse.rewrite(url);
  }

  // 2. If accessed via Path on Main Domain / Vercel Preview (e.g., eazzyshop-sandy.vercel.app/slime-shop)
  const segments = currentPath.split("/").filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0];

    // If first segment is NOT a reserved route (e.g. /slime-shop), treat as store slug!
    if (!RESERVED_ROUTES.has(firstSegment)) {
      const storeSlug = firstSegment;
      const subPath = segments.slice(1).join("/");
      const url = request.nextUrl.clone();
      url.pathname = `/store/${storeSlug}${subPath ? `/${subPath}` : ""}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
