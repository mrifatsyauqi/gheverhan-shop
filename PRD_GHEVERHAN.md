# PRD — GHEVERHAN
## Premium Fashion E-Commerce Template (Single Seller, Self-Hosted)

> Dokumen ini melengkapi `BLUEPRINT.md` (teknis) dengan sudut pandang produk & bisnis. Kalau ada ketidaksesuaian detail teknis, `BLUEPRINT.md` yang jadi acuan; kalau ada ketidaksesuaian soal prioritas/tujuan bisnis, dokumen ini yang jadi acuan.

---

## 1. LATAR BELAKANG & MASALAH

Pemilik bisnis fashion skala kecil-menengah butuh toko online sendiri (single-seller) yang terlihat premium, tapi:
- Solusi SaaS (Shopify, dll) punya biaya bulanan berkelanjutan dan batasan kustomisasi
- Bikin dari nol butuh developer & waktu lama
- Template generik di pasaran terlihat "template-ish", tidak premium

**Solusi:** Template e-commerce siap pakai, desain premium mobile-first, yang bisa dibeli sekali dan di-self-host oleh klien, dengan proses instalasi semudah mungkin (installer wizard).

---

## 2. TARGET PENGGUNA (2 LAPIS)

### Persona A — Pembeli Template ("Klien")
- Pemilik brand fashion kecil-menengah, mungkin tidak terlalu teknis
- Butuh toko online sendiri tapi tidak mau bayar SaaS bulanan mahal
- Punya akses hosting/domain sendiri, tapi berharap instalasi semudah mungkin (mirip install WordPress)

### Persona B — Pembeli di Toko Klien ("End Customer")
- Konsumen yang belanja fashion online lewat toko hasil instalasi Klien
- Mengharapkan pengalaman belanja mobile-first yang cepat dan meyakinkan (trust signal: metode bayar jelas, tracking pesanan, dst)

---

## 3. TUJUAN & METRIK SUKSES

| Tujuan | Metrik |
|---|---|
| Instalasi mudah untuk klien non-teknis | Installer wizard selesai < 10 menit tanpa bantuan developer |
| Desain terasa premium, bukan generik | Feedback kualitatif dari klien awal / user testing |
| Toko klien bisa transaksi nyata | Checkout → pembayaran Tripay → order tersimpan, end-to-end tanpa error |
| Proteksi bisnis dari pembajakan | Sistem lisensi aktif & domain-lock berfungsi, meski disadari tidak 100% anti-bajak |
| Mudah dikembangkan jangka panjang | Fitur baru bisa ditambah per modul tanpa mengubah modul lain (lihat prinsip modular di BLUEPRINT.md) |

---

## 4. PRIORITAS FITUR (MoSCoW)

### Must Have (wajib ada sebelum bisa dijual/dipakai)
- Installer Wizard + Registrasi Seller
- Sistem lisensi + domain-lock dasar
- Katalog produk, cart, checkout, 1 payment gateway (Tripay)
- Order dasar (pending → paid → shipped → selesai)
- Admin panel dasar: kelola produk, kelola pesanan
- Pengaturan API (Tripay/JNT) lewat UI, bukan hardcode
- Desain sesuai referensi visual GHEVERHAN (14+4 screen)

### Should Have (penting, tapi toko tetap bisa jalan tanpanya di awal)
- Integrasi ongkir otomatis (JNT/JNE API)
- Order tracking detail
- Wishlist, search
- Voucher/promo dasar

### Could Have (nilai tambah, dikerjakan kalau waktu/budget memungkinkan)
- CMS/homepage builder drag-and-drop
- Multi payment gateway
- Loyalty point
- Analitik lanjutan
- RBAC admin granular (role gudang, marketing, CS)

### Won't Have (di luar scope produk ini, sengaja tidak dikerjakan)
- Multi-seller/marketplace dalam satu instance (produk ini SATU seller per instance)
- Native mobile app (fokus web app mobile-first)
- SaaS hosting oleh Anda untuk klien (klien self-host sendiri)

---

## 5. USER STORIES UTAMA

**Klien (Persona A):**
- Sebagai klien, saya ingin memasukkan license key saat instalasi, supaya toko saya teraktivasi resmi.
- Sebagai klien, saya ingin membuat akun admin/seller saya sendiri saat wizard, supaya saya langsung bisa kelola toko setelah instalasi selesai.
- Sebagai klien, saya ingin mengatur API key Tripay & JNT lewat dashboard, supaya saya tidak perlu edit kode/file server.

**End Customer (Persona B):**
- Sebagai pembeli, saya ingin melihat katalog produk dengan tampilan premium di HP saya, supaya saya percaya ini toko yang kredibel.
- Sebagai pembeli, saya ingin checkout dan bayar dengan metode yang familiar (transfer, e-wallet, QRIS), supaya saya nyaman bertransaksi.
- Sebagai pembeli, saya ingin melihat rincian pesanan dan instruksi pembayaran yang jelas setelah checkout (bukan cuma "terima kasih"), supaya saya tahu persis apa yang harus saya bayar dan bagaimana caranya, terutama untuk metode transfer/VA yang belum langsung terbayar.
- Sebagai pembeli, saya ingin melacak status pesanan saya, supaya saya tahu kapan barang sampai.

