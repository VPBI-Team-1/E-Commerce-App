# Issue: Implementasi Fitur Manajemen Pesanan & Pengiriman

## Deskripsi Singkat
Berdasarkan Product Requirements Document (PRD) dan Panduan Admin, ByteStore membutuhkan sistem manajemen pesanan (Order Management) yang terintegrasi. Fitur ini mencakup siklus hidup pesanan dari *checkout* oleh pelanggan, verifikasi pembayaran oleh admin, proses pengiriman, hingga pesanan selesai atau dibatalkan. Sistem harus menangani pemotongan dan pengembalian stok barang secara presisi.

---

## 1. Tahapan Implementasi (Step-by-Step Guide)
*Panduan ini dirancang terstruktur agar mudah dieksekusi oleh junior programmer atau AI agent.*

### Tahap 1: Persiapan Database (Prisma Schema)
1. Buka file `prisma/schema.prisma`.
2. Pastikan model `Order` memiliki kolom untuk: `status` (Enum: `PENDING`, `VERIFYING`, `PAID`, `SHIPPED`, `COMPLETED`, `CANCELLED`), `totalAmount`, `shippingCourier`, `trackingNumber` (opsional), `eta` (opsional/Datetime), dan berelasi dengan `User` (customer) serta `OrderItem`.
3. Pastikan model `OrderItem` mencatat *snapshot* harga pada saat dibeli (`priceAtPurchase`) agar kebal dari perubahan harga di masa depan.
4. Jalankan `npx prisma db push` atau `npx prisma migrate dev` jika ada perubahan.

### Tahap 2: Setup Data Seeder (Testing Data)
1. Buat script seeder (misal `prisma/seeders/order.seeder.ts`) yang mengisi database dengan berbagai skenario pesanan (lihat bagian **Data Seeder** di bawah dokumen ini).
2. Tujuannya: Memudahkan developer membuat UI Admin dan Customer tanpa harus repot melakukan *checkout* manual dari awal setiap kali menguji fitur.

### Tahap 3: Pembuatan Logika Bisnis (Server Actions)
Buat file *Server Actions* (misal: `src/modules/admin/orders/actions/order.actions.ts`) yang berisi fungsi-fungsi berikut:
1. **`verifyPayment(orderId)`**: Mencari order dengan status `VERIFYING`, lalu mengubahnya menjadi `PAID`.
2. **`cancelOrder(orderId)`**: Mengubah status menjadi `CANCELLED`. Di dalam fungsi ini, buat logika *looping* ke setiap `OrderItem` untuk menambahkan kembali nilai kuantitas ke stok `Product` utama (RESTOCK). Wajib gunakan *Transaction* agar database konsisten.
3. **`shipOrder(orderId, courier)`**: Mengubah status menjadi `SHIPPED`. Generate *string* resi acak (contoh: `BS-RESI-<random>`). Hitung ETA (waktu saat fungsi dipanggil + 3 hari untuk Standard, atau + 7 hari untuk Cargo), lalu simpan ke database.

### Tahap 4: Pembuatan UI Admin - Daftar Pesanan
1. Buat halaman `/admin/orders`.
2. Gunakan *Server Component* untuk melakukan *fetch* semua data `Order` dari database.
3. Buat tabel *minimalis* (tanpa bayangan/shadow tebal) untuk menampilkan ID Pesanan, Nama Pelanggan, Total Harga, Status, dan Tanggal.
4. Tambahkan *filter* sederhana di bagian atas tabel untuk menyaring berdasarkan status (misal: "Lihat yang Perlu Verifikasi").

### Tahap 5: Pembuatan UI Admin - Detail Pesanan & Interaksi
1. Buat halaman dinamis `/admin/orders/[id]`.
2. Tampilkan rincian: Informasi Pelanggan, Alamat, Kurir, Daftar Barang yang dibeli, dan Total Tagihan.
3. Buat komponen **Client Component** (tombol aksi) yang memanggil *Server Actions* di Tahap 3:
   - Tombol **"Setujui Pembayaran"**: Hanya muncul jika status `VERIFYING`.
   - Tombol **"Kirim Barang"**: Hanya muncul jika status `PAID`.
   - Tombol **"Batalkan Pesanan"**: Tersedia jika status belum `SHIPPED`/`COMPLETED`.



---

## 2. Data Seeder (Skenario Pengujian Manual)
Gunakan referensi data JSON berikut untuk di-*inject* ke dalam database melalui script Seeder. Semua *case* ini diperlukan untuk pengujian menyeluruh UI Admin.

