import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/insights",
  "/sentiment-analysis",
  "/competitive-insights",
  "/transcript",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const token = request.cookies.get("token")?.value;

  // Block access if no token
  if (isProtected && !token) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "true");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: [
    "/insights/:path*",
    "/sentiment-analysis/:path*",
    "/competitive-insights/:path*",
    "/transcript/:path*",
  ],
};
