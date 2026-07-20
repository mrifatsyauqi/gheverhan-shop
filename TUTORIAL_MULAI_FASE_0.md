# TUTORIAL LENGKAP — MULAI FASE 0
## GHEVERHAN, dari Komputer Kosong sampai Fase 0 Selesai

> Ikuti urutan ini persis dari atas ke bawah. Jangan lompat step.

---

## STEP 0 — Prasyarat (sekali saja, kalau belum ada)

Cek dulu apakah sudah terpasang, buka terminal lalu ketik:
```bash
node -v      # harus muncul versi 18 ke atas
git --version
```

Kalau belum ada:
- Node.js: download di https://nodejs.org (pilih versi LTS)
- Git: download di https://git-scm.com

Pastikan juga Claude Code sudah terpasang di komputer Anda (bukan cuma web/app biasa). Kalau belum, ikuti instruksi resmi dari Anthropic untuk install Claude Code CLI.

---

## STEP 1 — Siapkan folder project & repo GitHub

```bash
mkdir gheverhan
cd gheverhan
git init
```

Buat repo kosong baru di GitHub (lewat browser, github.com/new), JANGAN centang "Add README" (biar bersih). Lalu hubungkan:
```bash
git remote add origin https://github.com/USERNAME/gheverhan.git
```
(Ganti `USERNAME` dengan username GitHub Anda)

---

## STEP 2 — Taruh 4 dokumen yang sudah kita buat ke folder ini

Pindahkan/copy 4 file berikut ke dalam folder `gheverhan`:
- `PRD_GHEVERHAN.md`
- `BLUEPRINT.md`
- `SPEC_FASE_0.md`
- `ROADMAP_HARIAN.md` (atau `SPRINT_28_HARI.md`, sesuai yang Anda pakai)

Cek dengan:
```bash
ls
```
Pastikan ke-4 file itu muncul.

---

## STEP 3 — Install plugin `agent-skills` (Addy Osmani) — LAKUKAN SEKARANG

**Kenapa ini duluan:** Anda butuh command `/spec`, `/plan`, `/build` sejak awal Fase 0.

Masuk ke Claude Code dulu:
```bash
claude
```

Di dalam sesi Claude Code, ketik:
```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

Tunggu sampai selesai terpasang.

---

## STEP 4 — JANGAN install Graphify dulu

**Kenapa ditunda:** Graphify memetakan kode yang SUDAH ADA. Folder Anda masih kosong, jadi belum ada yang dipetakan. Kita install Graphify nanti di STEP 10 (setelah Fase 0 selesai).

---

## STEP 5 — Kasih konteks proyek ke Claude Code

Masih di dalam sesi Claude Code yang sama, copy-paste prompt ini persis:

```
Baca PRD_GHEVERHAN.md dan BLUEPRINT.md di folder ini untuk memahami 
konteks proyek secara penuh — tujuan bisnis, target user, arsitektur 
teknis, dan semua fase pengembangan. Ini project e-commerce fashion 
single-seller bernama GHEVERHAN yang akan dijual sebagai template 
ke klien (self-hosted).

Setelah selesai baca, jangan mulai coding dulu. Ringkas ke saya 
dalam beberapa poin: apa yang Anda pahami soal (1) tujuan proyek, 
(2) tech stack, (3) prinsip arsitektur modular yang harus diikuti.
```

Baca ringkasan yang diberikan Claude Code. Kalau ada yang salah paham, koreksi dulu sebelum lanjut.

---

## STEP 6 — Mulai Fase 0 dengan `/spec`

Copy-paste prompt ini:

```
Sekarang baca SPEC_FASE_0.md secara detail. Ini adalah spesifikasi 
teknis untuk Fase 0 (Fondasi Project & Design System).

