# GHEVERHAN

Template e-commerce fashion **single-seller**, premium, mobile-first — dijual sekali ke klien dan di-self-host (bukan SaaS). Setiap instance melayani satu seller, diaktivasi lewat installer wizard dengan license key yang dikunci ke domain klien.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth (password di-hash pakai bcrypt)
- **Validasi:** Zod
- **Ikon:** Lucide React
- **Payment:** Tripay
- **Shipping:** JNE / J&T Express

Detail arsitektur, prinsip modular, dan pembagian fase pengembangan lengkap ada di [`GHEVERHAN_BLUEPRINT.md`](./GHEVERHAN_BLUEPRINT.md) dan [`PRD_GHEVERHAN.md`](./PRD_GHEVERHAN.md).

## Instalasi Lokal

1. Clone repo dan install dependencies:

   ```bash
   git clone <repo-url>
   cd gheverhan-shop
   npm install
   ```

2. Salin `.env.example` ke `.env`, lalu isi `DATABASE_URL` dengan connection string PostgreSQL (Supabase):

   ```bash
   cp .env.example .env
   ```

3. Jalankan migration database:

   ```bash
   npx prisma migrate dev
   ```

4. Jalankan dev server:

   ```bash
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000).

## Status

Fase 0 (Fondasi Project & Design System) selesai — lihat [`SPEC_FASE_0.md`](./SPEC_FASE_0.md) untuk scope dan acceptance criteria lengkap.
