# BLUEPRINT & SITEPLAN — GHEVERHAN
## Premium Fashion E-Commerce (Single Seller)

> Dokumen ini adalah acuan utama untuk Claude Code. Ikuti urutan fase secara berurutan. Jangan lompat fase atau menambah fitur di luar scope fase yang sedang dikerjakan tanpa persetujuan eksplisit.

---

## 1. RINGKASAN PROYEK

**Nama brand:** GHEVERHAN — Premium Fashion Store
**Jenis:** E-commerce single seller (bukan marketplace)
**Target:** Website + mobile-first web app (bukan native app)

**Model bisnis:** Template dijual sekali ke klien, klien self-host instance-nya sendiri (bukan SaaS). Setiap instance = 1 seller tunggal, diaktivasi lewat installer wizard dengan license key yang dikunci ke domain klien.

**Sistem lisensi (arsitektur dua bagian):**
1. **Server Lisensi** — aplikasi terpisah, di-hosting & dikontrol penuh oleh Anda (bukan bagian dari yang dijual ke klien). Menyimpan semua license key, status (active/suspended/expired), dan domain yang terkait.
2. **Instance Klien** — template yang dijual, berisi middleware validasi lisensi yang "phone home" secara berkala (misal tiap 24 jam) ke Server Lisensi Anda. Kalau domain tidak cocok / lisensi dicabut, fitur admin dibatasi (bukan mematikan total situs customer-facing) — beri grace period kalau server tidak terjangkau.

> Catatan realitas: karena klien memegang penuh source code, tidak ada proteksi yang 100% anti-bajak. Tujuan sistem ini adalah membuat pembajakan cukup merepotkan untuk kasus umum, bukan mustahil untuk kasus ekstrem.

**Tech stack (final):**
| Layer | Teknologi |
|---|---|
| Frontend & Backend | Next.js (App Router) + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth |
| Password Hashing | bcrypt |
| Validasi Input | Zod |
| Enkripsi Kredensial | Node.js `crypto` (AES-256-GCM) |
| File Storage | Cloudflare R2 (S3-compatible) |
| Payment | Tripay |
| Shipping | JNE / J&T Express API |
| Styling | Tailwind CSS |
| Icon | Lucide React (outline style) |

> Catatan: Redis sengaja TIDAK dicantumkan sebagai stack wajib — lihat bagian Backlog. Ditambahkan hanya kalau ada kebutuhan konkret (misal rate-limiting atau session store) yang muncul saat implementasi, bukan dipasang di awal tanpa tujuan jelas.

**Prinsip arsitektur (modular & scalable):**
- **Feature-based, bukan type-based**: kode dikelompokkan per domain/fitur di `/modules` (product, order, payment, dst), bukan dipisah cuma berdasarkan jenis file.
- **Layered**: `API route → Service → Repository → Database`. API route hanya validasi + panggil service; service berisi logic bisnis; hanya repository yang boleh bicara langsung ke Prisma.
- **Isolasi antar modul**: satu modul tidak boleh import internal modul lain secara langsung — mencegah dependency saling silang yang susah di-maintain.
- **Integrasi eksternal dibungkus**: semua panggilan ke Tripay, JNE/J&T dibungkus di `/lib/integrations/`, agar mudah diganti provider atau di-mock saat testing.
- **Validasi terpusat**: satu Zod schema per modul dipakai di frontend & backend, hindari duplikasi aturan.
- **Config terpusat, dua jenis:**
  - **Infra secret** (koneksi database, license server URL, `ENCRYPTION_KEY`) → tetap di `.env`, dibaca lewat `/lib/config.ts`.
  - **Provider credential yang bisa diubah klien** (Tripay API key, JNT API key) → **TIDAK di `.env`**, disimpan di database dalam bentuk terenkripsi (AES-256), diatur lewat menu **Pengaturan API** di admin dashboard, bukan hardcode di kode maupun `.env`.
- Tujuan akhir: service/repository layer bisa jadi acuan langsung kalau nanti migrasi ke Laravel di Fase 5 — logic bisnisnya tinggal diterjemahkan, tidak perlu dirancang ulang dari nol.
- Mobile-first di semua halaman, breakpoint desktop di 1024px.
- Tidak menambah dependency/library baru di luar yang disepakati per fase tanpa alasan kuat.

**Struktur folder:** Lihat diagram lengkap & aturan modular di `SPEC_FASE_0.md` bagian 3 — struktur ini adalah **satu-satunya sumber acuan** (jangan duplikat diagram ini di dokumen lain, untuk mencegah dua versi drift tidak sinkron).

