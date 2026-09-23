import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { seedUsers } from './seeders/01-users';
import { seedProducts } from './seeders/02-products';
import { seedOrders } from './seeders/03-orders';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== Mulai Menjalankan Database Seeder ===');
  
  console.log('Clearing old data...');
  // Hapus semua data (urutan delete bergantung relasi foreign key)
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.order.deleteMany();
  
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Eksekusi seeder berurutan
  await seedUsers(prisma);
  await seedProducts(prisma);
  await seedOrders(prisma);

  console.log('=== Seluruh Seeder Berhasil Dijalankan! ===');
}

main()
  .catch((e) => {
    console.error('Error saat menjalankan seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    // pool.end() juga penting agar process Node bisa exit dengan bersih.
    await pool.end();
  });
