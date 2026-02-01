import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the authentication token from the request cookies
  const authToken = request.cookies.get("authToken")?.value;

  // Define the paths
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute = pathname === "/" || pathname.startsWith("/website");
  const isProtectedButNotAuthRoute = !isAuthRoute && !isPublicRoute;

  // Condition 1: If logged in and trying to access an auth route
  if (authToken && isAuthRoute) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Condition 2: If NOT logged in and trying to access a protected route
  if (!authToken && isProtectedButNotAuthRoute) {
    // Redirect to the login page
    const loginUrl = new URL("/auth/login", request.url);
    // Optional: Add a redirect parameter to return to the original page after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

  // Add locale to request headers for next-intl
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Optional: Configure which paths the middleware should run on.
// You can use a more specific matcher to avoid running the middleware on static files.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