---

## 2. DESIGN SYSTEM (dari referensi visual)

```yaml
colors:
  primary: "#000000"
  background: "#FFFFFF"
  # gray-scale diturunkan otomatis dari primary untuk border/disabled

typography:
  heading: "Playfair Display, serif"
  body: "Inter, sans-serif"

icons:
  style: "lucide-react (outline)"

layout:
  approach: "mobile-first"
  breakpoint_desktop: "1024px"

components_signature:
  - sticky mobile header
  - bottom navigation (mobile) — urutan tetap: Home, Shop, Keranjang, Profil (Profil: tampilkan Login/Daftar kalau belum login, atau Dashboard kalau sudah login)
  - hero carousel
  - flash sale section dengan countdown
  - category grid (icon + label)
  - product card modern (gambar, nama, harga coret, rating, badge diskon)
```

---

## 3. SITEMAP LENGKAP (dari referensi 14 screen + 4 desktop)

### Customer-facing
1. Splash Screen (mobile only)
2. Homepage (mobile & desktop)
3. Category Page (mobile & desktop)
4. Product List / PLP (mobile & desktop)
5. Product Detail / PDP (mobile & desktop)
6. Cart (Keranjang)
7. Checkout
8. Payment Method Selection
9. **Invoice / Instruksi Pembayaran** (BARU — ringkasan pesanan + cara bayar, status "Menunggu Pembayaran"; wajib untuk metode non-instan seperti VA/Transfer)
10. Payment Success (muncul setelah webhook Tripay konfirmasi bayar masuk)
11. Order Tracking (Lacak Pesanan)
12. Search
13. Wishlist
14. 404 Not Found
15. Footer (komponen global)

### Installer / Setup (khusus instance klien, dijalankan sekali saat pertama install)
- Step 1: Cek Requirement Server
- Step 2: Konfigurasi Database
- Step 3: Aktivasi Lisensi (input license key)
- Step 4: Registrasi Seller (buat akun admin/seller tunggal)
- Step 5: Setup Info Toko Dasar (nama brand, logo, warna — opsional)
- Step 6: Selesai → redirect ke Dashboard Admin

### Admin (menyusul, dari dokumen fitur — dipetakan ke fase lanjutan)
- Dashboard ringkasan
- Kelola Produk
- Kelola Pesanan
- Kelola Promo
- Kelola Ekspedisi
- Kelola Pembayaran
- Kelola User
- CMS/Customize Website
- Laporan & Analitik
- Pengaturan Sistem

---

## 4. PEMBAGIAN FASE

> Setiap fase = satu siklus penuh `/spec → /plan → /build → /test → /review → /ship`. Jangan mulai fase berikutnya sebelum fase sebelumnya lolos `/review`.

---

### FASE 0 — Fondasi Project
**Tujuan:** Setup teknis dasar, design tokens, struktur folder, database awal.

Termasuk:
- Init Next.js + TypeScript + Tailwind
- Setup font (Playfair Display + Inter), warna, komponen dasar (Button, Container)
- Setup Prisma + PostgreSQL, skema awal: `User` (password WAJIB di-hash bcrypt/argon2, tidak boleh plain text), `Product` (termasuk field gambar — storage pakai Cloudflare R2/S3-compatible, ditentukan di Fase 0), `Category`, `ApiSetting` (untuk kredensial Tripay/JNT terenkripsi, diisi lewat admin UI di Fase 0.6)
- Struktur folder modular (`/app/api`, `/components/ui`, `/components/layout`, `/lib`)
- ESLint + Prettier

Tidak termasuk: UI halaman apapun, auth logic, integrasi payment/shipping.

---

### FASE 0.5 — Sistem Lisensi & Installer Wizard
**Tujuan:** Fondasi proteksi lisensi & alur setup awal untuk klien, dikerjakan setelah Fase 0 tapi SEBELUM halaman publik — karena wizard adalah hal pertama yang dijalankan klien saat instance baru di-deploy.

Termasuk:
1. **Server Lisensi** (project terpisah, sederhana):
   - Model `License` (key, domain, status, expiresAt, lastCheckIn)
   - Endpoint `POST /activate` (dipanggil sekali saat wizard)
   - Endpoint `POST /verify` (dipanggil berkala oleh instance klien)
   - Admin panel super sederhana untuk Anda generate key baru (boleh manual dulu)
