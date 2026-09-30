# Feature: Halaman Profil bergaya Tokopedia & Manajemen Alamat

## Deskripsi
Implementasi halaman profil baru yang menyerupai tata letak Tokopedia, di mana terdapat sidebar navigasi persisten di sebelah kiri untuk berpindah antara halaman Profil, Pembelian (Orders), dan Wishlist. Pada tahap awal ini, fokus utama adalah mengimplementasikan **Layout Sidebar** dan **Halaman Profil** yang mencakup ubah biodata dan manajemen banyak alamat.

## Kriteria Penerimaan (Acceptance Criteria)
- [x] Terdapat struktur *Route Group* baru (misalnya `(account)`) agar sidebar hanya muncul pada rute terkait profil.
- [x] Komponen `<UserSidebar />` berhasil diimplementasikan dengan indikator halaman aktif (*active state*) yang jelas.
- [x] Pengguna dapat melihat dan mengubah biodata (Nama) di `/profile`.
- [x] Pengguna dapat melihat daftar alamat yang dimilikinya.
- [x] Pengguna dapat menambahkan alamat baru (alamat pertama otomatis menjadi *default*).
- [x] Pengguna dapat mengubah alamat yang ada.
- [x] Pengguna dapat menghapus alamat.
- [x] Pengguna dapat memilih satu alamat sebagai "Alamat Utama" (*default address*).
- [x] Desain UI mengikuti panduan *Antislop* (kontras tinggi, tata letak rapi, menghindari desain abu-abu pudar, dan menggunakan *micro-interactions* pada tombol/navigasi).

## Langkah Implementasi (Untuk Developer / AI Agent)

### 1. Struktur Folder & Layout (Next.js App Router)
- Buat folder Route Group `src/app/(store)/(account)`.
- Pindahkan folder `/profile` ke dalam `(account)`.
- Buat file `src/app/(store)/(account)/layout.tsx` yang menerapkan sistem *Grid* atau *Flexbox* dua kolom (Kolom kiri untuk Sidebar, kolom kanan untuk anak halaman/`children`).

### 2. Komponen Sidebar (`src/components/Store/UserSidebar.tsx`)
- Buat *Card* ringkasan profil di bagian atas (Avatar, Nama).
- Buat menu navigasi menggunakan `<Link>` ke:
  - `/profile` (Biodata Diri & Alamat)
  - `/orders` (Pembelian)
  - `/wishlist` (Wishlist)
- Gunakan *hook* `usePathname()` untuk memberikan *style* tebal/aktif pada menu yang sedang dikunjungi.

### 3. Server Actions / Integrasi Database (`src/app/actions/user.ts`)
- Buat fungsi `updateProfile(data)` untuk *update* nama pengguna.
- Buat fungsi CRUD untuk `Address`:
  - `getAddresses()`: `findMany` dengan filter `userId`.
  - `addAddress(data)`: `create` alamat baru.
  - `updateAddress(id, data)`: `update` detail alamat.
  - `deleteAddress(id)`: `delete` alamat.
  - `setDefaultAddress(id)`: Gunakan **Prisma Transaction** untuk set seluruh alamat pengguna menjadi `isDefault = false`, lalu set alamat target menjadi `isDefault = true`.

### 4. UI Halaman Profil (`src/app/(store)/(account)/profile/page.tsx`)
- **Bagian Biodata:** Tampilkan form sederhana untuk mengedit `name`.
- **Bagian Manajemen Alamat:**
  - Tampilkan list alamat dalam bentuk kotak berbingkai tipis.
  - Tambahkan *Badge* "Alamat Utama" untuk alamat dengan `isDefault === true`.
  - Sediakan tombol "Ubah", "Hapus", dan "Jadikan Utama".
  - Sediakan tombol "+ Tambah Alamat Baru" yang membuka Modal Form.
- **Modal Form:** Form yang berisi teks area untuk memasukkan `fullAddress`. Dapat digunakan ulang untuk mode "Tambah" maupun "Ubah".

### 5. Proteksi Keamanan (Middleware & Server Actions)
- **Middleware (`src/middleware.ts`):** Tambahkan pengecekan token/cookie autentikasi untuk memproteksi rute privat seperti `/profile`, `/orders`, dan `/wishlist`. Jika belum *login*, arahkan (redirect) pengguna secara otomatis ke halaman utama (*home*).
- **Server Actions:** Lindungi seluruh fungsi krusial yang merubah data di `user.ts` dengan memastikan pengguna terautentikasi dan *request* hanya mempengaruhi data milik pengguna tersebut (validasi `userId`).

## Catatan Tambahan
Pastikan selalu menggunakan `AuthContext` di tingkat komponen klien (*Client Components*) untuk sinkronisasi UI. Gunakan *loading states* saat mengirim data ke server.
