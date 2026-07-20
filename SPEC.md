# SPEC — Fase 0: Fondasi Project & Design System
## GHEVERHAN E-Commerce

> Diturunkan persis dari `SPEC_FASE_0.md` (sumber acuan tunggal). Spec ini tidak menambah scope apapun di luar dokumen tersebut.

---

## 1. Objective

Menyiapkan fondasi teknis project sebelum halaman/fitur apapun dibangun: struktur project Next.js, design system sesuai referensi visual GHEVERHAN, dan koneksi database awal. Fase ini adalah dasar yang harus solid karena semua fase berikutnya (0.5, 0.6, 1, 2, 3, 4, 5) bergantung padanya.

Tidak ada UI halaman, tidak ada auth, tidak ada integrasi payment/shipping di fase ini — murni fondasi.

---

## 2. Commands

| Perintah | Tujuan |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Jalankan dev server, harus tanpa error di localhost |
| `npm run lint` | Jalankan ESLint |
| `npx prettier --check .` | Cek formatting Prettier |
| `npx prisma migrate dev` | Jalankan migration awal ke database, harus tanpa error |
| `npx prisma studio` (opsional) | Verifikasi visual isi database saat development |

Tidak ada command test otomatis di fase ini — lihat bagian **Testing Strategy** di bawah untuk alasannya.

---

## 3. Project Structure

Feature-based + layered (`Route/API → Service → Repository → Database`), persis sesuai diagram di `SPEC_FASE_0.md`:

```
/app
  /(customer)              → route pages customer-facing (kosong/placeholder di Fase 0)
  /(admin)                 → route pages admin (kosong/placeholder, isi di Fase 4+)
  /api
    /products/route.ts     → handler tipis: validasi + panggil service
    /orders/route.ts       → placeholder (belum ada logic, Fase 2+)
    /payment/route.ts      → placeholder (belum ada logic, Fase 2+)

/modules
  /product
    /components/
    /services/
      productService.ts
    /repository/
      productRepository.ts → SATU-SATUNYA lapisan yang query ke Prisma untuk modul ini
    /schema.ts              → Zod schema
    /types.ts
  /order
    /components/
    /services/
    /repository/
    /schema.ts
    /types.ts
  /payment
    /services/
      tripayService.ts      → placeholder kosong (implementasi Fase 2)

/components
  /ui                      → Button, Container, Typography — generic, TANPA business logic
  /layout                  → Header, BottomNav, Footer (placeholder, isi di Fase 1)

/lib
  /prisma.ts               → koneksi database (Prisma client singleton)
  /config.ts               → SEMUA env var dibaca di sini, tidak tersebar
  /integrations/
    tripay.ts               → placeholder kosong
    jne.ts                  → placeholder kosong

prisma/
  schema.prisma
```

**Aturan modular wajib:**
1. API route **tidak boleh** berisi logic bisnis — hanya validasi Zod lalu panggil service.
2. Hanya `repository` yang boleh memanggil Prisma langsung.
3. Satu modul **tidak boleh** import langsung dari internal modul lain.
4. Semua panggilan API eksternal wajib dibungkus di `/lib/integrations/` (di fase ini baru placeholder kosong).
5. Zod schema yang sama dipakai FE & BE.

---

## 4. Code Style / Design System

- **Font**: Playfair Display (heading) + Inter (body), via `next/font`, didaftarkan sebagai Tailwind theme token — tidak boleh hardcode font-family di komponen.
- **Warna**: `primary: #000000`, `background: #FFFFFF` di `tailwind.config` sebagai theme token (`bg-primary`, `text-primary`, dst), plus gray-scale turunan 50–900. Dilarang hardcode hex di komponen manapun.
- **Icon**: Lucide React (outline style) sebagai satu-satunya icon library.
- **Komponen dasar** (`/components/ui`, generic — tanpa business logic):
  - `Button` — variant: `primary`, `secondary`, `outline`
  - `Container` — wrapper max-width + padding responsif
  - `Typography` — heading/body wrapper yang otomatis pakai font token
- **Config terpusat**: semua `process.env` dibaca lewat `/lib/config.ts`, dilarang panggil `process.env` langsung di file lain.
- **Skema Prisma awal** (field-field ini WAJIB ada, boleh diperluas di fase berikutnya, tidak boleh dikurangi):
  - `User` (email, name, password nullable — field disiapkan tapi hashing/NextAuth BELUM disetup di sini, itu Fase 0.5)
  - `Category`
  - `Product` + `ProductImage`
  - `ApiSetting` (skema saja, data diisi Fase 0.6)
  - `InstanceSetup` (singleton — hanya 1 baris, dicegah di level service; field `encryptedDataKey` terkait `MASTER_SECRET`)
