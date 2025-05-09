// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This middleware protects routes that should only be accessible to authenticated users with specific roles
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Path patterns that should be protected (admin/staff only)
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isCheckoutRoute = request.nextUrl.pathname.startsWith("/checkout");
  const isProtectedRoute = isAdminRoute || isCheckoutRoute;

  // If not logged in and trying to access protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in but not admin/staff and trying to access admin route
  if (
    token &&
    isAdminRoute &&
    !["admin", "staff"].includes(token.role as string)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in but not admin and trying to access specific admin-only sections
  const isAdminOnlyRoute = request.nextUrl.pathname.startsWith("/admin");
  if (token && isAdminOnlyRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
