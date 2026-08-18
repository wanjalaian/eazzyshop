import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default convexAuthNextjsMiddleware(
  async (request: NextRequest, { convexAuth }) => {
    // 1. Subdomain detection for multi-tenant storefronts
    const hostname = request.headers.get("host") || "";
    const currentPath = request.nextUrl.pathname;

    // Extract subdomain (e.g., "urban-threads" from "urban-threads.eazzyshop.com")
    // In dev, we use "urban-threads.localhost:3000"
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
    const baseDomain = isLocalhost ? "localhost" : (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "eazzyshop.com");

    let subdomain: string | null = null;

    if (isLocalhost) {
      // In dev: "urban-threads.localhost:3000" → "urban-threads"
      const parts = hostname.split(".localhost");
      if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "") {
        subdomain = parts[0];
      }
    } else {
      // In prod: "urban-threads.eazzyshop.com" → "urban-threads"
      const parts = hostname.replace(`.${baseDomain}`, "").split(".");
      if (parts.length === 1 && parts[0] !== baseDomain.split(".")[0]) {
        subdomain = parts[0];
      }
    }

    // If there's a subdomain, rewrite to /store/[slug] internally
    if (subdomain) {
      // Don't rewrite dashboard, API, or _next paths
      if (
        currentPath.startsWith("/dashboard") ||
        currentPath.startsWith("/api") ||
        currentPath.startsWith("/_next") ||
        currentPath.startsWith("/favicon")
      ) {
        return NextResponse.next();
      }

      // Rewrite /urban-threads.eazzyshop.com/product/foo → /store/urban-threads/product/foo
      const url = request.nextUrl.clone();
      url.pathname = `/store/${subdomain}${currentPath}`;
      return NextResponse.rewrite(url);
    }

    // 2. Auth protection for dashboard routes
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/login");
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
