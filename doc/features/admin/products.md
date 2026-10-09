# Manajemen Produk

Admin menggunakan fitur Manajemen Produk untuk mengelola seluruh inventaris toko, mencakup katalog barang, deskripsi detail, spesifikasi teknis, garansi produk, varian harga dan stok, serta galeri gambar.

## Alur dan Cara Kerja

### 1. Daftar Katalog, Pencarian, dan Pengurutan Data
Admin mengelola daftar barang melalui halaman `/admin/products`. Tabel menyajikan informasi visual produk, kategori, merek, rentang harga, total stok gabungan, dan status arsip barang.

Pencarian produk dijalankan di tingkat server berdasarkan nama barang menggunakan filter *contains* dengan mode *insensitive*. Admin juga dapat menyaring produk berdasarkan status publikasinya: Semua Produk, Produk Aktif (ditampilkan di katalog publik), atau Produk Diarsipkan (disembunyikan dari etalase).

Halaman menyediakan fitur pengurutan data berdasarkan tiga kriteria utama:
- Tanggal Dibuat: Mengurutkan produk baru ke lama atau sebaliknya menggunakan fungsi bawaan database.
- Harga Terendah atau Tertinggi: Mengurutkan produk berdasarkan harga varian paling murah pada masing-masing barang.
- Stok Paling Sedikit atau Terbanyak: Mengurutkan produk berdasarkan akumulasi stok seluruh varian yang dimiliki.

Perhitungan pengurutan harga dan stok dilakukan pada kumpulan data varian produk sebelum halaman disajikan ke peramban. Sistem membatasi tampilan tabel sebanyak 8 produk per halaman dengan paginasi sisi server untuk menghemat kuota transmisi data dan mempercepat waktu muat halaman.

### 2. Form Pembuatan dan Pembaruan Produk
Proses input produk baru (`/admin/products/new`) dan perubahan data produk (`/admin/products/[id]/edit`) menggunakan komponen terpadu `ProductForm`. Form ini menerima data terstruktur yang terdiri dari:
- Identitas Dasar: Nama produk, deskripsi rinci, spesifikasi teknis, dan informasi masa garansi.
- Kategori dan Merek: Dropdown relasional yang dimuat langsung dari tabel kategori dan brand yang aktif di database.
- Manajemen Varian Dinamis: Setiap produk wajib memiliki minimal satu varian barang. Setiap varian memuat nama varian (misal: "16GB RAM / 512GB SSD"), SKU (Stock Keeping Unit) unik untuk pelacakan fisik gudang, harga jual satuan, dan jumlah stok fisik yang tersedia.
- Galeri Gambar: Unggahan berkas foto produk dengan penentuan gambar utama (*primary cover*) dan pengaturan urutan tampil (*sort order*).

Sistem meletakkan data harga dan kuantitas stok pada level varian produk, bukan pada data produk induk. Keputusan struktur ini diambil karena periferal dan perangkat komputer umumnya dijual dengan beragam spesifikasi teknis (seperti variasi kapasitas penyimpanan, frekuensi memori, atau warna unit) yang memiliki perbedaan modal, harga jual, dan jumlah stok masing-masing.

### 3. Pembuatan Produk Secara Atomik
Saat admin menekan tombol simpan, data diproses melalui Server Action yang membungkus tiga operasi database ke dalam metode `prisma.$transaction`. Transaksi ini mengeksekusi pembuatan data produk induk, baris varian barang, dan barisan data URL gambar secara serentak.

Transaksi database mencegah anomali data di mana produk induk berhasil tersimpan di sistem, namun varian gagal tersimpan karena gangguan koneksi jaringan. Transaksi memastikan seluruh entitas produk tersimpan secara lengkap, atau dibatalkan seutuhnya (rollback) jika ada satu bagian yang gagal. Kerapian data ini sangat krusial karena saat pelanggan melakukan *checkout*, sistem akan langsung mengunci kuantitas stok pada baris varian barang (*Reserve on Checkout*) untuk mencegah dua pembeli merebutkan barang yang sama (*race condition*).

