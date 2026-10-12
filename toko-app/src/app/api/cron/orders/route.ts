import { NextResponse } from 'next/server';
import { syncOrderLifecycle } from '@/modules/admin/order/services/order-lifecycle.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await syncOrderLifecycle();

    return NextResponse.json({
      success: true,
      message: 'Sinkronisasi siklus hidup pesanan berhasil dijalankan.',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saat menjalankan cron order lifecycle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem saat menjalankan cron order lifecycle.',
      },
      { status: 500 }
    );
  }
}
