import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

/**
 * Memverifikasi apakah request berasal dari pengguna dengan role ADMIN.
 * Fungsi ini dikhususkan untuk dipanggil di dalam Server Actions sebelum
 * mengeksekusi logika atau query database.
 */
export async function verifyAdminServerAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return {
      success: false,
      error: "Unauthorized: Silakan login terlebih dahulu.",
    };
  }

  try {
    const payload = (await verifyAccessToken(sessionCookie)) as {
      role?: string;
    } | null;
    
    if (!payload || String(payload.role).toUpperCase() !== "ADMIN") {
      return {
        success: false,
        error: "Forbidden: Anda tidak memiliki akses admin.",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Unauthorized: Token tidak valid atau kadaluarsa.",
    };
  }

  return { success: true };
}