Jalankan /spec dengan mengacu PERSIS ke isi SPEC_FASE_0.md ini — 
jangan menambah scope di luar yang tertulis di sana. Tampilkan hasil 
/spec ke saya untuk saya review dulu sebelum lanjut ke /plan.
```

Baca hasil `/spec`-nya. Kalau sudah sesuai isi `SPEC_FASE_0.md`, lanjut ke step berikutnya.

---

## STEP 7 — Lanjut ke `/plan`

```
Spec sudah saya setujui. Sekarang jalankan /plan untuk memecah 
spec ini jadi task-task kecil dan berurutan. Tampilkan daftar 
tasknya ke saya sebelum mulai /build.
```

---

## STEP 8 — Eksekusi `/build`, SATU TASK PER SATU

Setelah dapat daftar task dari `/plan`, jalankan build dengan prompt ini (ulangi untuk tiap task, JANGAN semua sekaligus):

```
Kerjakan task berikutnya dari /plan tadi saja (SATU task ini saja, 
jangan lanjut ke task lain). Setelah selesai:
1. Jalankan/test hasilnya, buktikan benar-benar jalan (bukan cuma klaim)
2. Commit dengan pesan yang jelas menjelaskan task ini
3. Laporkan status singkat ke saya
4. STOP dan tunggu saya bilang "lanjut" sebelum mengerjakan task berikutnya
```

Kalau Claude Code melenceng dari scope `SPEC_FASE_0.md` (misal mulai bikin halaman UI padahal itu harusnya Fase 1), gunakan:
```
Ini di luar scope SPEC_FASE_0.md — cek bagian "Out of Scope" dan 
"Boundaries". Tolong hentikan, kembalikan ke scope yang sesuai spec.
```

Untuk lanjut ke task berikutnya, cukup ketik:
```
Lanjut ke task berikutnya.
```

**Urutan task yang akan muncul (kira-kira, sesuai isi SPEC_FASE_0.md):**
1. Inisialisasi Next.js + TypeScript + Tailwind + ESLint/Prettier
2. Setup font (Playfair Display, Inter) + warna sebagai Tailwind token
3. Buat komponen dasar (`Button`, `Container`, `Typography`)
4. Setup struktur folder modular (`/modules`, `/components`, `/lib`)
5. Setup Prisma + koneksi PostgreSQL
6. Buat skema database awal (`User`, `Category`, `Product`, `ProductImage`, `ApiSetting`, `InstanceSetup`)
7. Jalankan migration + verifikasi koneksi database jalan

---

## STEP 9 — Cek Acceptance Criteria

Setelah semua task selesai, copy-paste prompt ini:

```
Semua task /plan sudah selesai. Sekarang cek ulang SATU PER SATU 
semua item di bagian "Acceptance Criteria" SPEC_FASE_0.md. Untuk 
tiap item, laporkan: sudah terpenuhi atau belum, dan buktikan 
caranya (misal jalankan command untuk verifikasi).
```

Kalau ada yang belum terpenuhi, minta Claude Code memperbaikinya dulu sebelum lanjut.

---

## STEP 10 — Fase 0 selesai → SEKARANG baru install Graphify

Keluar dulu dari sesi Claude Code atau buka terminal baru, jalankan (bukan di dalam sesi Claude Code):
```bash
uv tool install graphifyy
```
Kalau `uv` belum ada:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```
Lalu:
```bash
graphify install
```

Masuk lagi ke sesi Claude Code (`claude`), ketik:
```
/graphify .
```

Setelah selesai, aktifkan mode always-on dan auto-update (di terminal, bukan di sesi Claude Code):
```bash
graphify claude install
graphify hook install
```

Tambahkan ke `.gitignore` dan buat file `.claudeignore`:
```bash
echo "graphify-out/cost.json" >> .gitignore
echo -e "graph.json\ngraphify-out/" > .claudeignore
```

---

## STEP 11 — Tutup Fase 0 dengan rapi

Prompt penutup:
```
Fase 0 sudah saya review dan sesuai semua Acceptance Criteria. 
Ringkas apa saja yang sudah dibangun di Fase 0 (untuk jadi 
referensi Fase berikutnya), lalu berhenti. Saya akan lanjut 
dengan SPEC Fase 0.5 di sesi berikutnya.
```

Push semua ke GitHub:
```bash
git push -u origin main
```

---

## RINGKASAN URUTAN (kalau butuh cepat lihat urutannya saja)

```
STEP 0-2  : Setup folder, git, taruh 4 dokumen
STEP 3    : Install agent-skills (SEKARANG)
STEP 4    : Skip Graphify dulu
STEP 5    : Prompt kasih konteks (PRD + Blueprint)
STEP 6    : Prompt /spec (acu ke SPEC_FASE_0.md)
STEP 7    : Prompt /plan
STEP 8    : Prompt /build per task (ulang sampai semua task selesai)
STEP 9    : Prompt cek Acceptance Criteria
STEP 10   : Install Graphify (BARU SEKARANG, setelah ada kode)
STEP 11   : Prompt penutup + git push
```

Setelah ini selesai, kembali ke saya untuk lanjut susun `/spec` Fase 0.5.
