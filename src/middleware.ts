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
const roleAccess = {
  SUPERADMIN: [
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
  CAPTAIN: [
    "/payment",
    "/boat-trip",
    "/trips-calender",
    "/manage-bookings",
    "/membership",
    "/support",
  ],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    console.log(decoded)
    const role = decoded?.role;
    const pathname = req.nextUrl.pathname;
    const allowedRoutes = roleAccess[role as keyof typeof roleAccess] || [];

    const isAuthorized = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    
    );

    console.log(isAuthorized)

    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
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
    // captain
    "/boat-trip",
    "/trips-calender",
    "/manage-bookings",
    "/membership",
    "/support",
    // user
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
