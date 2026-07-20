# SPEC: Fase 0 — Fondasi Project & Design System
## GHEVERHAN E-Commerce

> Acuan: lihat BLUEPRINT.md untuk konteks lengkap proyek. Spec ini HANYA mencakup Fase 0.

---

## Objective
Menyiapkan fondasi teknis project sebelum halaman/fitur apapun dibangun: struktur project Next.js, design system sesuai referensi visual GHEVERHAN, dan koneksi database awal. Fase ini adalah dasar yang harus solid karena semua fase berikutnya bergantung padanya.

## Scope

**1. Inisialisasi Project**
- Next.js (App Router) + TypeScript
- Tailwind CSS
- ESLint + Prettier dengan konfigurasi standar

**2. Design System**
- Setup font: Playfair Display (heading) via `next/font`, Inter (body) via `next/font`
- Setup warna di `tailwind.config` sebagai theme token, bukan hardcode hex:
  - `primary: #000000`
  - `background: #FFFFFF`
  - Tambahkan gray-scale turunan (50-900) untuk border, disabled state, teks sekunder
- Setup Lucide React sebagai icon library
- Buat komponen dasar reusable di `/components/ui`:
  - `Button` (variant: primary, secondary, outline)
  - `Container` (wrapper max-width + padding responsif)
  - `Typography` (heading/body wrapper yang otomatis pakai font token)

**3. Struktur Folder (Modular, Feature-Based, Layered)**

Prinsip: dikelompokkan per domain/fitur (bukan per jenis file), dengan pemisahan tanggung jawab yang jelas: `Route/API → Service → Repository → Database`. Tujuannya agar setiap modul bisa dikembangkan, diuji, dan (bila perlu) dimigrasikan secara independen tanpa mengganggu modul lain.

```
/app
  /(customer)              → route pages customer-facing
  /(admin)                 → route pages admin (Fase 4+)
  /api
    /products/route.ts     → handler tipis: validasi + panggil service
    /orders/route.ts
    /payment/route.ts

/modules                   → domain logic, dikelompokkan per fitur
  /product
    /components/           → ProductCard, ProductGallery (spesifik fitur ini)
    /services/
      productService.ts    → logic bisnis (cth: cek stok, hitung diskon)
    /repository/
      productRepository.ts → SATU-SATUNYA lapisan yang query ke Prisma
    /schema.ts              → validasi input pakai Zod
    /types.ts
  /order
    /components/
    /services/
    /repository/
    /schema.ts
    /types.ts
  /payment
    /services/
      tripayService.ts

/components
  /ui                      → Button, Input, Modal — generic, TANPA business logic
  /layout                  → Header, BottomNav, Footer

/lib
  /prisma.ts               → koneksi database
  /config.ts               → SEMUA env var dibaca di sini, tidak tersebar
  /integrations/            → wrapper API eksternal (Tripay, JNE/J&T)
    tripay.ts
    jne.ts

prisma/
  schema.prisma
```

**Aturan modular yang wajib diikuti Claude Code:**
1. API route **tidak boleh** berisi logic bisnis — hanya validasi input (via schema Zod) lalu panggil service.
2. Hanya `repository` yang boleh memanggil Prisma langsung. Service tidak boleh query database sendiri.
3. Satu modul **tidak boleh** import langsung dari internal modul lain (misal `order` import folder internal `product`) — kalau butuh data lintas modul, lewat pemanggilan service, bukan akses langsung ke repository modul lain.
4. Semua panggilan ke API eksternal (Tripay, JNE/J&T) **wajib** dibungkus di `/lib/integrations/`, tidak dipanggil langsung dari service — supaya mudah di-mock saat testing dan mudah diganti provider di kemudian hari.
5. Validasi input pakai Zod schema yang sama dipakai di frontend (form) maupun backend (API route) — hindari duplikasi aturan validasi.

**4. Database**
- Setup Prisma + PostgreSQL (gunakan Supabase atau Railway, pilih salah satu)
- Skema awal minimal (boleh diperluas di fase berikutnya, tapi field inti harus ada):
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?  // WAJIB di-hash pakai bcrypt sebelum disimpan, JANGAN plain text
  role      String   @default("customer") // customer | admin
  createdAt DateTime @default(now())
}

