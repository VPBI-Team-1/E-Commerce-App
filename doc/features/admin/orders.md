# Manajemen Pesanan

Admin menggunakan fitur Manajemen Pesanan untuk memantau transaksi, memverifikasi pembayaran secara manual, memproses pengiriman logistik, dan mengelola pembatalan pesanan. Halaman ini menjadi pusat operasional pemenuhan pesanan toko ByteStore.

## Alur dan Cara Kerja

### 1. Daftar Pesanan Terpusat, Pencarian, dan Filter Status
Admin melihat seluruh transaksi pelanggan pada tabel utama `/admin/orders`. Untuk mempermudah pelacakan ribuan transaksi, sistem menyediakan bilah pencarian dan penyaring status transaksi.

Pencarian bekerja secara dinamis memeriksa kecocokan nomor invoice, nama pengguna, maupun alamat email akun secara *case-insensitive*. Pencarian diterapkan pada tiga kolom ini sekaligus karena staf administrasi sering kali hanya menerima nomor resi transfer, nama pengirim, atau bukti tangkapan layar email dari pembeli.

Sistem menyediakan opsi filter status pesanan mulai dari Menunggu Pembayaran (*Pending*), Menunggu Verifikasi (*Verifying*), Lunas (*Paid*), Dikirim (*Shipped*), Selesai (*Completed*), hingga Dibatalkan (*Cancelled*). Filter ini diteruskan langsung ke query Prisma di sisi server menggunakan parameter URL (*searchParams*). Menyimpan status filter di URL memudahkan admin membagikan tautan transaksi berstatus tertentu kepada rekan kerja lain tanpa kehilangan konteks halaman.

Tabel menerapkan paginasi di sisi server dengan batasan 10 baris per halaman. Sistem membagi data langsung di lapisan database menggunakan perintah `skip` dan `take` Prisma, bukan memuat semua data ke peramban. Pendekatan ini menjaga performa transfer data dan penggunaan memori tetap ringan seiring bertambahnya riwayat transaksi toko.

### 2. Rincian Transaksi pada Halaman Detail Pesanan
Admin membuka halaman detail pesanan `/admin/orders/[id]` untuk meninjau rincian spesifik satu transaksi. Halaman ini menyajikan informasi lengkap yang mencakup:
- Identitas penerima dan kontak, meliputi nama penerima, nomor telepon aktif, dan alamat email akun pembeli.
- Alamat pengiriman barang lengkap beserta detail kota dan kode pos.
- Metode pengiriman yang dipilih pelanggan, mencakup tipe kurir logistik (Standard atau Cargo) serta konfirmasi kebijakan Gratis Ongkir (Rp 0).
- Nomor resi pengiriman dan tanggal Estimasi Waktu Tiba (ETA) setelah barang dikirimkan.
- Tabel rincian barang yang dibeli, memuat nama produk, jenis varian spesifik, harga satuan saat dibeli, kuantitas, dan subtotal tagihan.
- Ringkasan akhir pembayaran yang menampilkan akumulasi nilai barang dan total tagihan pelanggan.

### 3. Snapshot Pesanan Permanen
Saat pelanggan menyelesaikan proses *checkout*, sistem merekam salinan data barang (*snapshot*) langsung ke dalam tabel relasi pesanan (`OrderItem`). Salinan ini menyimpan nama produk, nama varian, dan harga jual pada detik transaksi dibuat.

Admin sering kali perlu memperbarui deskripsi barang, mengganti judul produk, atau menaikkan harga jual di etalase katalog. Tanpa pencatatan snapshot permanen, perubahan data di masa depan akan merusak laporan akuntansi dan mengubah nilai belanja pada riwayat pesanan pelanggan lama. Database mencatat riwayat transaksi sebagai data statis yang kebal terhadap perubahan katalog di kemudian hari.

### 4. Verifikasi Pembayaran Manual
Pesanan baru berstatus *Pending*, lalu berpindah ke *Verifying* (Menunggu Verifikasi) saat pelanggan menekan tombol konfirmasi bayar di halaman akun mereka. Tombol "Setujui Pembayaran" akan muncul di panel admin hanya jika pesanan berstatus *Verifying*.

