# Dashboard dan Arsitektur Admin

Halaman utama panel admin `/admin` berfungsi sebagai pusat pemantauan ringkasan operasional toko, kinerja penjualan, dan status inventaris ByteStore secara sekilas. Dokumen ini merangkum metrik ringkasan, arsitektur tata letak, estetika antarmuka, dan aturan pemisahan hak akses admin.

## Alur dan Cara Kerja

### 1. Agregasi Metrik Penjualan dan Katalog
Saat admin membuka dashboard, Server Component menjalankan kueri paralel menggunakan `Promise.all` untuk menarik empat indikator utama dari database:
- Total Penjualan: Akumulasi nilai tagihan kotor dari pesanan yang telah berstatus Lunas (*PAID*), Dikirim (*SHIPPED*), dan Selesai (*COMPLETED*) menggunakan fungsi agregasi `_sum.totalAmount` Prisma. Transaksi berstatus dibatalkan atau belum bayar dikecualikan dari perhitungan omzet agar data keuangan tetap akurat.
- Total Pesanan Aktif: Menghitung seluruh transaksi yang tercatat di sistem di luar pesanan yang dibatalkan (*CANCELLED*).
- Produk Aktif di Katalog: Menghitung total varian produk yang tidak diarsipkan (`isArchived: false`) dan siap dibeli oleh pengunjung etalase toko.
- Total Pelanggan: Menghitung seluruh akun pengguna terdaftar yang memiliki peran pembeli (`role: 'CUSTOMER'`).

Pengambilan data secara paralel ini mempercepat waktu muat halaman karena empat kueri dijalankan serentak oleh mesin database PostgreSQL. Angka total penjualan langsung diformat ke standar mata uang Rupiah (*id-ID*) tanpa pecahan desimal.

### 2. Panduan Desain dan Estetika Antarmuka (Flat Minimalist)
Panel administrasi ByteStore menerapkan standar antarmuka fungsional yang berfokus pada keterbacaan data dan efisiensi kerja:
- Desain Datar (Flat Design): Menghindari bayangan (*shadow*) tebal atau ornamen dekoratif yang tidak perlu. Elemen kartu dan pembatas tabel menggunakan garis batas (*border*) tipis 1 piksel dengan warna abu-abu netral (`border-gray-200`).
- Palet Warna Netral Terfokus: Dominasi warna latar belakang putih bersih dan abu-abu terang dengan tipografi abu-abu gelap hingga hitam (`text-gray-900` dan `text-gray-500`). Warna aksen utama hanya disematkan pada tombol aksi penting (seperti "Simpan", "Kirim Barang", atau "Tambah Produk") agar staf dapat mengenali fungsi operasional dengan cepat.
- Ikonografi Terukur: Seluruh ikon navigasi dan kartu indikator menggunakan pustaka *Heroicons* jenis garis luar (*outline*). Penggunaan ikon dibatasi secara selektif pada menu samping dan penanda metrik utama agar tidak mengaburkan fokus pembacaan data teks dan tabel.

### 3. Struktur Navigasi Panel (AdminSidebar)
Tata letak panel admin (`layout.tsx`) membagi layar menjadi dua area tetap: bilah navigasi menu samping (*Sidebar*) di sebelah kiri selebar 256 piksel (`w-64`), dan area konten utama yang dapat digulir di sebelah kanan.

Bilah samping `AdminSidebar` memuat tautan menuju lima area kerja admin:
- Dashboard (`/admin`)
- Kategori dan Subkategori (`/admin/categories` dan `/admin/subcategories`)
- Brand Merek (`/admin/brands`)
- Katalog Produk (`/admin/products`)
- Manajemen Pesanan (`/admin/orders`)

Komponen mendeteksi rute halaman yang sedang aktif menggunakan pustaka `usePathname` dari Next.js untuk menyorot latar belakang menu yang dipilih, sehingga staf toko selalu memahami posisi halaman kerja mereka saat ini.

### 4. Pemisahan Hak Akses (Role-Based Redirect)
Sistem memisahkan peran pengguna secara tegas antara Admin dan Pelanggan (*Customer*).

Akun dengan peran Admin dikhususkan murni untuk mengelola operasional toko. Sesi login yang terdeteksi memiliki peran Admin akan dicegah membuka halaman belanja khusus pembeli (seperti Keranjang Belanja, formulir Checkout, atau Profil Pelanggan). Jika staf mencoba membuka rute-rute tersebut, sistem di lapisan middleware dan server akan langsung mengalihkan (*redirect*) peramban kembali ke halaman Dashboard Admin (`/admin`). Perlindungan ini mencegah akun staf melakukan transaksi belanja tidak sengaja menggunakan akun operasional toko.
