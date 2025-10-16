import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("rental_guru_token")?.value;
  const kycStatus = req.cookies.get("kyc_status")?.value;
  const isProfileCompleted = req.cookies.get("is_profile_completed")?.value;

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Public routes where logged-in users should be redirected to the dashboard
  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-otp",
  ];

  // If user is logged in and trying to access a public route, redirect to dashboard
  if (token && publicRoutes.includes(pathname)) {
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  // If user kyc status is pending and trying to access kyc page, redirect to main page
  if (
    token &&
    (kycStatus === "pending" || kycStatus === "approved") &&
    pathname === "/kyc"
  ) {
    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  if (token && kycStatus !== "approved" && pathname === "/setup-account") {
    url.pathname = "/kyc";

    return NextResponse.redirect(url);
  }

  if (token && isProfileCompleted === "true" && pathname === "/setup-account") {
    // If user profile is completed, redirect to dashboard
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  // If no token, redirect unauthorized users to sign-in page
  if (!token) {
    if (!publicRoutes.includes(pathname)) {
      url.pathname = "/auth/login";

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-otp",
    "/kyc",
    "/setup-account",
    "/my-properties/:path*",
    "/lease-agreement",
  ],
};
