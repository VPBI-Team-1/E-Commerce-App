import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    console.log(refreshToken);
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    cookieStore.delete("session");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ success: true, message: "Berhasil logout" });
  } catch (error) {
    console.error("Logout error: ", error);

    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ success: true });
  }
}
