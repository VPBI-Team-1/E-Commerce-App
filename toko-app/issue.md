🎯 **Target**: AI Agent / Junior Programmer
💡 **Deskripsi Task**: Implementasi halaman preview produk untuk admin dengan menggunakan ulang komponen detail produk customer tanpa elemen interaktif e-commerce.

## 1. Goal
Buat halaman preview detail produk khusus untuk admin. Halaman ini digunakan agar admin dapat melihat tampilan produk dari kacamata customer, namun tanpa fitur interaksi customer (seperti tombol masukkan ke keranjang) dan tanpa layout utama customer (navbar/footer).

## 2. Context & Input
- Admin tidak memiliki akses ke halaman utama e-commerce untuk customer, karenanya preview perlu dibuat terpisah di area admin.
- Halaman preview ini akan diakses melalui pilihan "Preview" di dalam dropdown list (tombol titik tiga) pada baris produk di tabel daftar produk admin.
- Tampilan harus sama persis dengan halaman detail produk customer yang sudah ada.

## 3. Constraints & Rules (Antislop & Prompt Master)
- **Komponen Reusable**: Ekstrak dan refactor kode UI detail produk di folder store menjadi komponen global jika saat ini masih terikat dengan layout spesifik store.
- **Batasan UI Admin**: Halaman preview tidak boleh menampilkan navbar dan footer milik customer.
- **Navigasi**: Wajib menyediakan tombol "Back" (Kembali) di halaman preview. Tombol ini harus berfungsi memundurkan riwayat navigasi sebanyak -1 (`router.back()`).
- **Antislop Rule**: Dilarang menggunakan tombol mati (dead controls). Tombol back harus benar-benar berfungsi. Dilarang menggunakan kata-kata buzzword AI pada komentar kode atau antarmuka.
- **Antislop Rule**: Dilarang menggunakan karakter em dash. Gunakan tanda hubung biasa, titik, atau koma.

## 4. Step-by-Step Implementation

**Langkah 1: Refactor Komponen Detail Produk**
- Lokasikan kode yang saat ini merender halaman detail produk untuk customer.
- Pisahkan antarmuka utama (gambar produk, judul, harga, deskripsi) menjadi komponen global yang dapat digunakan ulang.
- Tambahkan properti (props) seperti `isPreview={true}` pada komponen tersebut untuk mengontrol elemen. Jika true, sembunyikan elemen spesifik customer seperti tombol "Add to Cart", "Buy Now", dan pemilih jumlah barang.

**Langkah 2: Buat Halaman Preview Admin**
- Buat route baru untuk halaman preview admin.
- Jangan gunakan layout customer (jangan sertakan navbar dan footer customer).
- Gunakan komponen detail produk yang sudah direfactor pada halaman ini dengan mengirimkan data produk dan parameter `isPreview={true}`.

**Langkah 3: Implementasi Tombol Back**
- Tambahkan tombol navigasi "Back" di bagian atas halaman preview.
- Gunakan fungsi router bawaan dari framework yang digunakan (misalnya `useRouter().back()` di Next.js) agar tombol ini memundurkan jalur navigasi ke riwayat sebelumnya (-1).

**Langkah 4: Integrasi Dropdown Action**
- Buka komponen tabel atau daftar produk admin yang memiliki tombol aksi titik tiga.
- Tambahkan opsi baru bernama "Preview".
- Arahkan opsi tersebut ke route preview yang baru dibuat berdasarkan ID produk yang dipilih.

## 5. Acceptance Criteria (Done When:)
- [ ] Opsi "Preview" muncul di dropdown tombol titik tiga pada daftar produk admin.
- [ ] Mengklik opsi "Preview" akan membuka halaman preview produk.
- [ ] Desain halaman preview sama persis dengan desain halaman customer.
- [ ] Halaman preview tidak menampilkan tombol keranjang belanja, tombol checkout, navbar, maupun footer customer.
- [ ] Tombol "Back" berfungsi memundurkan pengguna ke halaman sebelumnya.
- [ ] Refactor komponen berhasil dilakukan menjadi global komponen dan tidak merusak fungsionalitas detail produk di halaman asli customer.
- [ ] Tidak ada elemen interaktif statis yang tidak berfungsi (semua tombol memiliki logika).