- ESLint + Prettier standar, tidak boleh saling konflik.

---

## 5. Testing Strategy

Fase 0 **tidak menambah dependency test framework baru** (sesuai Boundaries — tidak nambah lib di luar Next.js/Tailwind/Prisma/Lucide React tanpa alasan & persetujuan). Verifikasi dilakukan manual lewat Acceptance Criteria di bawah:
- Menjalankan command (`npm run dev`, `npx prisma migrate dev`) dan mengonfirmasi tidak ada error.
- Satu halaman test sederhana untuk verifikasi font.
- Satu query test (fetch semua `Category`) untuk verifikasi koneksi database & alur `/api/products → productService → productRepository → Prisma`.

Kalau nanti dibutuhkan test framework otomatis (Jest/Vitest), itu keputusan terpisah yang harus diajukan & disetujui dulu — bukan default di Fase 0.

---

## 6. Boundaries

**Selalu lakukan:**
- Ikuti struktur folder & aturan layered/modular persis seperti di atas
- Baca semua env var lewat `/lib/config.ts`
- Satu task = satu commit, pesan commit jelas
- Pakai hanya token warna/font yang sudah ditentukan

**Tanya dulu sebelum lakukan:**
- Menambah dependency/library baru di luar Next.js, Tailwind, Prisma, Lucide React
- Mengubah/menambah field di skema Prisma di luar 6 model yang sudah didefinisikan
- Keputusan provider PostgreSQL (Supabase vs Railway) — **lihat Open Question di bawah**
- Keputusan package manager kalau bukan npm

**Jangan pernah lakukan (Out of Scope Fase 0):**
- Membangun UI halaman spesifik apapun (homepage, category, product card, hero carousel, dll) — itu Fase 1
- Setup NextAuth atau logic hashing password — itu Fase 0.5 (Fase 0 cukup siapkan field `password` di model `User`)
- Install/integrasi SDK Tripay, JNE, atau J&T
- Seed data produk lebih dari 2-3 baris sekadar verifikasi koneksi DB
- Ubah skema warna/font di luar yang tercantum di design tokens

---

## Acceptance Criteria (checklist, disalin persis dari SPEC_FASE_0.md)

- [x] `npm run dev` berjalan tanpa error di localhost
- [x] Font Playfair Display muncul di heading, Inter di body (terverifikasi lewat 1 halaman test sederhana)
- [x] Warna `primary` (#000000) dan `background` (#FFFFFF) terdaftar sebagai Tailwind theme token, bisa dipanggil via `bg-primary` / `text-primary`
- [x] Komponen `Button`, `Container`, `Typography` sudah dibuat dan bisa di-import dari `/components/ui`
- [x] `npx prisma migrate dev` berhasil tanpa error
- [x] Koneksi database terverifikasi (query test: fetch semua `Category`, meski masih kosong)
- [x] Struktur folder sesuai arsitektur modular (`/modules/product`, `/modules/order`, `/modules/payment` sudah dibuat, minimal dengan folder `components/services/repository` kosong/placeholder untuk product)
- [x] Contoh 1 alur lengkap terbukti jalan: `/api/products` → `productService` → `productRepository` → Prisma → database
- [x] `/lib/config.ts` sudah membaca env var database, tidak ada `process.env` dipanggil langsung di file lain
- [x] ESLint & Prettier jalan tanpa konflik konfigurasi

## Definition of Done

Semua Acceptance Criteria tercentang, project bisa di-`git clone` ulang oleh orang lain dan langsung jalan dengan `npm install && npm run dev` (setelah isi `.env`), dan sudah di-commit dengan pesan jelas per task.

**Status: TERPENUHI.** Diverifikasi lewat clean-clone test (`git clone` ke folder terpisah, isi `.env`, `npm install && npm run dev`) — sempat ditemukan 1 gap (`prisma generate` tidak otomatis jalan setelah `npm install`, menyebabkan `/api/products` 500), sudah diperbaiki lewat `postinstall` script (commit `1cd6c95`) dan re-verifikasi ulang dari clone baru: semua route (`/`, `/design-system-test`, `/api/products`) merespons 200 tanpa langkah manual tambahan.

---

## Decisions (dikonfirmasi user, menggantikan Open Question)

1. **Provider PostgreSQL**: Supabase.
2. **Package manager**: npm.
