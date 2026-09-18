# RFC 0004: Strategi File Storage (Vercel Blob & Local)

**Status:** Proposed
**Author:** Muhammad Aprilianto (七日)
**Date:** 2026-09-19

## 1. Latar Belakang
Pada dokumen utama `PRD-Ind.md` (bagian atas), spesifikasi untuk **File Storage** saat ini ditetapkan hanya menggunakan **Local filesystem**. 

Meskipun ini cocok untuk pengembangan awal (*development*), aplikasi ini ke depannya ditargetkan untuk di-*deploy* ke **Vercel**. Vercel menggunakan arsitektur *Serverless* di mana *filesystem*-nya bersifat **Read-Only** (hanya-baca). Ini berarti jika aplikasi mencoba menyimpan *file* (seperti gambar produk yang diunggah Admin) secara lokal di *production*, *file* tersebut tidak akan tersimpan atau akan segera terhapus. Oleh karena itu, kita membutuhkan strategi penyimpanan yang mendukung lingkungan *Production* (Vercel) namun tetap mudah digunakan saat *Development* di komputer lokal.

## 2. Usulan Perubahan
Berikut adalah usulan penerapan pola **Storage Adapter Pattern** dengan memilih **Vercel Blob** sebagai solusi penyimpanan awan (*cloud storage*) utama. 

Alasan pemilihan Vercel Blob: Sangat direkomendasikan karena integrasinya yang mulus dan instan dengan ekosistem Vercel, sehingga tim tidak perlu membuang waktu mengkonfigurasi solusi yang lebih rumit seperti AWS S3.

**Strategi Implementasinya:**
Fungsi untuk mengunggah *file* (misal: `uploadImage(file)`) tidak boleh melakukan *hardcode* fungsi *upload*, melainkan harus mengecek *environment* (lingkungan):
1. **Lingkungan Development (`NODE_ENV === 'development'`)**:
   Sistem akan menyimpan *file* ke folder lokal (misal: `public/uploads/`) menggunakan *Node.js File System* (`fs`). Ini memungkinkan tim bekerja secara *offline* dengan cepat.
2. **Lingkungan Production (`NODE_ENV === 'production'`)**:
   Sistem akan mengarahkan unggahan ke **Vercel Blob** menggunakan *library* `@vercel/blob`.

**Pembaruan Spesifikasi di PRD:**
Mengubah baris spesifikasi:
*Dari:* `File Storage: Local filesystem`
*Menjadi:* `File Storage: Local filesystem (Development) & Vercel Blob (Production)`

## 3. Dampak (Impact)
- **Kode (*Codebase*)**: Fungsi unggah *file* harus diabstraksi. Modul produk tidak boleh langsung memanggil `fs.writeFileSync`, melainkan harus memanggil *helper function* (misal `storageService.upload()`) yang di dalamnya menangani logika *environment* di atas.
- **Infrastruktur**: Tim perlu membuat layanan Vercel Blob di *dashboard* Vercel dan mengatur variabel lingkungan (`BLOB_READ_WRITE_TOKEN`) saat proses *deployment* tiba.
- **Dependency**: Memerlukan penambahan pustaka `@vercel/blob` di masa mendatang (saat akan *deploy*).

## 4. Tindakan Selanjutnya (Action Items)
- [ ] Menunggu review, komentar, atau persetujuan dari anggota tim.
- [ ] Jika disetujui, terapkan perubahan status "File Storage" secara permanen ke dalam dokumen utama `PRD-Ind.md`.