```typescript
// Asumsi sudah ada data Customer ID: "user-1" dan Product ID: "prod-1"

const dummyOrders = [
  // CASE 1: PENDING (Customer baru selesai checkout, belum bayar)
  // Test Case: Mengecek apakah pesanan masuk, admin bisa membatalkan pesanan.
  {
    id: "ORD-PENDING-001",
    userId: "user-1",
    status: "PENDING",
    shippingCourier: "STANDARD",
    totalAmount: 1500000,
    createdAt: new Date(),
    items: [
      { productId: "prod-1", variantId: "var-1-A", quantity: 1, priceAtPurchase: 1500000 }
    ]
  },

  // CASE 2: VERIFYING (Customer sudah klik "Saya Sudah Bayar")
  // Test Case: Membeli 2 varian berbeda dari 1 produk yang sama. Admin mengetes tombol "Setujui Pembayaran".
  {
    id: "ORD-VERIFY-002",
    userId: "user-1",
    status: "VERIFYING",
    shippingCourier: "CARGO",
    totalAmount: 8500000,
    createdAt: new Date(Date.now() - 3600000), // 1 jam lalu
    items: [
      { productId: "prod-2", variantId: "var-2-RED", quantity: 1, priceAtPurchase: 4250000 },
      { productId: "prod-2", variantId: "var-2-BLUE", quantity: 1, priceAtPurchase: 4250000 }
    ]
  },

  // CASE 3: PAID (Admin sudah setujui pembayaran)
  // Test Case: Membeli berbagai macam produk dalam satu pesanan. Admin mengetes tombol "Kirim Barang".
  {
    id: "ORD-PAID-003",
    userId: "user-1",
    status: "PAID",
    shippingCourier: "STANDARD",
    totalAmount: 450000,
    createdAt: new Date(Date.now() - 86400000), // 1 hari lalu
    items: [
      { productId: "prod-3", variantId: "var-3-A", quantity: 2, priceAtPurchase: 100000 },
      { productId: "prod-4", variantId: "var-4-B", quantity: 1, priceAtPurchase: 250000 }
    ]
  },

  // CASE 4: SHIPPED - Normal (Barang sedang dalam perjalanan)
  // Test Case: Mengecek apakah Resi dan ETA tampil di UI Detail Pesanan.
  {
    id: "ORD-SHIPPED-004",
    userId: "user-1",
    status: "SHIPPED",
    shippingCourier: "STANDARD",
    trackingNumber: "BS-RESI-XX8899",
    eta: new Date(Date.now() + 172800000), // ETA 2 hari ke depan
    totalAmount: 3200000,
    items: [
      { productId: "prod-5", variantId: null, quantity: 4, priceAtPurchase: 800000 } // Contoh tanpa varian spesifik
    ]
  },

  // CASE 5: SHIPPED - Timeout ETA (Barang harusnya sudah sampai)
  // Test Case: Untuk keperluan pengujian cron-job/auto-complete di masa depan.
  {
    id: "ORD-SHIPPED-TIMEOUT",
    userId: "user-1",
    status: "SHIPPED",
    shippingCourier: "CARGO",
    trackingNumber: "BS-RESI-CG9911",
    eta: new Date(Date.now() - 172800000), // ETA sudah lewat 2 hari yang lalu
    totalAmount: 12500000,
    items: [
      { productId: "prod-6", variantId: "var-6-A", quantity: 1, priceAtPurchase: 12500000 }
    ]
  },

  // CASE 6: COMPLETED (Pesanan sudah selesai)
  // Test Case: Mengecek riwayat pesanan sukses di tabel, pastikan tidak ada aksi/tombol lagi.
  {
    id: "ORD-COMPLETED-006",
    userId: "user-1",
    status: "COMPLETED",
    shippingCourier: "STANDARD",
    totalAmount: 900000,
    createdAt: new Date(Date.now() - (86400000 * 5)), // 5 hari lalu
    items: [
      { productId: "prod-7", variantId: "var-7-A", quantity: 1, priceAtPurchase: 900000 }
    ]
  },

  // CASE 7: CANCELLED (Pesanan dibatalkan)
  // Test Case: Mengecek riwayat pesanan gagal, pastikan stok kembali dan tombol aksi hilang.
  {
    id: "ORD-CANCEL-007",
    userId: "user-1",
    status: "CANCELLED",
    shippingCourier: "STANDARD",
    totalAmount: 250000,
    createdAt: new Date(Date.now() - 86400000),
    items: [
      { productId: "prod-8", variantId: "var-8-A", quantity: 1, priceAtPurchase: 100000 },
      { productId: "prod-9", variantId: "var-9-B", quantity: 1, priceAtPurchase: 150000 }
    ]
  }
];
```

## Referensi Terkait
- **PRD Utama:** "Product Requirements Document (PRD): ByteStore E-Commerce Platform"
- **Panduan UI/UX:** "Panduan Implementasi Fitur Admin (High-Level)" - Perhatikan aturan desain minimalis (tanpa shadow berlebih) dan aturan guard clauses saat penulisan Server Action.
