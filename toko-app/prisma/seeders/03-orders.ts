import { PrismaClient, OrderStatus } from '@prisma/client';

export async function seedOrders(prisma: PrismaClient) {
  console.log('--- Seeding Orders ---');

  const customer = await prisma.user.findFirst({
    where: { role: 'CUSTOMER' },
    include: { addresses: true },
  });

  if (!customer) {
    console.warn('Customer tidak ditemukan, melewati seeding pesanan.');
    return;
  }

  // Ambil beberapa produk yang memiliki varian untuk dibuatkan item pesanan
  const products = await prisma.product.findMany({
    include: { variants: true },
    take: 10,
  });

  if (products.length < 3) {
    console.warn('Produk tidak cukup untuk membuat pesanan beragam.');
    return;
  }

  // Cari produk yang memiliki minimal 2 varian untuk skenario Case 2
  const multiVariantProduct = products.find((p) => p.variants.length >= 2) || products[0];
  const singleProduct1 = products[1] || products[0];
  const singleProduct2 = products[2] || products[0];

  const defaultShippingAddress = {
    recipientName: customer.name,
    phone: '081234567890',
    fullAddress: customer.addresses[0]?.fullAddress || 'Jl. Jenderal Sudirman No. 45, RT 02 / RW 05',
    city: 'Jakarta Selatan',
    postalCode: '12190',
  };

  const now = Date.now();
  const ONE_HOUR = 3600 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  // -------------------------------------------------------------------------
  // CASE 1: PENDING (Customer baru checkout, belum bayar)
  // -------------------------------------------------------------------------
  const p1Var = singleProduct1.variants[0];
  const p1Qty = 1;
  const p1Price = Number(p1Var.price);
  const p1Subtotal = p1Price * p1Qty;

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260920-0001',
      userId: customer.id,
      status: OrderStatus.PENDING,
      totalAmount: p1Subtotal,
      courier: 'Standard',
      expiresAt: new Date(now + ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - 2 * ONE_HOUR),
      items: {
        create: [
          {
            productVariantId: p1Var.id,
            productName: `${singleProduct1.name} (${p1Var.name})`,
            price: p1Price,
            quantity: p1Qty,
            subtotal: p1Subtotal,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------------------
  // CASE 2: VERIFYING (Customer sudah klik "Saya Sudah Bayar")
  // Skenario: Membeli 2 varian berbeda dari 1 produk yang sama
  // -------------------------------------------------------------------------
  const mvVar1 = multiVariantProduct.variants[0];
  const mvVar2 = multiVariantProduct.variants[1] || multiVariantProduct.variants[0];
  const mvPrice1 = Number(mvVar1.price);
  const mvPrice2 = Number(mvVar2.price);
  const mvTotal = mvPrice1 + mvPrice2;

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260920-0002',
      userId: customer.id,
      status: OrderStatus.VERIFYING,
      totalAmount: mvTotal,
      courier: 'Cargo',
      expiresAt: new Date(now + ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - ONE_HOUR),
      items: {
        create: [
          {
            productVariantId: mvVar1.id,
            productName: `${multiVariantProduct.name} (${mvVar1.name})`,
            price: mvPrice1,
            quantity: 1,
            subtotal: mvPrice1,
          },
          {
            productVariantId: mvVar2.id,
            productName: `${multiVariantProduct.name} (${mvVar2.name})`,
            price: mvPrice2,
            quantity: 1,
            subtotal: mvPrice2,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------------------
  // CASE 3: PAID (Admin sudah setujui pembayaran, siap dikirim)
  // Skenario: Membeli beberapa produk berbeda dalam 1 pesanan
  // -------------------------------------------------------------------------
  const c3Var1 = singleProduct1.variants[0];
  const c3Var2 = singleProduct2.variants[0];
  const c3Qty1 = 2;
  const c3Qty2 = 1;
  const c3Subtotal1 = Number(c3Var1.price) * c3Qty1;
  const c3Subtotal2 = Number(c3Var2.price) * c3Qty2;
  const c3Total = c3Subtotal1 + c3Subtotal2;

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260919-0003',
      userId: customer.id,
      status: OrderStatus.PAID,
      totalAmount: c3Total,
      courier: 'Standard',
      expiresAt: new Date(now + ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - ONE_DAY),
      items: {
        create: [
          {
            productVariantId: c3Var1.id,
            productName: `${singleProduct1.name} (${c3Var1.name})`,
            price: Number(c3Var1.price),
            quantity: c3Qty1,
            subtotal: c3Subtotal1,
          },
          {
            productVariantId: c3Var2.id,
            productName: `${singleProduct2.name} (${c3Var2.name})`,
            price: Number(c3Var2.price),
            quantity: c3Qty2,
            subtotal: c3Subtotal2,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------------------
  // CASE 4: SHIPPED - Normal (Barang sedang dalam perjalanan, ETA aktif)
  // -------------------------------------------------------------------------
  const c4Var = multiVariantProduct.variants[0];
  const c4Price = Number(c4Var.price);
  const c4Total = c4Price * 3;

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260918-0004',
      userId: customer.id,
      status: OrderStatus.SHIPPED,
      totalAmount: c4Total,
      courier: 'Standard',
      trackingNumber: 'BS-STD-889921',
      eta: new Date(now + 2 * ONE_DAY), // ETA 2 hari ke depan
      expiresAt: new Date(now + ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - 2 * ONE_DAY),
      items: {
        create: [
          {
            productVariantId: c4Var.id,
            productName: `${multiVariantProduct.name} (${c4Var.name})`,
            price: c4Price,
            quantity: 3,
            subtotal: c4Total,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------------------
  // CASE 5: SHIPPED - Timeout ETA (Barang telah melewati ETA)
  // Skenario: Untuk pengujian cron/auto-complete di masa mendatang
  // -------------------------------------------------------------------------
  const c5Var = singleProduct2.variants[0];
  const c5Price = Number(c5Var.price);

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260912-0005',
      userId: customer.id,
      status: OrderStatus.SHIPPED,
      totalAmount: c5Price,
      courier: 'Cargo',
      trackingNumber: 'BS-CRG-445512',
      eta: new Date(now - 2 * ONE_DAY), // ETA telah terlewat 2 hari lalu
      expiresAt: new Date(now - 9 * ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - 10 * ONE_DAY),
      items: {
        create: [
          {
            productVariantId: c5Var.id,
            productName: `${singleProduct2.name} (${c5Var.name})`,
            price: c5Price,
            quantity: 1,
            subtotal: c5Price,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------------------
  // CASE 6: COMPLETED (Pesanan selesai berhasil diterima)
  // -------------------------------------------------------------------------
  const c6Var = singleProduct1.variants[0];
  const c6Price = Number(c6Var.price);

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260910-0006',
      userId: customer.id,
      status: OrderStatus.COMPLETED,
      totalAmount: c6Price,
      courier: 'Standard',
      trackingNumber: 'BS-STD-112233',
      eta: new Date(now - 5 * ONE_DAY),
      expiresAt: new Date(now - 8 * ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - 8 * ONE_DAY),
      items: {
        create: [
          {
            productVariantId: c6Var.id,
            productName: `${singleProduct1.name} (${c6Var.name})`,
            price: c6Price,
            quantity: 1,
            subtotal: c6Price,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------------------
  // CASE 7: CANCELLED (Pesanan dibatalkan, stok dikembalikan)
  // -------------------------------------------------------------------------
  const c7Var1 = multiVariantProduct.variants[0];
  const c7Var2 = singleProduct2.variants[0];
  const c7Total = Number(c7Var1.price) + Number(c7Var2.price);

  await prisma.order.create({
    data: {
      invoiceNumber: 'INV-20260914-0007',
      userId: customer.id,
      status: OrderStatus.CANCELLED,
      totalAmount: c7Total,
      courier: 'Standard',
      expiresAt: new Date(now - 4 * ONE_DAY),
      shippingAddress: defaultShippingAddress,
      createdAt: new Date(now - 5 * ONE_DAY),
      items: {
        create: [
          {
            productVariantId: c7Var1.id,
            productName: `${multiVariantProduct.name} (${c7Var1.name})`,
            price: Number(c7Var1.price),
            quantity: 1,
            subtotal: Number(c7Var1.price),
          },
          {
            productVariantId: c7Var2.id,
            productName: `${singleProduct2.name} (${c7Var2.name})`,
            price: Number(c7Var2.price),
            quantity: 1,
            subtotal: Number(c7Var2.price),
          },
        ],
      },
    },
  });

  console.log('Seeded 7 orders across diverse statuses and cases successfully.');
}
