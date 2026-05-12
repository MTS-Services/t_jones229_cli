import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
// Define role-based access control
const roleAccess = {
  SUPERADMIN: [
    "/dashboard",
    "/user-management",
    "/trips-management",
    "/all-captain",
    "/all-customer",
    "/customer-info",
  ],
  ADMIN: [
    "/dashboard",
    "/user-management",
    "/trips-management",
    "/all-captain",
    "/all-customer",
    "/customer-info",
  ],
  USER: [
    "/edit-user-details",
    "/your-trips",
    "/payment",
    "/boat-list-form/Information",
    "/boat-list-form/photos-and-video",
    "/boat-list-form/fishing",
    "/boat-list-form/meeting-point",
    "/boat-list-form/description",
    "/boat-list-form/trips",
    "/boat-list-form/terms",
  ],
  CAPTAIN: [
    "/payment",
    "/boat-trip",
    "/trips-calender",
    "/manage-bookings",
    "/membership",
    "/support",
    "/payout-request",
    "/boat-list-form/Information",
    "/boat-list-form/photos-and-video",
    "/boat-list-form/fishing",
    "/boat-list-form/meeting-point",
    "/boat-list-form/meeting-point-map",
    "/boat-list-form/description",
    "/boat-list-form/trips",
    "/boat-list-form/terms",
  ],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams.toString();

  // Full URL with query params
  const fullPath = searchParams ? `${pathname}?${searchParams}` : pathname;

  if (!token) {
    // Save the original URL to redirect back after login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const role = decoded?.role;

    // ── Token expiry check ──────────────────────────────────────
    const isExpired =
      decoded.exp && decoded.exp < Math.floor(Date.now() / 1000);
    if (isExpired) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("expired", "1");
      const response = NextResponse.redirect(loginUrl);
      // Clear the stale cookie so middleware doesn't re-check it
      response.cookies.delete("token");
      response.cookies.delete("currentUserRole");
      return response;
    }
    // ────────────────────────────────────────────────────────────

    const allowedRoutes = roleAccess[role as keyof typeof roleAccess] || [];

    const isAuthorized = allowedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (!isAuthorized) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", fullPath);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("JWT verification failed:", err);
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", fullPath);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("token");
    response.cookies.delete("currentUserRole");
    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/user-management",
    "/trips-management",
    "/all-captain",
    "/all-customer",
    "/customer-info",
    "/boat-trip",
    "/trips-calender",
    "/manage-bookings",
    "/membership",
    "/support",
    "/payout-request",
    "/payment",
    "/edit-user-details",
    "/your-trips",
    "/boat-list-form/Information",
    "/boat-list-form/photos-and-video",
    "/boat-list-form/fishing",
    "/boat-list-form/meeting-point",
    "/boat-list-form/description",
    "/boat-list-form/trips",
    "/boat-list-form/terms",
  ],
};
