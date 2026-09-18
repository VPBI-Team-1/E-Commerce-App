# RFC 0003: Standarisasi Arsitektur Modular Monolith untuk Next.js

**Status:** Proposed
**Author:** Muhammad Aprilianto (七日)
**Date:** 2026-09-19

## 1. Latar Belakang
Pada dokumen utama `PRD-Ind.md`, arsitektur aplikasi ditetapkan sebagai **Modular Monolith**. Terdapat kekhawatiran bahwa istilah ini dapat disalahartikan oleh tim pengembang sebagai keharusan untuk menerapkan pola *Clean Architecture* atau *Hexagonal Architecture* klasik (dengan *Ports*, *Adapters*, dan *Dependency Injection* yang kaku). Penerapan arsitektur klasik semacam itu di Next.js (App Router) justru sering menjadi *anti-pattern* karena melawan fitur bawaan kerangka kerja seperti *React Server Components* (RSC) dan *Server Actions*.

Oleh karena itu, diperlukan sebuah standarisasi untuk mendefinisikan apa yang dimaksud dengan "Modular Monolith" secara praktis dalam konteks Next.js.

## 2. Usulan Definisi & Struktur (Feature-Sliced Design)
Kami mengusulkan pendefinisian "Modular Monolith" sebagai pendekatan **Feature-Sliced Design** (pengelompokan berbasis fitur/domain). Aturan utamanya adalah:

1. **Pemisahan UI dan Logika Bisnis (Business Logic)**
   - Direktori `app/` dan `components/` **hanya** berisi komponen UI yang "bodoh" (*dumb components*).
   - Dilarang keras melakukan pemanggilan *database* (Prisma) secara langsung dari dalam komponen UI.

2. **Pengelompokan Berbasis Modul/Fitur**
   - Seluruh logika bisnis dipusatkan di dalam direktori `src/modules/`.
   - Modul dikelompokkan berdasarkan domain bisnis, bukan tipe teknis. Contoh: `src/modules/product/`, `src/modules/cart/`, `src/modules/order/`.

3. **Standar Isi Sebuah Modul**
   Setiap folder modul (misal: `src/modules/product/`) idealnya hanya memuat:
   - `product.schema.ts`: Skema validasi (menggunakan Joi atau Zod) untuk validasi *input/payload*.
   - `product.service.ts`: Fungsi-fungsi yang berinteraksi langsung dengan *database* via Prisma (misal: `findMany`, `create`).
   - `product.actions.ts`: Fungsi *Next.js Server Actions* yang bertugas memanggil `schema` untuk validasi, lalu mengeksekusi `service`, dan mengembalikan *response* ke UI.

## 3. Dampak (Impact)
- **Kurva Belajar (Learning Curve)**: Sangat ramah untuk seluruh anggota tim. Saat ditugaskan mengerjakan fitur "Keranjang", mereka hanya perlu fokus pada folder `src/modules/cart/` tanpa harus melompat ke banyak folder yang berbeda.
- **Kesesuaian Framework**: Memanfaatkan *Server Actions* bawaan Next.js secara optimal tanpa perlu pusing memikirkan *Dependency Injection* yang rumit.
- **Kode Bebas Spaghetti**: Mencegah penumpukan ratusan *file* campur aduk di dalam folder `app/`, sehingga *codebase* tetap bersih dan mudah di-*maintenance* (*scalable*).

## 4. Tindakan Selanjutnya (Action Items)
- [ ] Menunggu review, komentar, atau persetujuan dari anggota tim.
- [ ] Jika disetujui, tambahkan penjelasan arsitektur *Feature-Sliced Design* ini ke bagian **Architecture** di dokumen `PRD-Ind.md`.
