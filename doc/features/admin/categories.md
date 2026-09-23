# Manajemen Kategori

Admin menggunakan fitur Manajemen Kategori untuk menyusun struktur katalog barang di ByteStore. Pengelompokan barang yang rapi mempermudah pembeli saat menelusuri katalog toko dan menggunakan penyaring produk di etalase utama.

## Alur dan Cara Kerja

### 1. Struktur Hierarki Mandiri (Self-Referencing)
Sistem menyimpan seluruh kategori dalam satu tabel database yang sama menggunakan relasi mandiri (*self-referencing model*). Sebuah kategori ditentukan kedudukannya lewat kolom `parentId`:
- Jika nilai `parentId` kosong (*null*), kategori tersebut berkedudukan sebagai Kategori Utama (Induk).
- Jika nilai `parentId` terisi dengan ID kategori lain, kategori tersebut berkedudukan sebagai Subkategori (Anak).

Menyimpan kedua tingkat kategori di dalam tabel tunggal menyederhanakan skema database relasional tanpa memerlukan tabel tambahan yang redundan. Sistem menerapkan validasi ketat agar kategori tidak dapat memilih ID miliknya sendiri sebagai induk. Validasi ini mencegah terjadinya masalah *circular dependency* (siklus rujukan tak berujung) yang dapat menyebabkan kueri database mengalami kegagalan rekursif.

### 2. Pemisahan Halaman Kategori Utama dan Subkategori
Untuk menjaga kemudahan operasional admin saat mengelola ratusan nama kategori, antarmuka admin memisahkan pengelolaan ke dalam dua tampilan khusus yang dihubungkan oleh bilah navigasi tab (`CategoryNavTabs`):
- Halaman Kategori Utama (`/admin/categories`): Khusus menampilkan dan mengelola kategori payung tingkat atas (seperti "Komponen PC", "Periferal", atau "Penyimpanan Data").
- Halaman Subkategori (`/admin/subcategories`): Khusus menampilkan kelompok barang yang lebih spesifik yang bernaung di bawah kategori induk (seperti "Prosesor", "Kartu Grafis", atau "Monitor").

Halaman subkategori dilengkapi dengan bilah filter khusus (`SubCategoryFilter`) yang memungkinkan admin memfilter daftar berdasarkan kategori induk tertentu atau mencari nama subkategori secara langsung. Kedua halaman menggunakan paginasi sisi server sebanyak 10 baris per halaman untuk menjaga kecepatan muat data.

### 3. Pemantauan Agregasi Relasi
Tabel kategori menyajikan informasi jumlah produk dan jumlah subkategori turunan secara otomatis menggunakan agregasi `_count` Prisma.

Admin dapat melihat dengan jelas berapa banyak produk yang sedang bernaung di bawah suatu kategori, serta berapa banyak subkategori anak yang terikat pada kategori utama. Informasi angka ini membantu staf toko mengambil keputusan penataan katalog, seperti mengetahui kategori yang masih kosong atau yang sudah terlalu padat sehingga perlu dipecah.

### 4. Validasi Perubahan Kedalaman Hierarki
Kategori utama yang sudah memiliki turunan subkategori dilarang keras diubah menjadi subkategori baru di bawah kategori lain.

Sistem membatasi struktur navigasi katalog toko hanya pada dua tingkat kedalaman (Induk ke Anak). Pembatasan ini sengaja ditetapkan agar pengalaman belanja pelanggan di sisi depan (*frontend*) tetap terfokus, sederhana, dan tidak membingungkan pengguna dengan pohon subkategori bertingkat yang terlalu dalam. Jika admin diizinkan mengubah kategori utama yang telah memiliki anak menjadi subkategori, kedalaman struktur katalog akan membengkak menjadi tiga level atau lebih.

### 5. Perlindungan Penghapusan Data Bersyarat
Sistem secara proaktif menolak perintah penghapusan jika kategori yang dituju masih memuat produk aktif atau masih memiliki subkategori turunan di bawahnya.

Pengecekan perlindungan ini dipasang langsung di dalam kode Server Action sebelum kueri penghapusan dikirim ke database. Dengan menangkap kondisi ini di level logika aplikasi, sistem dapat mengirimkan pesan kesalahan yang jelas dan mudah dipahami oleh admin, alih-alih melempar kode kegagalan teknis dari lapisan database (*foreign key constraint violation*).

Jika admin berniat menghapus suatu kategori, admin wajib memindahkan atau menghapus seluruh produk dan subkategori di dalamnya terlebih dahulu. Aturan ini mencegah produk toko kehilangan induk katalognya (*orphaned products*).

### 6. Pembaruan Cache Antarmuka
Setiap kali terjadi penambahan data melalui tombol modal `CreateCategoryButton`, perubahan nama kategori, atau penghapusan kategori, server memanggil fungsi `revalidatePath` untuk kedua rute: `/admin/categories` dan `/admin/subcategories`.

Panggilan fungsi ini menghapus cache halaman statis lama di Next.js secara instan, sehingga data terkini langsung disajikan kepada admin dan pengunjung toko tanpa memerlukan muat ulang peramban secara manual.