### 4. Manajemen Penyimpanan Gambar
Admin dapat mengunggah beberapa gambar sekaligus untuk satu produk. Server Action memeriksa setiap berkas untuk memastikan hanya format gambar yang sah (JPG, PNG, WebP, dan GIF) dengan ukuran maksimal 5MB per berkas yang diproses.

Berkas gambar diteruskan ke lapisan layanan penyimpanan `storageService` yang menggunakan pendekatan abstraksi *adapter*. Pada lingkungan pengembangan lokal, berkas disimpan di sistem direktori publik aplikasi, sedangkan pada lingkungan produksi, sistem dapat dialihkan ke layanan penyimpanan berkas berbasis awan seperti Vercel Blob. Database relasional hanya menyimpan tautan URL publik gambar tersebut. Menyimpan berkas gambar di penyimpanan eksternal dan hanya mencatat tautannya di database menjaga tabel data tetap berukuran kecil dan membuat kueri data produk tetap responsif.

Sistem menandai satu gambar sebagai foto sampul utama melalui atribut `isPrimary`. Foto utama inilah yang otomatis dimunculkan pada kartu produk di beranda toko dan hasil penelusuran katalog.

### 5. Validasi Penghapusan Varian Produk
Saat admin mengedit produk dan memilih untuk menghapus salah satu varian lama, sistem tidak langsung memusnahkan baris varian dari database. Server terlebih dahulu melakukan pengecekan ke tabel baris pesanan (`OrderItem`).

Jika ID varian tersebut sudah pernah dibeli dan tercatat pada transaksi sebelumnya, sistem menolak aksi penghapusan dan mengirimkan pesan peringatan kepada admin. Menghapus varian yang sudah memiliki riwayat pembelian akan merusak keutuhan data transaksi masa lalu (*broken foreign key*). Pembatasan ini menjaga catatan riwayat pembelian pelanggan tetap utuh dan akuntabel.

### 6. Mode Arsip (Soft Delete)
Antarmuka admin sengaja tidak menyediakan tombol hapus permanen untuk produk yang sudah terdaftar. Sebagai gantinya, admin menggunakan fitur arsip (*Archive*) yang memperbarui nilai kolom `isArchived` menjadi benar (*true*).

Produk yang diarsipkan secara otomatis disembunyikan dari katalog toko, tidak dapat dicari oleh pengunjung, dan ditolak saat ada upaya pembelian langsung. Kebijakan ini diterapkan karena produk toko sering kali sudah memiliki relasi dengan riwayat pesanan pelanggan lama, ulasan pembeli, dan daftar keinginan (*wishlist*). Menghapus baris produk secara permanen (*hard delete*) akan menimbulkan kegagalan integritas database relasional. Mode arsip menjaga riwayat pesanan historis tetap dapat menampilkan nama dan spesifikasi barang yang telah dibeli tanpa mengorbankan kerapian katalog saat ini.

### 7. Serialisasi Tipe Data Prisma ke Komponen Klien
Prisma menyimpan angka harga pada tipe data `Decimal` untuk menjamin akurasi perhitungan pecahan mata uang tanpa pembulatan liar floating-point. Namun, Next.js Server Components dan Client Components tidak dapat mengirimkan objek instans `Decimal` mentah melintasi batas jaringan klien tanpa memicu kesalahan serialisasi JSON.

Oleh karena itu, sebelum data produk dilempar dari Server Component ke tabel interaktif di antarmuka pengguna (`ProductTable`), lapisan query secara eksplisit mengonversi seluruh nilai `Decimal` menjadi tipe `number` JavaScript standar. Penyeragaman tipe data ini menjamin antarmuka dapat merender format mata uang Rupiah secara konsisten tanpa kendala hidrasi.
