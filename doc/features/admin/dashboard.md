# Dashboard dan Arsitektur Admin

Halaman utama panel admin `/admin` berfungsi sebagai pusat pemantauan ringkasan operasional toko, kinerja penjualan, dan status inventaris ByteStore secara sekilas. Dokumen ini merangkum metrik ringkasan, arsitektur tata letak, estetika antarmuka, dan aturan pemisahan hak akses admin.

## Alur dan Cara Kerja

### 1. Agregasi Metrik Penjualan dan Katalog Berbasis Periode Bulan
Saat admin membuka dashboard, Server Component menerima parameter pencarian bulan (`searchParams.month` berformat `YYYY-MM`). Jika parameter tidak ada, sistem otomatis menggunakan bulan berjalan saat ini.

Server Component menjalankan kueri paralel menggunakan `Promise.all` untuk menarik empat indikator utama dari database:
- Total Penjualan: Akumulasi nilai tagihan kotor dari pesanan berstatus Lunas (*PAID*), Dikirim (*SHIPPED*), dan Selesai (*COMPLETED*) yang masuk pada rentang bulan terpilih menggunakan fungsi agregasi `_sum.totalAmount` Prisma. Transaksi berstatus dibatalkan atau belum bayar dikecualikan dari perhitungan omzet agar data keuangan tetap akurat.
- Total Pesanan Aktif: Menghitung seluruh transaksi yang tercatat pada rentang bulan terpilih di luar pesanan yang dibatalkan (*CANCELLED*).
- Produk Aktif di Katalog: Menghitung total varian produk yang tidak diarsipkan (`isArchived: false`) dan siap dibeli oleh pengunjung etalase toko.
- Total Pelanggan: Menghitung seluruh akun pengguna terdaftar yang memiliki peran pembeli (`role: 'CUSTOMER'`).

Pada bagian header ringkasan dashboard, tersedia pemilih bulan menggunakan elemen masukan bulan dan tahun (`<input type="month">`) melalui komponen `DashboardMonthFilter`. Setiap kali admin memilih bulan, URL akan diperbarui dengan parameter `?month=YYYY-MM` sehingga seluruh metrik penjualan, jumlah pesanan, dan grafik harian otomatis menyesuaikan dengan bulan yang dipilih.

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

### 4. Visualisasi Grafik Penjualan (SalesChart)
Untuk memantau performa bisnis dari waktu ke waktu, dashboard dilengkapi komponen visualisasi `SalesChart` berbasis pustaka `recharts`:
- Menggunakan diagram area (*AreaChart*) responsif yang menampilkan agregasi nilai penjualan harian untuk setiap hari pada bulan yang dipilih.
- Sumber Data: Menghitung total nilai pesanan lunas (*PAID*, *SHIPPED*, *COMPLETED*) yang masuk dalam rentang tanggal 1 hingga akhir bulan terpilih.
- Penanganan Kondisi UI (*UI States*):
  - *Loading State*: Menampilkan kerangka visual (*skeleton shimmer*) saat grafik sedang memuat atau proses hidrasi sisi klien.
  - *Empty State*: Menampilkan pesan informatif jika belum ada catatan transaksi penjualan pada bulan tersebut.
  - *Error State*: Menampilkan kartu peringatan jika terjadi kegagalan pengambilan data.
- Tooltip Interaktif: Menampilkan rincian nominal penjualan dalam format Rupiah dan jumlah pesanan yang terselesaikan pada tanggal terkait.

### 5. Tabel Pesanan Terbaru (RecentOrders)
Di bawah grafik penjualan, terdapat tabel ringkas `RecentOrders` yang menampilkan 5 transaksi pesanan terakhir:
- Menyajikan ringkasan informasi berupa nomor faktur (*Invoice*), tanggal transaksi, nama dan email pelanggan, total tagihan beserta jumlah item, status pesanan dengan lencana warna (*OrderStatusBadge*), dan tombol pintasan menuju halaman detail pesanan.
- Tautan "Lihat Semua Pesanan" di bagian pojok kanan atas tabel mengarahkan admin langsung ke halaman `/admin/orders` untuk pengelolaan transaksi lebih lanjut.
- Penanganan Kondisi UI (*UI States*): Mendukung tampilan memuat (*loading skeleton*) serta tampilan kosong jika belum ada pesanan yang masuk ke toko.

### 6. Pemisahan Hak Akses (Role-Based Redirect)
Sistem memisahkan peran pengguna secara tegas antara Admin dan Pelanggan (*Customer*).

Akun dengan peran Admin dikhususkan murni untuk mengelola operasional toko. Sesi login yang terdeteksi memiliki peran Admin akan dicegah membuka halaman belanja khusus pembeli (seperti Keranjang Belanja, formulir Checkout, atau Profil Pelanggan). Jika staf mencoba membuka rute-rute tersebut, sistem di lapisan middleware dan server akan langsung mengalihkan (*redirect*) peramban kembali ke halaman Dashboard Admin (`/admin`). Perlindungan ini mencegah akun staf melakukan transaksi belanja tidak sengaja menggunakan akun operasional toko.

