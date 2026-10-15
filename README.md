# BolehBeli? 🛍️💡

Kalkulator keputusan belanja dan pendukung keputusan finansial berbasis web (*Progressive Web App*) yang menjawab pertanyaan krusial secara instan: **"Boleh beli sekarang, atau harus tahan dulu?"**

Aplikasi ini dirancang untuk mencegah keputusan belanja impulsif dengan mensimulasikan dampak pembelian barang incaran terhadap sisa uang hidup harian dan tabungan darurat (*buffer*) sampai tanggal target gajian berikutnya.

---

## ✨ Fitur Utama

- **Pure Decision Engine**: Logika penentu status keputusan (*Aman/Bungkus*, *Waspada/Pikir Dulu*, atau *Skip Dulu*) deterministik 100% menggunakan aritmatika integer Rupiah murni tanpa risiko drift desimal/floating-point.
- **Multi-Item Wishlist Simulator**: Simulasi kombinasi belanja dengan toggle checkbox per item dan indikator setara jatah hidup harian (*budget-days*).
- **Sanity Meter**: Visualisasi alokasi proporsi saldo (Buffer Pengaman, Kebutuhan Wajib, Belanja Wishlist, dan Sisa Dana Bebas).
- **Sticky Decision Bar**: Bar ringkasan keputusan mengambang di bawah layar yang otomatis aktif saat panel keputusan utama keluar dari viewport.
- **Offline-First & PWA**:
  - Banner instalasi otomatis di Android/Chrome dan petunjuk instalasi manual (*Add to Home Screen*) di iOS Safari.
  - Toast pembaruan versi baru Service Worker dengan transisi mulus dan notifikasi siap offline.
  - Berfungsi 100% tanpa sambungan internet setelah instalasi awal.
- **100% Privat & Tanpa Pelacak**: Seluruh data disimpan langsung di browser perangkat Anda (`localStorage`). Tidak ada akun, tidak ada database cloud, tidak ada cookie analitik, dan tidak ada telemetri pihak ketiga.

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API dengan `<script setup>`)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan palet kustom *Onyx & Candy-Blue*
- **Komponen UI**: [shadcn-vue](https://www.shadcn-vue.com/) di atas [Reka UI v2](https://reka-ui.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/) dengan envelope validasi [Zod](https://zod.dev/) & migrasi skema
- **Ikon**: [Lucide Vue](https://lucide.dev/) (`@lucide/vue`)
- **PWA**: `vite-plugin-pwa` dengan Workbox offline precaching
- **Testing**: [Vitest](https://vitest.dev/) + `happy-dom`

---

## 🚀 Memulai Proyek

### Prasyarat
- **Node.js**: Versi `22.12` ke atas (sesuai `.nvmrc`)
- **Package Manager**: [pnpm](https://pnpm.io/) (versi 10+)

### Instalasi & Menjalankan Lokal

```bash
# Clone repositori
git clone https://github.com/Hafidzrdwn/bolehbeli.git
cd bolehbeli

# Pasang dependensi
pnpm install

# Jalankan server pengembangan
pnpm dev

# Bangun bundle produksi
pnpm build

# Preview hasil build produksi secara lokal
pnpm preview
```

---

## 📜 Skrip NPM

| Skrip | Deskripsi |
|---|---|
| `pnpm dev` | Menjalankan Vite development server dengan HMR |
| `pnpm build` | Memeriksa tipe TypeScript (`vue-tsc`) dan membangun bundle produksi |
| `pnpm preview` | Menjalankan preview lokal dari direktori `dist/` |
| `pnpm typecheck` | Menjalankan pemeriksaan tipe TypeScript tanpa emit kode |
| `pnpm lint` | Menjalankan ESLint untuk seluruh file proyek |
| `pnpm test:run` | Menjalankan unit test Vitest (sekali jalan) |
| `pnpm check:budget` | Memvalidasi anggaran performa (Initial JS gzip ≤ 100 KB, CSS gzip ≤ 15 KB, Precache raw ≤ 400 KB) |

---

## 🧮 Logika & Rumus Keputusan Finansial

Seluruh kalkulasi finansial diimplementasikan pada fungsi murni `evaluateDecision` ([src/lib/finance/decision.ts](src/lib/finance/decision.ts)) dengan aturan:

1. **Jumlah Hari (`days`)**:
   $$\text{days} = (\text{targetDate} - \text{today}) + 1$$
2. **Buffer Pengaman (`buffer`)**:
   $$\text{buffer} = \text{bufferThreshold} \mathbin{??} \max(50.000, \lfloor\text{balance} / 10\rfloor)$$
3. **Sisa Dana**:
   $$\text{sisaAwal} = \text{balance} - \text{needsTotal}$$
   $$\text{sisaFinal} = \text{sisaAwal} - \text{wishlistTotal}$$
4. **Jatah Harian**:
   $$\text{dailyInitial} = \lfloor(\text{sisaAwal} - \text{buffer}) / \text{days}\rfloor$$
   $$\text{dailyFinal} = \lfloor(\text{sisaFinal} - \text{buffer}) / \text{days}\rfloor$$
5. **Evaluasi Status**:
   - **🔴 Danger (Skip dulu!)**: Bila saldo tidak mencukupi untuk kebutuhan wajib (`sisaFinal < 0`).
   - **🟡 Warning (Pikir-pikir dulu)**: Bila `sisaFinal < buffer`, atau `dailyFinal < minDailyBudget`, atau jatah harian terpangkas lebih dari 40% (`dailyDropPercent > 40`).
   - **🟢 Safe (Aman, bungkus!)**: Seluruh parameter berada di atas batas aman.

---

## 🌐 Kompatibilitas Browser

Aplikasi dibangun menggunakan Tailwind CSS v4 dan fitur modern Web Platform (`@property`, CSS color-mix, flex/grid modern, ES2022+):

- **Apple Safari**: Versi ≥ 16.4 (iOS 16.4+ / macOS 13.3+)
- **Google Chrome / Chromium**: Versi ≥ 111
- **Mozilla Firefox**: Versi ≥ 128

---

## 🔒 Keamanan, Privasi & Rekomendasi Hosting Statis

### Privasi & Pengelolaan Data
- Data keuangan Anda hanya tersimpan di perangkat lokal pada kunci `localStorage['boleh-beli:state']`.
- Untuk menghapus seluruh data dan mengembalikan aplikasi ke kondisi awal:
  1. Klik ikon **Pengaturan** (ikon gear di pojok kanan atas).
  2. Gulir ke bagian **Reset Data**.
  3. Tekan **Hapus Semua Data** dan konfirmasikan.

### Rekomendasi HTTP Headers (Hosting Statis: Netlify, Vercel, Cloudflare Pages, atau Nginx)

Untuk memastikan perlindungan optimal, konfigurasi header berikut pada server web Anda:

```http
# Mencegah clickjacking (melengkapi meta CSP)
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none';

# Mencegah MIME-sniffing
X-Content-Type-Options: nosniff

# Kebijakan Referrer
Referrer-Policy: strict-origin-when-cross-origin

# Caching: Aset statis ber-hash (immutable)
# Jalur: /assets/*
Cache-Control: public, max-age=31536000, immutable

# Caching: Service Worker & Entry Point (selalu periksa versi terbaru)
# Jalur: /index.html, /sw.js, /manifest.webmanifest
Cache-Control: public, max-age=0, must-revalidate
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.