2. **Middleware validasi lisensi di instance klien**:
   - Validasi dijalankan lewat Next.js middleware yang cek `lastCheckIn` setiap request ke area admin (bukan cron terpisah — lebih reliable untuk lingkungan self-host klien yang beragam); refresh ke Server Lisensi maksimal 1x/24 jam
   - Simpan `lastValidCheck` lokal untuk grace period kalau server tidak terjangkau
   - Kalau invalid/suspended: batasi fitur admin (bukan matikan situs customer-facing)
   - **Normalisasi domain sebelum dibandingkan**: strip `www.`, protokol (`http/https`), dan trailing slash, supaya `www.klien.com` dan `klien.com` dianggap domain yang sama; domain staging/preview (misal `*.vercel.app`, `*.netlify.app`) diberi status "unverified" (bukan langsung ditolak) agar tidak mengganggu proses development
3. **Setup dasar NextAuth (dipindah dari Fase 2 ke sini)**:
   - Diperlukan karena Installer Wizard Step 4 sudah membuat akun admin dengan password — harus ada hashing (bcrypt) & session yang siap saat itu juga
   - Cukup credential login (email + password) untuk role admin; login social/register customer publik tetap di Fase 2 (konfigurasi NextAuth di sini akan DIPERLUAS di Fase 2, bukan disetup ulang dari nol)
4. **`ENCRYPTION_KEY` — disimpan di database, BUKAN ditulis ke `.env` saat runtime**:
   - Alasan: banyak platform hosting (Netlify, Vercel, dan serverless lain) punya filesystem read-only saat runtime — app tidak bisa menulis file `.env` sendiri setelah deploy
   - Pendekatan: `ENCRYPTION_KEY` di-generate wizard, disimpan di tabel `InstanceSetup` (kolom baru `encryptionKeyHash` atau setara), dilindungi oleh SATU master secret yang developer/klien set manual di environment variable platform hosting saat deploy pertama kali (`MASTER_SECRET`), bukan digenerate otomatis oleh aplikasi
   - Ini tetap kompatibel di platform apapun: VPS, Netlify, Vercel, Railway, dst
5. **Installer Wizard** (`/install`, hanya bisa diakses kalau instance belum pernah di-setup):
   - Step 1: Cek requirement server (Node version, koneksi DB)
   - Step 2: Konfigurasi database
   - Step 3: Aktivasi lisensi (panggil `/activate` ke Server Lisensi)
   - Step 4: **Registrasi Seller** — klien buat akun admin/seller tunggal, password di-hash sebelum simpan (pakai model `User` dari Fase 0, role `admin`)
   - Step 5: Setup info toko dasar (nama brand, logo, warna — opsional, boleh skip)
   - Step 6: Selesai, tandai instance sebagai "sudah ter-install", redirect ke dashboard admin
   - Wizard tidak bisa diakses ulang setelah Step 6 selesai (kecuali reset manual oleh developer)
   - Tabel `InstanceSetup` HARUS diperlakukan sebagai singleton (1 baris saja) — cek dan cegah insert baris kedua di level service

Tidak termasuk: sistem pembayaran otomatis untuk pembelian lisensi (generate key tetap manual dulu), UI admin lengkap (baru dasar untuk keperluan wizard), integrasi Tripay/JNT.

---

### FASE 0.6 — Pengaturan API & Integrasi (Tripay & JNT)
**Tujuan:** Menu khusus di admin dashboard agar kredensial Tripay & JNT diatur klien sendiri lewat UI, bukan hardcode di kode atau `.env`.

Termasuk:
1. Model `ApiSetting` — simpan kredensial per provider dalam bentuk terenkripsi:
```prisma
model ApiSetting {
  id              String   @id @default(cuid())
  provider        String   @unique // "tripay" | "jnt" | "jne"
  encryptedConfig String   // hasil enkripsi AES-256 dari JSON kredensial
  isActive        Boolean  @default(false)
  updatedAt       DateTime @updatedAt
}
```
2. Halaman admin **Pengaturan → Integrasi API**:
   - Form input kredensial Tripay (Merchant Code, API Key, Private Key)
   - Form input kredensial JNT (API Key, Client ID/Secret sesuai dokumentasi resmi)
   - Toggle sandbox/production per provider
   - Tombol "Test Koneksi" untuk verifikasi kredensial valid sebelum disimpan aktif
3. Helper enkripsi/dekripsi di `/lib/integrations/` — semua wrapper (`tripay.ts`, `jne.ts`) membaca kredensial lewat helper ini, bukan `process.env` langsung
4. Field sensitif di form **tidak ditampilkan ulang plain text** setelah disimpan (tampilkan masked, misal `••••1234`)