model Category {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  products  Product[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  price       Int
  stock       Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  createdAt   DateTime @default(now())
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  url       String   // URL ke storage (Cloudflare R2/S3-compatible)
  isPrimary Boolean  @default(false)
  order     Int      @default(0)
}

model ApiSetting {
  id              String   @id @default(cuid())
  provider        String   @unique // "tripay" | "jnt" | "jne"
  encryptedConfig String   // JSON kredensial terenkripsi AES-256, diisi di Fase 0.6
  isActive        Boolean  @default(false)
  updatedAt       DateTime @updatedAt
}

model InstanceSetup {
  id                String    @id @default(cuid())
  isInstalled       Boolean   @default(false)
  licenseKey        String?
  licenseStatus     String?   // active | suspended | expired | unverified
  lastCheckIn       DateTime?
  encryptedDataKey  String?   // ENCRYPTION_KEY internal, dienkripsi pakai MASTER_SECRET
                               // dari env (di-set manual sekali saat deploy, BUKAN ditulis
                               // otomatis ke file — supaya kompatibel di hosting serverless)
}
```
> Catatan: `InstanceSetup` HANYA boleh berisi 1 baris (singleton) — cegah insert baris kedua di level service. `ApiSetting` baru diisi datanya di Fase 0.6, di sini cukup skemanya saja. Storage gambar produk (Cloudflare R2/S3-compatible) perlu ditentukan providernya sebelum Fase 1 dimulai. `MASTER_SECRET` adalah SATU-SATUNYA env var yang wajib di-set manual oleh developer/klien saat deploy pertama (dokumentasikan ini jelas di README instalasi) — semua secret lain diturunkan/dienkripsi dari sini, disimpan di database.
- Jalankan migration awal
- Environment variable untuk database connection string di `.env`

## Out of Scope (JANGAN dikerjakan di spec ini)
- Halaman/UI aktual apapun (homepage, category, dst) — itu Fase 1
- Setup NextAuth & hashing password — task terpisah di **Fase 0.5** (Installer Wizard membutuhkan ini duluan sebelum halaman publik dibangun). Fase 0 ini cukup siapkan model `User` dengan field yang sesuai, belum perlu install/konfigurasi NextAuth-nya
- Integrasi Tripay / JNE / J&T — Fase 2 & 3
- Seed data produk dummy — boleh disiapkan tapi bukan fokus utama, cukup 2-3 baris untuk verifikasi koneksi database jalan

## Acceptance Criteria
- [ ] `npm run dev` berjalan tanpa error di localhost
- [ ] Font Playfair Display muncul di heading, Inter di body teks (bisa diverifikasi lewat 1 halaman test sederhana)
- [ ] Warna primary (#000000) dan background (#FFFFFF) terdaftar sebagai Tailwind theme token, bisa dipanggil via class seperti `bg-primary` / `text-primary`
- [ ] Komponen `Button`, `Container`, `Typography` sudah dibuat dan bisa di-import dari `/components/ui`
- [ ] `npx prisma migrate dev` berhasil tanpa error
- [ ] Koneksi database terverifikasi (misal lewat 1 query test: fetch semua Category, meski masih kosong)
- [ ] Struktur folder sesuai arsitektur modular di atas (`/modules/product`, `/modules/order`, `/modules/payment` sudah dibuat, minimal dengan folder `components/services/repository` kosong/placeholder untuk product)
- [ ] Contoh 1 alur lengkap sudah terbukti jalan: API route `/api/products` → `productService` → `productRepository` → Prisma → database (verifikasi lewat fetch list produk, meski masih kosong)
- [ ] `/lib/config.ts` sudah membaca env var database, tidak ada `process.env` yang dipanggil langsung di file lain
- [ ] ESLint & Prettier jalan tanpa konflik konfigurasi

## Boundaries
- Jangan menambah dependency/library di luar yang disebutkan (Next.js, Tailwind, Prisma, Lucide React) tanpa menjelaskan alasannya dulu ke saya
- Jangan menulis komponen UI halaman spesifik (product card, hero carousel, dll) — itu domain Fase 1
- Jangan install SDK Tripay/JNE/J&T di fase ini
- Jangan ubah skema warna/font di luar yang tercantum di design tokens

## Definition of Done
Fase 0 dianggap selesai kalau semua Acceptance Criteria di atas tercentang, project bisa di-`git clone` ulang oleh orang lain dan langsung jalan dengan `npm install && npm run dev` (setelah isi `.env`), dan sudah di-commit dengan pesan yang jelas per task (bukan satu commit raksasa).

---

## CARA PAKAI DI CLAUDE CODE

### Persiapan
1. Taruh 3 file berikut di **root repo** Anda (folder kosong yang sudah di-`git init`):
   - `PRD_GHEVERHAN.md`
   - `BLUEPRINT.md`
   - `SPEC_FASE_0.md` (file ini)
2. Buka terminal di folder repo tersebut, jalankan `claude` untuk masuk ke Claude Code.
3. Install kedua tools pendukung berikut (opsional tapi sangat disarankan — lihat detail di bawah).

---

### A. Install `agent-skills` (Addy Osmani) — alur kerja disiplin `/spec → /plan → /build`

Di dalam sesi Claude Code, jalankan:
```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

**Cara pakai setelah terinstall:**
- `/spec [deskripsi fitur]` → Claude Code generate spesifikasi dulu sebelum coding (bisa dikombinasikan dengan spec manual di dokumen ini — jelaskan ke Claude Code untuk mengacu ke `SPEC_FASE_0.md`)
- `/plan` → pecah spec jadi task-task kecil berurutan
- `/build` → implementasi satu task, lalu berhenti untuk direview (hindari `/build auto` untuk fase fondasi seperti Fase 0)
- `/test` → jalankan/buktikan hasil kerja, bukan sekadar klaim selesai
- `/review` → review kualitas kode dari 5 aspek sebelum lanjut
- `/ship` → checklist akhir sebelum dianggap siap

**Kapan dipakai:** di setiap awal fase baru (Fase 0, 0.5, 0.6, 1, dst) — jalankan `/spec` dengan mengacu ke file spec fase terkait, baru lanjut `/plan` → `/build`.

---

### B. Install Graphify — peta pemahaman codebase untuk Claude Code

**Step 1 — install CLI-nya (di terminal, bukan di dalam sesi Claude Code):**
```bash
uv tool install graphifyy
```
Kalau belum punya `uv`:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Step 2 — daftarkan skill-nya ke Claude Code:**
```bash
graphify install
```

**Step 3 — bangun graph pertama kali (jalankan SETELAH Fase 0 selesai, bukan di project kosong):**
Di dalam sesi Claude Code:
```
/graphify .
```
Ini menghasilkan folder `graphify-out/` berisi `graph.html` (peta visual, buka di browser), `GRAPH_REPORT.md` (ringkasan konsep utama), dan `graph.json`.

**Step 4 — aktifkan mode "always-on"** supaya Claude Code otomatis konsultasi graph tanpa diminta setiap kali:
```bash
graphify claude install
```

**Step 5 — auto-update graph tiap kali commit:**
```bash
graphify hook install
```

**Step 6 — tambahkan ke `.gitignore` dan `.claudeignore`:**
```
# .gitignore
graphify-out/cost.json

# .claudeignore
graph.json
graphify-out/
```

**Cara pakai sehari-hari setelah terinstall:**
```
/graphify query "apa yang terhubung ke tripayService?"
/graphify path "checkout" "database"
/graphify explain "productRepository"
/graphify . --update     # setelah banyak perubahan kode, refresh graph
```

**Kapan dipakai:** mulai relevan sejak Fase 1 ke atas, saat jumlah modul/file sudah cukup banyak sehingga Claude Code perlu bantuan navigasi. Untuk Fase 0 (baru fondasi), belum terlalu perlu — jalankan `/graphify .` pertama kali setelah Fase 0 selesai.

---

### Urutan Eksekusi

**Step 1 — Kasih konteks penuh dulu**, copy-paste prompt ini persis:

```
Baca PRD_GHEVERHAN.md dan BLUEPRINT.md di root repo ini untuk 
memahami konteks proyek secara penuh (tujuan bisnis, arsitektur, 
dan semua fase). Jangan mulai coding dulu — konfirmasi ke saya 
kalau sudah paham strukturnya.
```

**Step 2 — Setelah Claude Code konfirmasi paham, lanjut minta eksekusi Fase 0:**

```
Sekarang baca SPEC_FASE_0.md secara detail. Ini adalah spec 
untuk Fase 0 (Fondasi Project & Design System) — HANYA kerjakan 
scope yang tertulis di sana, jangan menambah fitur di luar itu.

Ikuti aturan berikut:
1. Jalankan /plan dulu untuk memecah spec ini jadi task-task 
   kecil dan berurutan (kalau plugin agent-skills sudah terpasang). 
   Kalau tidak, buat daftar task kecil secara manual dan tampilkan 
   ke saya dulu sebelum mulai coding.
2. Kerjakan SATU task per commit — jangan gabungkan beberapa 
   perubahan besar dalam satu commit.
3. Setelah tiap task selesai, laporkan status singkat dan 
   tunggu saya bilang "lanjut" sebelum ke task berikutnya.
4. Ikuti persis "Boundaries" dan "Out of Scope" yang tertulis 
   di SPEC_FASE_0.md — jangan install dependency tambahan atau 
   menyentuh scope fase lain tanpa bertanya ke saya dulu.
5. Setelah semua task selesai, cek ulang semua item di 
   "Acceptance Criteria" satu per satu, laporkan mana yang 
   sudah dan belum terpenuhi.
```

**Step 3 — Kalau Claude Code melenceng dari spec**, gunakan prompt koreksi ini:

```
Ini di luar scope SPEC_FASE_0.md bagian [sebutkan bagian, 
misal "Out of Scope" atau "Boundaries"]. Tolong hentikan, 
kembalikan ke scope yang sesuai spec.
```

**Step 4 — Setelah Fase 0 selesai & lolos semua Acceptance Criteria:**

```
Fase 0 sudah saya review dan sesuai. Simpan ringkasan apa saja 
yang sudah dibangun di Fase 0 (untuk referensi Fase berikutnya), 
lalu berhenti dan tunggu SPEC Fase 0.5 dari saya.
```

### Tips Tambahan
- Kalau sesi Claude Code terasa "lupa" konteks di tengah jalan (biasa terjadi di sesi panjang), ulangi Step 1 sebelum lanjut.
- Jangan pakai `/build auto` untuk Fase 0 — fondasi ini sebaiknya diawasi task-per-task karena semua fase berikutnya bergantung padanya.
- Simpan riwayat commit yang rapi (`git log --oneline`) — ini juga jadi bahan review kalau nanti butuh migrasi arsitektur.
