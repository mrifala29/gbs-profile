# GBS — Gadget Bekas Sidoarjo
## Company Profile Website

Website statis modern untuk usaha jual beli gadget bekas di Sidoarjo.

---

## Struktur File

```
gbs-profile/
├── index.html                  ← Halaman utama (landing page)
├── laporan-penjualan.html      ← Dashboard laporan penjualan 2025
└── assets/
    ├── css/
    │   └── style.css           ← Seluruh styling
    └── js/
        ├── main.js             ← Animasi, cursor, navbar, typewriter
        └── charts.js           ← Chart.js: grafik & tabel laporan
```

---

## Fitur Website

### Halaman Utama (`index.html`)
- **Preloader** — Animasi loading saat pertama dibuka
- **Custom Cursor** — Cursor dot + ring dengan efek hover
- **Navbar** — Sticky dengan blur on scroll, mobile drawer
- **Hero** — Typewriter produk, floating gadget cards, animated orbs
- **Ticker Strip** — Marquee scrolling kategori produk
- **Stats Bar** — Counter animasi (unit terjual, pelanggan, omzet)
- **Tentang Kami** — Fitur unggulan + stat cards animasi
- **Produk** — 7 kartu kategori dengan 3D hover tilt
- **Cara Beli** — 4 langkah dengan process timeline
- **Keunggulan** — 6 kartu why-us
- **Testimoni** — Infinite scroll marquee ulasan pelanggan
- **Teaser Laporan** — Link ke halaman laporan
- **CTA** — Tombol WhatsApp & Instagram
- **Footer** + Floating WhatsApp button

### Halaman Laporan (`laporan-penjualan.html`)
- **8 KPI Cards** — Total unit, pendapatan, kategori terlaris, kota terbanyak
- **Grafik Tren Bulanan** — Line chart dual-axis (unit + pendapatan)
- **Grafik Per Kategori** — Doughnut chart + custom legend
- **Sebaran Lokasi Pembeli** — Bar chart 8 kabupaten/kota
- **Produk Terlaris** — Horizontal bar chart
- **Asal Barang (Lokasi Penjual)** — Pie chart 4 kota
- **Insight Cards** — Highlight pertumbuhan, pendapatan tertinggi, bulan perdana
- **Tabel Rekap Bulanan** — 12 bulan lengkap + growth MoM
- **Tabel Per Kategori** — 7 kategori + progress bar kontribusi
- **Tabel Per Lokasi** — 8 wilayah pembeli + progress bar

---

## Data Penjualan 2025 (Mock Data)

| Bulan | Unit | Pendapatan |
|-------|------|------------|
| Jan | 45 | Rp 145 jt |
| Feb | 52 | Rp 168 jt |
| Mar | 78 | Rp 245 jt |
| Apr | 91 | Rp 292 jt |
| Mei | 68 | Rp 219 jt |
| Jun | 72 | Rp 228 jt |
| Jul | 83 | Rp 267 jt |
| Agt | 89 | Rp 285 jt |
| Sep | 76 | Rp 241 jt |
| Okt | 94 | Rp 301 jt |
| Nov | 106 | Rp 338 jt |
| Des | 93 | Rp 295 jt |
| **Total** | **847** | **Rp 2.824 jt** |

> Update data di `assets/js/charts.js` → object `DATA` di baris atas file.

---

## Cara Update Data / Konten

### Ganti Nomor WhatsApp
Cari-ganti teks `6281234567890` di seluruh file HTML dengan nomor WA aktif.

### Update Data Penjualan
Edit file `assets/js/charts.js`, bagian object `DATA`:
```js
const DATA = {
  months  : [...],    // label bulan
  units   : [...],    // unit terjual per bulan
  revenue : [...],    // pendapatan dalam juta
  categories : { ... },
  locations  : { ... },
  sellerOrigin: { ... },
};
```

### Ganti Teks/Konten
Edit langsung di `index.html` atau `laporan-penjualan.html`.

---

## Deploy ke AWS S3

### Prasyarat
- AWS CLI terinstall dan dikonfigurasi (`aws configure`)
- S3 bucket sudah dibuat dengan static website hosting aktif

### Langkah Deploy

```bash
# 1. Buat S3 bucket (ganti nama bucket sesuai kebutuhan)
aws s3 mb s3://gbs-gadgetbekassidoarjo

# 2. Aktifkan static website hosting
aws s3 website s3://gbs-gadgetbekassidoarjo \
  --index-document index.html \
  --error-document index.html

# 3. Set bucket policy untuk public read
aws s3api put-bucket-policy \
  --bucket gbs-gadgetbekassidoarjo \
  --policy '{
    "Version":"2012-10-17",
    "Statement":[{
      "Sid":"PublicRead",
      "Effect":"Allow",
      "Principal":"*",
      "Action":"s3:GetObject",
      "Resource":"arn:aws:s3:::gbs-gadgetbekassidoarjo/*"
    }]
  }'

# 4. Upload semua file
aws s3 sync . s3://gbs-gadgetbekassidoarjo \
  --exclude ".git/*" \
  --exclude "README.md" \
  --exclude "node_modules/*"

# 5. Set cache headers untuk assets (opsional, performa)
aws s3 sync assets/ s3://gbs-gadgetbekassidoarjo/assets/ \
  --cache-control "max-age=86400"
```

### URL Website
Setelah deploy, website bisa diakses di:
```
http://gbs-gadgetbekassidoarjo.s3-website-ap-southeast-1.amazonaws.com
```

### Pakai CloudFront (Opsional – HTTPS + CDN)
```bash
# Buat CloudFront distribution yang pointing ke S3 bucket
# Aktifkan HTTPS dengan AWS Certificate Manager (ACM) untuk custom domain
```

### Custom Domain (Opsional)
1. Register domain di Route 53 atau domain registrar lain
2. Buat CNAME/A record ke CloudFront distribution
3. Request SSL certificate di ACM (us-east-1)

---

## Teknologi yang Digunakan

| Library | Versi | Fungsi |
|---------|-------|--------|
| Chart.js | 4.4.0 | Grafik laporan penjualan |
| Font Awesome | 6.5.0 | Icon set |
| Google Fonts | — | Space Grotesk + Inter |
| CSS Custom Properties | — | Design tokens |
| Intersection Observer API | — | Scroll animations |
| requestAnimationFrame | — | Counter & cursor animations |

> Website ini **tidak memerlukan build tool** — semua vanilla HTML/CSS/JS.
> Dapat langsung di-deploy ke S3 tanpa proses build.

---

## Browser Support

| Browser | Dukungan |
|---------|---------|
| Chrome 90+ | ✅ Penuh |
| Firefox 90+ | ✅ Penuh |
| Safari 14+ | ✅ Penuh |
| Edge 90+ | ✅ Penuh |
| Mobile Chrome/Safari | ✅ Penuh |

---

*GBS — Gadget Bekas Sidoarjo © 2025*
