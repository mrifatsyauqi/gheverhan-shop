# SPRINT 28 HARI — GHEVERHAN
## Target: Full Scope (Fase 0 - Fase 4 + Deploy) Live dalam 28 Hari

> ⚠️ **Peringatan realistis:** Rencana ini memakai 7 hari/minggu (TANPA libur) dengan ~3,5 jam kerja aktif/hari. Ini padat, hampir tidak ada ruang untuk hambatan besar (bug rumit, kena limit berkepanjangan, kesibukan mendadak). Anda sudah memilih menerima risiko ini — dokumen ini membantu Anda **melacak slippage** kalau progres mundur, bukan menjanjikan 28 hari pasti tercapai.

---

## 1. KALENDER HARIAN

| Hari | Fase | Fokus Kerja | Target Jam |
|---|---|---|---|
| 1 | Fase 0 | Init project, Tailwind, design tokens, font | 3,5 jam |
| 2 | Fase 0 | Struktur folder modular, Prisma + skema awal, migration | 3,5 jam |
| 3 | Fase 0.5 | Server Lisensi (model, endpoint activate/verify) | 3,5 jam |
| 4 | Fase 0.5 | Middleware validasi lisensi + normalisasi domain | 3,5 jam |
| 5 | Fase 0.5 | NextAuth dasar (admin) + hashing password | 3,5 jam |
| 6 | Fase 0.5 | Installer Wizard (6 step lengkap) + testing alur | 3,5 jam |
| 7 | Fase 0.6 | Model ApiSetting + enkripsi AES + form Tripay | 3,5 jam |
| 8 | Fase 0.6 | Form JNT + toggle sandbox/production + test koneksi | 3,5 jam |
| 9 | Fase 1 | Layout global (header, bottom nav, footer) | 3,5 jam |
| 10 | Fase 1 | Splash Screen + Homepage (hero, flash sale) | 3,5 jam |
| 11 | Fase 1 | Homepage lanjut (category grid) + Category Page | 3,5 jam |
| 12 | Fase 1 | Product List (PLP) — filter, sort, grid | 3,5 jam |
| 13 | Fase 1 | Product Detail (PDP) — galeri, varian | 3,5 jam |
| 14 | Fase 1 | Search + Wishlist | 3,5 jam |
| 15 | Fase 1 | 404 + Responsive desktop (review semua halaman) | 3,5 jam |
| 16 | Fase 2 | Auth customer (register + verifikasi email, login) | 3,5 jam |
| 17 | Fase 2 | Cart (tambah/hapus/update qty, subtotal) | 3,5 jam |
| 18 | Fase 2 | Checkout (alamat, metode kirim, row lock stok) | 3,5 jam |
| 19 | Fase 2 | Integrasi Tripay (sandbox) — generate transaksi | 3,5 jam |
| 20 | Fase 2 | Invoice/Instruksi Pembayaran page | 3,5 jam |
| 21 | Fase 2 | Webhook Tripay (signature + idempotent) + Payment Success | 3,5 jam |
| 22 | Fase 2 | Testing end-to-end alur checkout penuh | 3,5 jam |
| 23 | Fase 3 | Order Tracking page + integrasi JNE/J&T (ongkir) | 3,5 jam |
| 24 | Fase 3 | JNE/J&T lanjut (generate resi) + testing | 3,5 jam |
| 25 | Fase 4 | Admin: Dashboard ringkasan + Kelola Produk | 3,5 jam |
| 26 | Fase 4 | Admin: Kelola Pesanan + update status order | 3,5 jam |
| 27 | Fase 4 | Testing menyeluruh + fix bug + review keamanan | 3,5 jam |
| 28 | Deploy | Deploy ke hosting, setup domain, testing live, **buffer** | 3,5 jam |

**Total: 28 hari × 3,5 jam ≈ 98 jam** — sesuai estimasi total kerja awal.

---

## 2. ATURAN MAIN SELAMA SPRINT

1. **Cek `/usage` di Claude Code SETIAP PAGI** sebelum mulai kerja — supaya tahu sisa kuota minggu itu di awal, bukan kaget di tengah hari.
2. **Kalau kena limit di tengah hari:** JANGAN paksa lanjut. Gunakan sisa waktu hari itu untuk kerja yang tidak butuh Claude Code — baca error log manual, test manual di browser, susun catatan task besok, atau review kode yang sudah jadi. Lanjutkan begitu kuota reset.
3. **Setiap hari kena limit/gagal capai target = catat di tabel slippage** (bagian 3) — geser rencana hari berikutnya, jangan coba "kejar ganda" besoknya (ini biasanya bikin makin cepat kena limit lagi).
4. **Satu task = satu commit**, tetap patuhi ini meski dikejar waktu — kalau ada yang salah di tengah sprint, jauh lebih cepat di-rollback per task daripada bongkar satu commit besar.
5. **Jangan skip testing di hari 22 dan 27** — dua hari ini sengaja dikhususkan untuk nemuin bug SEBELUM live, bukan sesudah. Skip ini kemungkinan besar bikin masalah lebih besar pasca-launch.
6. **Hari 28 adalah buffer, bukan cuma "deploy santai"** — kalau sampai hari 27 masih ada tunggakan dari hari-hari sebelumnya, hari 28 dipakai untuk itu dulu, deploy bisa mundur.

---

## 3. TABEL SLIPPAGE (isi manual selama sprint)

| Hari Rencana | Tanggal Aktual | Selesai Sesuai Target? | Alasan Kalau Meleset | Hari Baru (kalau geser) |
|---|---|---|---|---|
| | | | | |
| | | | | |

> Kalau tabel ini mulai terisi banyak baris "meleset", itu sinyal jujur untuk mempertimbangkan opsi B (upgrade Max sementara) atau opsi A (pangkas scope) dari percakapan sebelumnya — jangan dipaksakan terus kalau memang tidak realistis di lapangan.

---

## 4. REFERENSI SILANG
Detail teknis tiap fase → `BLUEPRINT.md`, `SPEC_FASE_0.md`, dst.
Estimasi versi lebih santai (8 minggu) → `ROADMAP_HARIAN.md`.
