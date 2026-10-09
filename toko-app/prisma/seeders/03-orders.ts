import { PrismaClient, OrderStatus } from '@prisma/client';

export async function seedOrders(prisma: PrismaClient) {
  console.log('--- Seeding Orders (Production Simulation) ---');

  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { addresses: true },
  });

  if (!customers || customers.length === 0) {
    console.warn('Tidak ada Customer ditemukan, melewati seeding pesanan.');
    return;
  }

  const products = await prisma.product.findMany({
    include: { variants: true },
  });

  if (!products || products.length === 0) {
    console.warn('Tidak ada Produk ditemukan, melewati seeding pesanan.');
    return;
  }

  // Hanya gunakan produk yang memiliki varian
  const availableProducts = products.filter((p) => p.variants.length > 0);

  if (availableProducts.length === 0) {
    console.warn('Produk tidak memiliki varian.');
    return;
  }

  // Tanggal 1 September 2026 - 1 Oktober 2026
  const startDate = new Date('2026-09-01T00:00:00Z').getTime();
  const endDate = new Date('2026-10-01T23:59:59Z').getTime();
  
  // Total data pesanan yang akan dibuat
  const totalOrders = 120; 

  console.log(`Mulai membuat ${totalOrders} pesanan secara acak (Sep - Okt 2026)...`);

  let completedCount = 0;
  let cancelledCount = 0;
  const ONE_DAY = 24 * 3600 * 1000;

  for (let i = 0; i < totalOrders; i++) {
    // Pilih customer secara acak
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Pilih tanggal secara acak dalam rentang
    const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
    
    // Penentuan status: lebih banyak CANCELLED (~70%) daripada COMPLETED (~30%)
    const isCancelled = Math.random() < 0.70;
    const status = isCancelled ? OrderStatus.CANCELLED : OrderStatus.COMPLETED;
    
    if (isCancelled) cancelledCount++;
    else completedCount++;

    // Tentukan jumlah produk yang dibeli (1 sampai 3 item)
    const numItems = Math.floor(Math.random() * 3) + 1; 
    
    const itemsData: {
      productVariantId: string;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];
    let totalAmount = 0;

    // Pilih item pesanan secara acak
    for (let j = 0; j < numItems; j++) {
      const product = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const variant = product.variants[Math.floor(Math.random() * product.variants.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // Qty 1-3
      const price = Number(variant.price);
      const subtotal = price * quantity;
      
      // Hindari duplikasi varian dalam satu pesanan
      if (!itemsData.some(item => item.productVariantId === variant.id)) {
        itemsData.push({
          productVariantId: variant.id,
          productName: `${product.name} (${variant.name})`,
          price,
          quantity,
          subtotal,
        });
        totalAmount += subtotal;
      }
    }

    // Jika kebetulan kosong karena duplikasi random
    if (itemsData.length === 0) continue;

    const defaultShippingAddress = {
      recipientName: customer.name,
      phone: '081234567890',
      fullAddress: customer.addresses[0]?.fullAddress || 'Jl. Jenderal Sudirman No. 45, RT 02 / RW 05',
      city: 'Jakarta Selatan',
      postalCode: '12190',
    };

    // Format Invoice: INV-YYYYMMDD-XXXX
    const dateStr = randomDate.toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNumber = `INV-${dateStr}-${String(i + 1).padStart(4, '0')}`;

    await prisma.order.create({
      data: {
        invoiceNumber,
        userId: customer.id,
        status,
        totalAmount,
        courier: Math.random() > 0.5 ? 'Standard' : 'Cargo',
        trackingNumber: !isCancelled ? `BS-TRK-${Math.floor(Math.random() * 1000000)}` : null,
        eta: !isCancelled ? new Date(randomDate.getTime() + 3 * ONE_DAY) : null,
        expiresAt: new Date(randomDate.getTime() + ONE_DAY),
        shippingAddress: defaultShippingAddress,
        createdAt: randomDate,
        items: {
          create: itemsData,
        },
      },
    });
  }

  console.log(`\nBerhasil membuat total pesanan.`);
  console.log(`- Total Pesanan Selesai (COMPLETED): ${completedCount}`);
  console.log(`- Total Pesanan Dibatalkan (CANCELLED): ${cancelledCount}`);
  console.log('--- Selesai Seeding Orders ---\n');
}
