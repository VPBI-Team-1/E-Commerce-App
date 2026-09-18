# RFC 0001: E-Commerce Domain & Branding Update (ByteStore)

**Status:** Proposed
**Author:** Muhammad Aprilianto (七日)
**Date:** 2026-09-19

## 1. Latar Belakang
Dokumen PRD saat ini (`PRD-Ind.md`) menggunakan konteks generik untuk proyek E-Commerce. Kita perlu menyelaraskan PRD dengan tujuan bisnis spesifik proyek ini, yaitu membangun sebuah platform E-Commerce untuk toko komputer.

## 2. Usulan Perubahan
Berikut adalah usulan perubahan pada dokumen `PRD-Ind.md` untuk mencerminkan identitas dan domain bisnis yang baru:

1. **Nama Aplikasi**: Mengubah judul "Local-First E-Commerce Application" menjadi **ByteStore**.
2. **Fokus Domain Bisnis**: Menegaskan fokus penjualan pada part/komponen komputer.
3. **Pembaruan Contoh Data (Examples)**:
   - **Varian Produk**: Mengubah contoh varian produk dari pakaian (Size: S/M/L) menjadi atribut sederhana part komputer (misalnya: *Color: Black / White* untuk Casing, *Packaging: Box / Tray* untuk Processor).
   - **Kategori**: Mengikuti benchmark *Enterkomputer* namun disederhanakan untuk MVP menjadi kategori utama beserta subkategorinya:
     - **Komponen PC** (Kategori Utama) memiliki subkategori:
       - *Processor, Motherboard, VGA, RAM, Storage, Casing, dan Power Supply*
     - **Peripherals & Aksesoris** (Kategori Utama) memiliki subkategori:
       - *Monitor / LCD, Keyboard & Mouse, dan Audio*

## 3. Dampak (Impact)
- **Dokumentasi**: Membutuhkan pengeditan teks pada bagian *Judul*, *Section 1 (Product Overview)*, *Section 12 (Product Variants)*, dan *Section 15 (Categories)* di dalam dokumen utama.
- **Pengembangan Code**: Tim pengembang (frontend & backend) akan menggunakan data dummy dan hierarki kategori yang berfokus pada part komputer saat membangun MVP, membuat konteks pengujian menjadi lebih relevan.
- **Arsitektur Teknis**: Tidak ada perubahan pada arsitektur atau tumpukan teknologi (tech stack). Ini murni penyesuaian domain/konteks bisnis.

## 4. Tindakan Selanjutnya (Action Items)
- [ ] Menunggu review, komentar, atau persetujuan dari anggota tim.
- [ ] Jika RFC ini disetujui, terapkan perubahan-perubahan di atas secara permanen ke dalam file `PRD-Ind.md`.