Admin memeriksa kecocokan mutasi rekening bank secara manual, lalu menekan tombol persetujuan tersebut untuk mengubah status pesanan menjadi *Lunas* (*Paid*). Pengecekan ketat menggunakan *guard clause* di level Server Action memastikan tombol aksi hanya dapat dieksekusi pada status *Verifying*. Pemeriksaan ini mencegah admin memverifikasi pesanan yang belum mengirim konfirmasi bayar atau memproses kembali pesanan yang sudah dibatalkan oleh sistem.

Setelah status diperbarui, server memanggil fungsi `revalidatePath` untuk membersihkan cache halaman daftar pesanan dan detail pesanan, sehingga pembaruan status langsung tampak di antarmuka tanpa perlu memuat ulang peramban.

### 5. Proses Pengiriman dan Resi Otomatis
Pada pesanan yang telah berstatus *Lunas*, panel admin menampilkan tombol aksi "Kirim Barang". Menekan tombol ini memicu logika backend untuk mengubah status transaksi menjadi *Dikirim* (*Shipped*), mencetak nomor resi tiruan, dan menghitung Estimasi Waktu Tiba (ETA).

Nomor resi dibuat secara otomatis menggunakan format kode kurir dan angka acak unik (misalnya `BS-STD-...` untuk pengiriman Standard dan `BS-CRG-...` untuk Cargo). Format acak ini mensimulasikan sistem logistik mandiri tanpa ketergantungan pada API logistik pihak ketiga pada tahap operasional awal.

Perhitungan ETA dilakukan otomatis sejak tombol diklik:
- Opsi kurir Standard: waktu sekarang ditambah 3 hari kalender.
- Opsi kurir Cargo: waktu sekarang ditambah 7 hari kalender.

Data resi dan tanggal estimasi tiba langsung disimpan ke tabel pesanan di database agar pelanggan dapat memantau kapan pesanan mereka diperkirakan sampai di tujuan.

### 6. Pembatalan Pesanan dan Pengembalian Stok Atomik
Admin dapat membatalkan transaksi yang bermasalah menggunakan tombol "Batalkan Pesanan". Tombol ini memunculkan jendela konfirmasi peringatan bahaya untuk mencegah klik tidak sengaja. Pembatalan hanya diizinkan untuk pesanan dengan status *Pending*, *Verifying*, atau *Lunas*. Sistem menolak pembatalan jika barang sudah berstatus *Dikirim* atau *Selesai* guna menghindari selisih stok fisik yang telah keluar dari gudang ekspedisi.

Saat pembatalan disetujui, sistem wajib mengembalikan kuantitas stok barang ke etalase utama agar dapat dibeli oleh pengunjung lain. Proses pengubahan status pesanan menjadi *Cancelled* dan penambahan kembali angka stok produk varian dibungkus ke dalam metode `prisma.$transaction`.

Transaksi database memastikan kedua perintah berjalan serentak. Jika koneksi database terputus atau salah satu mutasi stok varian gagal, seluruh rangkaian pembaruan dibatalkan (rollback). Mekanisme ini menjamin stok barang toko tidak pernah mengalami selisih perhitungan dengan data transaksi pesanan.

### 7. Otomatisasi Sistem (Auto-Cancel dan Auto-Complete)
Selain tindakan manual admin, sistem dilengkapi dua aturan bisnis otomatis untuk mencegah pesanan menggantung:
- Pembatalan Otomatis (Auto-Cancel 24 Jam): Pelanggan yang telah membuat pesanan diberi batas waktu 24 jam untuk melakukan pembayaran dan mengonfirmasi transfer. Jika batas waktu habis tanpa ada konfirmasi, sistem membatalkan pesanan secara otomatis dan mengembalikan stok barang ke etalase toko via transaksi atomik.
- Penyelesaian Otomatis (Auto-Complete 24 Jam Pasca-ETA): Setelah pesanan dikirim, pelanggan dapat menekan tombol "Pesanan Selesai" secara mandiri jika barang telah tiba. Namun, jika pelanggan lupa menekan tombol tersebut, sistem akan otomatis mengubah status pesanan menjadi *Selesai* (*Completed*) 24 jam setelah tanggal ETA terlewati. Aturan ini memastikan status transaksi diselesaikan secara tertib tanpa membiarkan laporan penjualan menggantung selamanya.
