# ROADMAP & JADWAL HARIAN — GHEVERHAN
## Estimasi Waktu Pengerjaan (Paket Claude Pro)

> Catatan penting: ini ESTIMASI, bukan janji pasti. Kecepatan aktual tergantung seberapa lancar Anda mengikuti alur `/spec → /plan → /build`, seberapa sering ada bug tak terduga, dan seberapa detail Anda mereview tiap task. Anggap ini peta jalan, bukan deadline kaku.

---

## 1. ASUMSI DASAR

- Dikerjakan **solo**, tingkat pemula-menengah (sudah pernah bikin web app + API)
- Paket **Claude Pro** (limit sesi ~5 jam rolling + limit mingguan)
- Target: fitur **Must Have + Should Have** dari PRD (bukan Could Have/Fase 5) sudah live dan bisa transaksi nyata
- Pola kerja: `/spec → /plan → /build` bertahap per task (BUKAN `/build auto`)
- 1 "sesi" = 1 blok waktu fokus mengerjakan Claude Code

---

## 2. KENAPA SESI DIBATASI 2-2.5 JAM (BUKAN 5 JAM PENUH)

Paket Pro punya limit **rolling 5 jam** + limit **mingguan** yang dibagi bersama chat, Claude Code, dan Cowork. Kalau Anda selalu memakai sampai mentok 5 jam setiap sesi, Anda akan **menghabiskan limit mingguan dalam 2-3 hari saja**, lalu terhenti sisa minggu itu.

**Strategi yang lebih aman:** sesi lebih pendek (2-2.5 jam), tapi **konsisten tiap hari** — ini menyebar pemakaian secara merata, mengurangi risiko mentok limit di tengah kerja penting, dan juga lebih realistis secara stamina belajar untuk pemula.

---

## 3. RINCIAN PER FASE

| Fase | Isi Pekerjaan | Estimasi Sesi | Jam/Sesi | Total Jam | Hari Kerja |
|---|---|---|---|---|---|
| **Fase 0** | Setup project, design tokens, struktur modular, database awal | 3 sesi | 2,5 jam | 7,5 jam | 3 hari |
| **Fase 0.5** | Server Lisensi + Installer Wizard + NextAuth dasar | 4 sesi | 2,5 jam | 10 jam | 4 hari |
| **Fase 0.6** | Pengaturan API (Tripay & JNT) di admin | 2 sesi | 2 jam | 4 jam | 2 hari |
| **Fase 1** | 10 halaman publik (mobile+desktop): homepage, category, PLP, PDP, search, wishlist, dst | 10 sesi | 2,5 jam | 25 jam | 10 hari |
| **Fase 2** | Auth customer, cart, checkout, invoice, integrasi Tripay, payment success | 7 sesi | 3 jam | 21 jam | 7 hari |
| **Fase 3** | Order tracking, integrasi JNE/J&T | 3 sesi | 2,5 jam | 7,5 jam | 3 hari |
| **Fase 4** | Admin panel dasar (dashboard, kelola produk, kelola pesanan) | 5 sesi | 3 jam | 15 jam | 5 hari |
| **Testing & Deploy** | Review menyeluruh, fix bug, deploy ke hosting, testing end-to-end | 3 sesi | 2,5 jam | 7,5 jam | 3 hari |
| **TOTAL** | | **37 sesi** | | **~97,5 jam** | **~37 hari kerja** |

> Fase 5 (Could Have: CMS builder, loyalty point, multi payment gateway, dst) **sengaja tidak dihitung** di sini — itu pengembangan pasca-live, bukan syarat untuk go-live pertama kali.

---

## 4. JADWAL MINGGUAN (SARAN POLA KERJA)

Dengan pola **1 sesi/hari, 5 hari kerja/minggu** (istirahat weekend agar tidak burnout dan limit mingguan sempat "reset"):

| Minggu | Fase yang Dikerjakan |
|---|---|
| 1 | Fase 0 (selesai) → mulai Fase 0.5 |
| 2 | Fase 0.5 (selesai) → Fase 0.6 (selesai) → mulai Fase 1 |
| 3 | Fase 1 (lanjut) |
| 4 | Fase 1 (selesai) → mulai Fase 2 |
| 5 | Fase 2 (lanjut) |
| 6 | Fase 2 (selesai) → mulai Fase 3 |
| 7 | Fase 3 (selesai) → mulai Fase 4 |
| 8 | Fase 4 (selesai) → Testing & Deploy |

**Estimasi total: ± 8 minggu (2 bulan) kerja part-time konsisten**, dengan asumsi tidak ada hambatan besar (tidak kena limit, tidak stuck bug berhari-hari, requirement tidak berubah drastis di tengah jalan).

---

## 5. VERSI LEBIH SANTAI (kalau 1 sesi/hari terasa berat)

Kalau Anda punya pekerjaan/kesibukan lain dan hanya bisa 3 hari/minggu:

| Pola | Estimasi Durasi Total |
|---|---|
| 5 hari/minggu, 1 sesi/hari | ± 8 minggu |
| 3 hari/minggu, 1 sesi/hari | ± 13 minggu (± 3 bulan) |
| 5 hari/minggu, 2 sesi/hari (pagi+sore, total ±5 jam/hari) | ± 4-5 minggu (RISIKO lebih tinggi kena limit mingguan) |

**Rekomendasi untuk pemula dengan budget Pro:** pola **5 hari/minggu, 1 sesi/hari** — paling seimbang antara progres dan risiko limit.

---

## 6. TIPS AGAR TIDAK MUDAH KENA LIMIT

1. **Selalu mulai sesi dengan konteks singkat**, bukan re-paste seluruh dokumen tiap kali (pakai Graphify setelah Fase 1, biar Claude Code query graph, bukan re-baca semua file).
2. **Satu sesi = satu atau dua task kecil**, jangan paksa selesaikan satu fase penuh dalam satu sesi panjang.
3. **Hindari `/build auto`** — selain lebih aman diawasi, task kecil juga lebih hemat karena tidak ada kerja berulang kalau ada yang salah arah.
4. **Tutup sesi dengan bersih**: minta Claude Code rangkum apa yang sudah dikerjakan sebelum keluar, supaya sesi berikutnya tidak perlu re-explain dari nol.
5. **Jalankan `/usage` secara berkala** di Claude Code untuk pantau sisa kuota, sesuaikan ritme kalau ternyata boros dari perkiraan.
6. **Kalau ketemu bug rumit yang menyita banyak percakapan bolak-balik**, lebih baik berhenti, riset manual dulu (baca error, cari di dokumentasi), baru lanjut sesi berikutnya dengan pertanyaan lebih presisi — debugging panjang tanpa arah adalah salah satu penyebab boros kuota paling umum.

---

## 7. TRACKER HARIAN (isi manual seiring progres)

| Tanggal | Fase | Task Dikerjakan | Selesai? | Catatan |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

> Salin ulang tabel ini tiap minggu, atau ubah jadi spreadsheet kalau lebih nyaman dipakai.