Tidak termasuk: logic bisnis integrasi (kirim transaksi, cek ongkir) — itu tetap dikerjakan di Fase 2 (Tripay) & Fase 3 (JNT), tapi keduanya WAJIB mengambil kredensial dari `ApiSetting`, bukan `.env`.

---

### FASE 1 — Halaman Publik Inti (sesuai referensi visual)
**Tujuan:** Semua halaman customer-facing yang bisa dilihat tanpa transaksi, mobile & desktop.

Urutan build (per sub-fase, masing-masing `/spec` sendiri):
1. **Layout global** — sticky header, bottom nav (mobile), footer, navigasi desktop
2. **Splash Screen** (mobile)
3. **Homepage** — hero carousel, flash sale + countdown, category grid, produk terlaris
4. **Category Page**
5. **Product List (PLP)** — filter, sort, grid produk
6. **Product Detail (PDP)** — galeri gambar, varian warna/ukuran, deskripsi, rating
7. **Search**
8. **Wishlist** (UI + simpan produk — auth dasar customer SUDAH tersedia sejak Fase 0.5, jadi tidak lagi kontradiktif; kalau belum login, arahkan ke halaman login sederhana)
9. **404 Page**
10. **Responsive desktop** untuk semua halaman di atas

Data produk masih dummy/seed data (belum ada admin panel untuk input produk asli).

Tidak termasuk: cart, checkout, payment. (Auth dasar sudah ada dari Fase 0.5; register/login customer dengan alur lengkap—verifikasi email, dll—tetap disempurnakan di Fase 2.)

---

### FASE 2 — Auth & Transaksi Inti
**Tujuan:** Customer bisa benar-benar belanja dari awal sampai bayar.

Termasuk:
1. Auth penuh untuk **customer** (register dengan verifikasi email, login, logout, session) via NextAuth — login admin sudah ada sejak Fase 0.5
2. **Cart** — tambah/hapus/update qty, hitung subtotal
3. **Checkout** — alamat pengiriman, pilih metode kirim (ongkir manual dulu), **kurangi stok pakai database transaction/row lock** untuk cegah race condition saat 2 pembeli checkout stok terakhir bersamaan
4. Integrasi **Tripay** (sandbox dulu) — payment method selection, generate transaksi. Kredensial **WAJIB diambil dari `ApiSetting`** (hasil Fase 0.6), bukan `.env`
5. **Alur setelah checkout — DUA halaman terpisah, bukan langsung "Thank You":**
   - **Invoice / Instruksi Pembayaran** — muncul segera setelah order dibuat (status `pending_payment`). Tampilkan ringkasan pesanan lengkap + instruksi bayar sesuai metode (VA/Transfer: nomor rekening & batas waktu; QRIS: kode/gambar QR). WAJIB ada meski untuk metode instan, supaya alur konsisten di semua metode pembayaran.
   - **Payment Success** — muncul setelah webhook Tripay konfirmasi bayar masuk, status order berubah jadi `paid`. Untuk metode instan (QRIS/e-wallet), transisi dari Invoice ke Payment Success bisa sangat cepat/otomatis lewat polling status.
6. **Webhook handler Tripay** — WAJIB verifikasi signature dari Tripay (tolak request yang signature-nya tidak valid) DAN idempotent (cegah proses dobel kalau Tripay retry webhook yang sama)
7. Order tersimpan di database dengan status: `pending_payment` → `paid` → (lanjut ke status pengiriman di Fase 3)

Tidak termasuk: integrasi API JNT/J&T live, order tracking detail, admin panel.

---

### FASE 3 — Order Management & Tracking
**Tujuan:** Customer bisa pantau pesanannya, sistem order lebih lengkap.

Termasuk:
1. **Order Tracking** page (status: diproses → dikirim → sampai)
2. Integrasi **JNE/J&T Express API** — cek ongkir otomatis, generate resi. Kredensial **WAJIB diambil dari `ApiSetting`** (hasil Fase 0.6), bukan `.env`
3. Riwayat pesanan di profil customer
4. Notifikasi email status order (dasar)

Tidak termasuk: admin panel untuk kelola order (itu Fase 4).

---

### FASE 4 — Admin Panel (Dasar)
**Tujuan:** Penjual (Anda) bisa kelola toko tanpa akses database manual.

