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
      is_verified: true,
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
      is_verified: true,
      addresses: {
        create: {
          fullAddress: 'Gg. Kutai Utara No. 1, Tembok Ratapan Solo',
          isDefault: true,
        }
      }
    },
  });

  const realCustomers = [
    { name: 'Budi Santoso', email: 'budi.santoso@toko.com', address: 'Jl. Merdeka No. 10, Jakarta' },
    { name: 'Siti Aminah', email: 'siti.aminah@toko.com', address: 'Jl. Pahlawan No. 45, Surabaya' },
    { name: 'Joko Prabowo', email: 'joko.prabowo@toko.com', address: 'Jl. Sudirman No. 8, Bandung' },
    { name: 'Rina Wati', email: 'rina.wati@toko.com', address: 'Jl. Diponegoro No. 22, Semarang' },
    { name: 'Agus Setiawan', email: 'agus.setiawan@toko.com', address: 'Jl. Gajah Mada No. 15, Medan' },
    { name: 'Dewi Lestari', email: 'dewi.lestari@toko.com', address: 'Jl. Hasanuddin No. 9, Makassar' },
    { name: 'Hendra Gunawan', email: 'hendra.gunawan@toko.com', address: 'Jl. Teuku Umar No. 33, Denpasar' },
    { name: 'Maya Sari', email: 'maya.sari@toko.com', address: 'Jl. Ahmad Yani No. 11, Palembang' },
    { name: 'Wahyu Hidayat', email: 'wahyu.hidayat@toko.com', address: 'Jl. Veteran No. 7, Yogyakarta' },
  ];

  const additionalCustomers = [];
  for (let i = 0; i < realCustomers.length; i++) {
    const customerData = realCustomers[i];
    const newCustomer = await prisma.user.upsert({
      where: { email: customerData.email },
      update: {},
      create: {
        name: customerData.name,
        email: customerData.email,
        password: hashedPassword,
        role: 'CUSTOMER',
        is_verified: true,
        addresses: {
          create: {
            fullAddress: customerData.address,
            isDefault: true,
          }
        }
      },
    });
    additionalCustomers.push(newCustomer);
  }

  console.log(`Created users: ${admin.name} (ADMIN), ${customer.name} (CUSTOMER), and ${additionalCustomers.length} additional customers.`);
}