---

## 6. NON-FUNCTIONAL REQUIREMENTS
(detail teknis lengkap ada di BLUEPRINT.md, ini ringkasan dari sudut pandang produk)

- **Keamanan:** password ter-hash, kredensial API terenkripsi, webhook payment terverifikasi
- **Skalabilitas:** arsitektur modular, siap menampung ribuan order tanpa redesain besar
- **Portabilitas hosting:** tidak terkunci ke satu platform hosting (VPS, Netlify, Vercel, Railway, dst semua harus bisa)
- **Maintainability:** developer lain (bukan cuma Anda) harus bisa memahami & extend kode dalam waktu wajar berkat struktur modular

---

## 7. BAGAN STRUKTUR PRODUK

### 7.1 Struktur Fitur (Feature Tree)

```
GHEVERHAN
│
├── INSTALLER & LISENSI
│   ├── Installer Wizard (setup DB, aktivasi lisensi, registrasi seller)
│   └── Sistem Lisensi (server terpisah + domain-lock + phone-home)
│
├── CUSTOMER-FACING (Publik)
│   ├── Homepage (hero carousel, flash sale, category grid)
│   ├── Category & Product List
│   ├── Product Detail
│   ├── Search
│   ├── Wishlist
│   ├── Cart → Checkout → Invoice/Instruksi Bayar → Payment Success
│   ├── Order Tracking
│   ├── Auth Customer (register, login)
│   └── Bottom Nav (mobile, urutan tetap: Home, Shop, Keranjang, Profil)
│
├── ADMIN PANEL (Seller)
│   ├── Dashboard Ringkasan
│   ├── Kelola Produk
│   ├── Kelola Pesanan
│   ├── Kelola Promo/Voucher          [Should/Could Have]
│   ├── Pengaturan API (Tripay & JNT)
│   ├── Kelola User/Role              [Could Have]
│   ├── CMS/Customize Website         [Could Have]
│   └── Laporan & Analitik            [Could Have]
│
└── INTEGRASI EKSTERNAL
    ├── Tripay (Payment Gateway)
    └── JNE / J&T Express (Shipping)
```

### 7.2 Struktur Sistem (High-Level Architecture)

```
                    ┌─────────────────────────┐
                    │   SERVER LISENSI         │
                    │   (dikontrol Anda)        │
                    │   - Generate license key   │
                    │   - Validasi domain        │
                    └────────────┬──────────────┘
                                 │ phone-home berkala
                                 │ (verify domain & status)
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                         │
┌───────▼────────┐      ┌────────▼────────┐      ┌─────────▼───────┐
│ INSTANCE KLIEN A │      │ INSTANCE KLIEN B │      │ INSTANCE KLIEN C │
│ domain-a.com     │      │ domain-b.com     │      │ domain-c.com     │
│                  │      │                  │      │                  │
│ Next.js App      │      │ Next.js App      │      │ Next.js App      │
│  ├─ Customer UI  │      │  ├─ Customer UI  │      │  ├─ Customer UI  │
│  ├─ Admin Panel  │      │  ├─ Admin Panel  │      │  ├─ Admin Panel  │
│  └─ /modules/*   │      │  └─ /modules/*   │      │  └─ /modules/*   │
│                  │      │                  │      │                  │
│ PostgreSQL (sendiri, terpisah per klien)           │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                        │                         │
        ▼                        ▼                         ▼
   Tripay + JNT              Tripay + JNT              Tripay + JNT
   (kredensial masing-masing klien sendiri, diatur lewat dashboard)
```

### 7.3 Struktur Alur Data per Modul (Layered, ringkas dari BLUEPRINT.md)

```
Request masuk
   │
   ▼
API Route  (validasi input via Zod)
   │
   ▼
Service    (logic bisnis)
   │
   ▼
Repository (satu-satunya yang bicara ke Prisma)
   │
   ▼
Database
```

---

## 8. ASUMSI & KETERBATASAN

- Klien punya akses minimal ke hosting yang mendukung Node.js (atau serverless yang kompatibel — lihat catatan `MASTER_SECRET` di BLUEPRINT.md)
- Sistem lisensi TIDAK menjamin 100% anti-pembajakan (lihat catatan realitas di BLUEPRINT.md) — tujuannya deterrent, bukan proteksi mutlak
- Setiap instance = 1 seller. Kalau di masa depan dibutuhkan multi-seller/marketplace, itu adalah **produk lain**, bukan ekstensi dari GHEVERHAN versi ini

---

## 9. REFERENSI SILANG

- Detail teknis & urutan implementasi → `BLUEPRINT.md`
- Spec teknis per fase → `SPEC_FASE_0.md`, dst
- Referensi visual → 14 screen mobile + 4 desktop GHEVERHAN (lampiran gambar)