Termasuk (versi MVP dari dokumen fitur lengkap):
1. Login admin (akun seller sudah dibuat sejak Installer Wizard di Fase 0.5, di sini hanya login)
2. Dashboard ringkasan (total order, revenue, stok menipis)
3. CRUD Produk (tanpa varian kompleks dulu: nama, harga, stok, gambar, kategori)
4. Kelola Pesanan (lihat, update status, cetak invoice sederhana)
5. Kelola Voucher/Promo dasar (diskon persen/nominal)

Tidak termasuk: RBAC granular, CMS drag-and-drop, multi payment gateway, loyalty point, analytics lanjutan — ini masuk Fase 5+.

---

### FASE 5 — Growth & Scale (opsional, jauh ke depan)
**Tujuan:** Fitur lanjutan sesuai visi penuh di dokumen awal, dikerjakan HANYA setelah Fase 0-4 stabil dan sudah ada transaksi nyata.

Kandidat fitur (diprioritaskan ulang nanti berdasarkan kebutuhan real):
- CMS/Homepage builder drag-and-drop
- RBAC admin granular (role: gudang, marketing, CS)
- Multi payment gateway
- Loyalty point & program membership
- Laporan & analitik lanjutan
- Bundle promo, flash sale otomatis terjadwal
- Migrasi backend ke Laravel (jika memang dibutuhkan skala besar)

---

## 5. ATURAN KERJA UNTUK CLAUDE CODE

1. **Selalu mulai dari `/spec`** untuk setiap sub-fase baru — jangan langsung `/build`.
2. **Jangan gunakan `/build auto`** kecuali sudah terbiasa dan spec sudah benar-benar matang.
3. **Satu task = satu commit.** Jangan gabungkan banyak perubahan besar dalam satu commit.
4. **Tidak menambah library/dependency baru** di luar yang tercantum di stack tanpa alasan yang dijelaskan dan disetujui dulu.
5. **Ikuti design tokens di atas secara konsisten** — dilarang hardcode warna/font baru di komponen manapun.
6. **Setelah tiap sub-fase selesai:** jalankan `/test` lalu `/review` sebelum lanjut ke sub-fase berikutnya.
7. **Data produk di Fase 1 pakai seed/dummy data** — jangan tunggu admin panel (Fase 4) untuk mulai membangun UI.
8. **Jika ada ambiguitas** antara dokumen ini dan permintaan prompt sesaat, dokumen blueprint ini yang jadi acuan utama.

---

## 7. BACKLOG (teridentifikasi, belum masuk fase manapun)

> Item di bawah ini SUDAH diketahui perlu dikerjakan, tapi sengaja belum dijadwalkan ke fase tertentu. Jangan dianggap "tidak penting" — review ulang daftar ini setiap akan mulai fase baru, pindahkan ke fase yang sesuai kalau relevan.

- **Rate limiting** untuk endpoint sensitif: login (admin & customer), `POST /license/verify`, checkout — cegah brute-force/abuse. Kandidat: Fase 2 (bersamaan dengan auth customer).
- **Reset password** untuk seller/admin — penting karena instance self-hosted, kalau lupa password klien bisa terkunci total dari toko sendiri tanpa jalan keluar mudah. Kandidat: Fase 0.5 atau Fase 4.
- **Keamanan admin panel Server Lisensi** (tempat Anda generate key) — belum dispesifikasi auth/proteksinya sendiri, padahal ini titik kritis (kalau bocor, siapa saja bisa generate lisensi palsu).
- **Redis** — baru ditambahkan ke stack kalau ada kebutuhan konkret yang muncul saat implementasi (misal ternyata rate-limiting atau session store butuh itu), bukan dipasang di awal tanpa tujuan jelas.
- **Kebijakan jangka panjang Server Lisensi**: karena model bisnis "jual sekali" tidak selalu punya recurring revenue untuk membiayai server lisensi selamanya, perlu dipikirkan kebijakan kalau suatu saat Anda berhenti maintain server itu (misal: fallback ke "grace mode permanen" agar klien lama tidak terkunci total).

---

## 8. CATATAN TAMBAHAN

- Dokumen fitur admin lengkap (dari GPT) tetap disimpan sebagai referensi visi jangka panjang — lihat Fase 5.
- Desain visual (14 screen + desktop) adalah referensi UI/UX, bukan asset final — belum ada Figma/foto produk asli, jadi styling harus direplikasi manual mengikuti deskripsi di dokumen ini (warna, tipografi, layout, komponen).
- Review blueprint ini ulang setiap selesai satu fase besar — sesuaikan jika ada perubahan prioritas bisnis.
