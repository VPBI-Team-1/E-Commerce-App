import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient) {
  console.log('--- Seeding Users ---');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@toko.com' },
    update: {},
    create: {
      name: 'Admin Toko',
      email: 'admin@toko.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@toko.com' },
    update: {},
    create: {
      name: 'Customer Biasa',
      email: 'customer@toko.com',
      password: hashedPassword,
      role: 'CUSTOMER',
      addresses: {
        create: {
          fullAddress: 'Gg. Kutai Utara No. 1, Tembok Ratapan Solo',
          isDefault: true,
        }
      }
    },
  });

  console.log(`Created users: ${admin.name} (ADMIN) & ${customer.name} (CUSTOMER)`);
}
