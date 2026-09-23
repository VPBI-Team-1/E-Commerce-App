# Manajemen Brand

Admin menggunakan fitur Manajemen Brand untuk mengelola daftar merek produsen komponen komputer dan periferal di toko ByteStore. Data merek ini dimanfaatkan pelanggan sebagai filter pencarian utama saat mencari produk dari pabrikan terpercaya di katalog toko.

## Alur dan Cara Kerja

### 1. Validasi Input dan Pencegahan Nama Ganda
Saat admin menambahkan atau memperbarui merek melalui modal `CreateBrandButton`, data nama divalidasi di sisi server menggunakan skema pustaka Zod. Skema ini mewajibkan nama merek memiliki panjang minimal dua karakter dan membersihkan spasi berlebih (*trimming*).

Server juga menjalankan pemeriksaan keunikan nama secara *case-insensitive* ke database sebelum penyimpanan dilakukan. Pemeriksaan ini menjamin tidak ada dua merek dengan ejaan yang sama (seperti "Asus" dan "ASUS") terdaftar ganda di sistem. Pencegahan nama ganda menjaga kerapian etalase filter toko dan mencegah fragmentasi pengelompokan produk.

### 2. Pengurutan Alfabetis Baku Bahasa Indonesia
Halaman `/admin/brands` menampilkan daftar merek yang tersusun rapi secara alfabetis A-Z. Sistem mengurutkan data di sisi server menggunakan metode `localeCompare('id', { sensitivity: 'base' })`.

Standar pengurutan berbasis lokal ini memastikan merek dengan variasi huruf besar-kecil atau karakter khusus tersusun secara presisi sesuai kaidah alfabetis bahasa Indonesia. Pengurutan alfabetis yang konsisten memudahkan staf administrasi mencari merek tertentu secara cepat di dalam tabel.

### 3. Pencarian dan Paginasi Sisi Server
Tabel merek dilengkapi bilah pencarian interaktif (`BrandSearch`) yang memeriksa kecocokan nama merek secara *case-insensitive*.

Pencarian dijalankan langsung di tingkat server, bukan menyaring baris di memori peramban klien. Sistem membatasi baris data sebanyak 10 merek per halaman menggunakan paginasi dinamis (`BrandPagination`). Pembatasan baris ini menghemat waktu pemuatan halaman dan menjaga tampilan tetap rapi meski toko mencatat puluhan merek periferal yang berbeda.

### 4. Pemantauan Agregasi Produk Terhubung
Tabel merek menampilkan jumlah produk yang sedang bernaung di bawah masing-masing merek menggunakan agregasi `_count.products` Prisma.

Indikator angka ini memberikan gambaran langsung kepada admin mengenai volume barang dari setiap produsen. Informasi ini juga menjadi acuan penting sebelum admin memutuskan untuk mengubah nama merek atau menata ulang katalog.

### 5. Perlindungan Penghapusan Lapis Ganda
Admin dilarang menghapus merek yang masih memiliki keterkaitan dengan produk di database toko. Sistem menerapkan perlindungan lapis ganda untuk menegakkan aturan bisnis ini:
- Pemeriksaan Logika Aplikasi (Guard Clause): Sebelum kueri hapus dijalankan, Server Action memeriksa nilai keterkaitan produk. Jika ada produk yang terhubung, server membatalkan proses dan mengirim pesan edukatif kepada admin agar memindahkan produk ke merek lain terlebih dahulu.
- Pembatasan Tingkat Database (Foreign Key Restrict): Di lapisan skema Prisma, relasi produk dan merek dikonfigurasi dengan aturan `onDelete: Restrict`. Pembatasan ini menjadi benteng pertahanan kedua di level basis data untuk memastikan relasi data tidak pernah putus (*broken relation*).

### 6. Pembaruan Cache Antarmuka
Setiap operasi penambahan, pengubahan, atau penghapusan merek diakhiri dengan pemanggilan fungsi `revalidatePath('/admin/brands')`.

Langkah ini menghapus cache halaman statis lama di Next.js, sehingga seluruh perubahan nama merek atau penghapusan data langsung tecermin pada tabel admin dan opsi filter merek di etalase pembeli secara seketika.
