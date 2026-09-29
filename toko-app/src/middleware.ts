import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ekstraksi session token dari cookies
  const sessionCookie = request.cookies.get("session")?.value;

  let role: string | null = null;
  if (sessionCookie) {
    const payload = (await verifyAccessToken(sessionCookie)) as {
      role?: string;
    } | null;

    if (payload?.role) {
      role = String(payload.role).toUpperCase();
    }
  }

  const isAdmin = role === "ADMIN";
  const isCustomer = role === "CUSTOMER";

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminAuthPath =
    pathname === "/admin/login" || pathname === "/admin/register";

  // Skenario 1: Pengguna dengan role ADMIN
  if (isAdmin) {
    // Admin tidak diperbolehkan dan tidak perlu mengakses halaman customer / publik
    if (!isAdminPath) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Jika admin sudah login tetapi membuka /admin/login atau /admin/register, arahkan ke dashboard admin
    if (isAdminAuthPath) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // Skenario 2: Pengguna dengan role CUSTOMER
  if (isCustomer) {
    // Customer tidak boleh mengetahui path atau fitur apa pun milik admin.
    // Tampilkan halaman 404 Not Found untuk segala rute yang berhubungan dengan admin.
    if (isAdminPath) {
      return NextResponse.rewrite(new URL("/_not-found", request.url), {
        status: 404,
      });
    }

    return NextResponse.next();
  }

  // Skenario 3: Pengguna belum login (Guest / Tanpa token)
  if (isAdminPath) {
    // Hanya halaman auth admin (/admin/login atau /admin/register) yang dapat diakses oleh guest
    if (isAdminAuthPath) {
      return NextResponse.next();
    }

    // Jika belum login dan mencoba mengakses rute atau fitur khusus admin (/admin, /admin/products, dll.),
    // return status 404 Not Found (jangan redirect ke login) agar path admin tetap tersembunyi.
    return NextResponse.rewrite(new URL("/_not-found", request.url), {
      status: 404,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua path kecuali:
     * - API routes (/api/*)
     * - Next.js static files (_next/static, _next/image)
     * - File statis (favicon.ico, gambar .svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
