# RFC 0002: Pembaruan Skema Produk (Brand & Garansi)

**Status:** Proposed
**Author:** Muhammad Aprilianto (七日)
**Date:** 2026-09-19

## 1. Latar Belakang
Mengikuti pembaruan domain bisnis menjadi toko komponen komputer (ByteStore) pada RFC 0001, struktur data produk saat ini di `PRD-Ind.md` (Bagian 11) masih terlalu umum. Pembeli komponen komputer sangat bergantung pada **Brand** (merek) dan **masa garansi** untuk membuat keputusan pembelian. Oleh karena itu, skema produk perlu disesuaikan untuk mengakomodasi penambahan data krusial ini untuk MVP. *(Catatan: Fitur spesifikasi teknis tingkat lanjut sengaja tidak dimasukkan agar pengembangan MVP tetap sederhana dan cepat).*

## 2. Usulan Perubahan
Berikut adalah usulan penambahan entitas Brand untuk mendukung fitur filter, serta penambahan field garansi langsung pada tabel produk:

1. **Entitas `Brand` (Tabel Baru)**
   - **Tujuan**: Mengelola entitas Brand agar memungkinkan fitur esensial seperti "Shop by Brand" dan filter pencarian global di halaman daftar produk.
   - **Relasi**: Menambahkan field `brandId` ke tabel `Product`.

2. **Field `warranty` (Tipe Data: String)**
   - **Tujuan**: Menampilkan informasi garansi yang wajib ada pada penjualan komponen elektronik. Field ini ditambahkan langsung di tabel `Product`.
   - **Alasan Penggunaan String (Efisiensi MVP)**: Tipe data `String` jauh lebih efisien untuk MVP karena membebaskan tim dari keharusan merancang logika kompleks penghitungan masa aktif garansi (seperti tanggal pesanan + jumlah bulan), serta lebih fleksibel menangani kasus khusus seperti "Lifetime Warranty" yang tidak bisa direpresentasikan dengan mudah dalam bentuk angka (Integer). Ini murni bersifat deskriptif.
   - **Contoh Data**: `"Resmi 3 Tahun"`, `"Distributor 1 Tahun"`, `"Lifetime Warranty"`.

**Usulan Skema Database Baru (Tambahan untuk Bagian 11 PRD):**
```text
Product
-------
... (semua field bawaan PRD)
brandId          <-- [BARU]
warranty         <-- [BARU]

Brand            <-- [TABEL BARU]
-----
id
name
slug
```

## 3. Dampak (Impact)
- **Database (Prisma)**: Memerlukan pembuatan satu model baru (`Brand`) serta penambahan field `brandId` dan `warranty String?` di tabel `Product`.
- **Frontend / UI**: Halaman Daftar Produk dapat ditambahkan fitur *Filter by Brand* (kriteria filter utama untuk MVP). Halaman Detail Produk disesuaikan untuk menampilkan nama/logo Brand dan informasi Garansi.
- **Admin Dashboard**: Form penambahan produk di Admin perlu menyediakan *dropdown* untuk memilih Brand dan input teks untuk garansi. Menu manajemen (CRUD) untuk tabel Brand juga perlu ditambahkan.

## 4. Tindakan Selanjutnya (Action Items)
- [ ] Menunggu review, komentar, atau persetujuan dari anggota tim.
- [ ] Jika disetujui, terapkan usulan penambahan skema ini secara permanen ke dalam file utama `PRD-Ind.md` (Bagian 11).
