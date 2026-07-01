# Dokumentasi Prompt AI — Campus Goes To School (SMAN 6 Depok)

Dokumen ini berisi rekonstruksi prompt yang digunakan untuk membangun website **"Campus Goes To School"** — sebuah landing page informasi kampus untuk siswa SMA Negeri 6 Depok, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

> **Catatan:** Prompt di bawah ini adalah rekonstruksi berdasarkan struktur, fitur, dan komentar kode pada file `index.html`, `style.css`, dan `main.js`. Setiap prompt mencerminkan instruksi yang secara logis menghasilkan komponen terkait.

---

## Stack & Fondasi Desain

**Prompt awal (setup project):**
> "Buatkan struktur dasar landing page untuk program 'Campus Goes To School' SMAN 6 Depok, menggunakan HTML, CSS, dan JavaScript vanilla (tanpa framework). Gunakan font Inter dari Google Fonts. Desainnya bergaya *glassmorphism / liquid glass UI* dengan skema warna putih dan oranye (`#E85D04`) sebagai warna aksen. Siapkan CSS variables untuk warna, spacing, radius, dan transition supaya konsisten di semua komponen."

**Hasil:** Fondasi `:root` CSS variables (`--color-primary`, `--glass-bg`, `--radius-*`, dll.), import font Inter, dan file `style.css` sebagai single source of truth desain.

---

## Header & Navigasi

**Prompt:**
> "Buatkan header sticky dengan efek glass (blur transparan) berisi logo sekolah, menu navigasi (Beranda, Tentang, Roadmap, Universitas, Kontak), tombol toggle dark/light mode, dan hamburger menu untuk mobile. Untuk mobile, buat drawer menu fullscreen yang slide-in dari samping, terpisah dari elemen header agar tidak terganggu oleh `backdrop-filter`."

**Hasil:** `<header class="header">` dengan `header__nav`, tombol `themeToggle`, `hamburgerBtn`, serta `mobile-drawer` + `mobile-drawer__backdrop` yang ditempatkan di luar `<header>`.

**Prompt lanjutan (dark mode):**
> "Tambahkan sistem dark/light mode menggunakan atribut `data-theme` di elemen `<html>`, simpan preferensi user di `localStorage` dengan key `hexa-theme`, dan terapkan tema sebelum CSS dirender (inline script di `<head>`) supaya tidak ada flash warna yang salah saat reload."

**Hasil:** Script IIFE di `<head>` yang membaca `localStorage.getItem('hexa-theme')` sebelum render, plus modul `Theme` di `main.js`.

---

## Hero Section & Slider

**Prompt:**
> "Buatkan hero section berupa image slider full-width dengan 3 slide (gambar background berbeda), overlay gelap transparan agar teks tetap terbaca, judul besar dengan bagian teks yang diberi warna aksen, tombol panah prev/next, dan indikator dots di bawah. Slider harus auto-play dan berhenti otomatis saat user hover atau menyentuh area slider."

**Hasil:** `<section class="hero" id="beranda">` berisi `.slider`, `.slide`, `slider__arrow`, `slider__dots`, dan modul JS `Slider` (`goTo`, `next`, `prev`, `startAuto`, `stopAuto`).

**Prompt lanjutan:**
> "Tambahkan section CTA singkat tepat di bawah hero berisi judul 'Raih Kampus Impianmu', deskripsi singkat program, dan dua tombol aksi: satu ke section Universitas, satu lagi ke section Roadmap."

**Hasil:** `<section class="hero-cta section" id="hero-cta">`.

---

## Roadmap / Timeline Seleksi PTN

**Prompt:**
> "Buatkan timeline roadmap seleksi PTN (SNBP, SNBT, Jalur Mandiri) dalam bentuk vertical stepper — setiap langkah punya nomor urut, garis penghubung antar step, kartu info (judul, deskripsi, chip tanggal), dan badge warna berbeda sesuai jalurnya. Tambahkan filter tab di atas ('Semua', 'SNBP', 'SNBT', 'Mandiri') yang bisa menyaring kartu roadmap sesuai jalur yang dipilih, dengan animasi transisi saat filter berganti."

**Hasil:** `.roadmap__list` dengan `.roadmap__row[data-jalur]`, `.roadmap__filter-btn[data-filter]`, dan modul JS *Roadmap Filter* yang toggle class berdasarkan `data-jalur` vs `data-filter` terpilih.

---

## UTBK Tools (Countdown, Pomodoro, Kalkulator)

**Prompt — Countdown:**
> "Buatkan kartu countdown yang menghitung mundur menuju tanggal UTBK 2026 (12 Juli 2026), format Hari:Jam:Menit:Detik, update setiap detik secara real-time menggunakan `setInterval`."

**Hasil:** `.countdown-card` dengan elemen `#cdDays`, `#cdHours`, `#cdMins`, `#cdSecs`, fungsi `tick()` di `main.js`.

**Prompt — Pomodoro Timer:**
> "Tambahkan widget Pomodoro Timer dengan mode Fokus dan Istirahat (tab switch), visual timer berbentuk ring/lingkaran progres, tombol start/stop/reset/skip, dan notifikasi browser (`Notification API`) saat sesi selesai."

**Hasil:** Modul `PomodoroModule` (IIFE) di `main.js` — `setMode`, `start`, `stop`, `reset`, `skipToNext`, `notify`, `updateRing`.

**Prompt — Kalkulator Target UTBK:**
> "Buatkan kalkulator sederhana: user pilih PTN impian dari dropdown (masing-masing punya skor target), lalu input skor tryout TPS dan Literasi. Setelah tombol 'Hitung Peluangku' ditekan, tampilkan hasil berupa persentase kedekatan skor terhadap target (progress bar terisi sesuai persentase), gap skor yang kurang, dan pesan motivasi yang berubah tergantung seberapa dekat hasilnya."

**Hasil:** `.calc-card` dengan `#calcPTN`, `#calcTPS`, `#calcLit`, `#calcBtn`, dan hasil dinamis di `#calcResult` (`calcFill`, `calcPct`, `calcMsg`) via fungsi `getMsg(percentage)`.

---

## Tentang Program & Statistik

**Prompt:**
> "Buatkan section 'Tentang Program' dua kolom: kolom kiri berisi deskripsi program dan daftar poin keunggulan (dengan ikon checklist), kolom kanan berisi grid 4 kartu statistik kaca (jumlah universitas, jumlah alumni, angkatan aktif, akreditasi sekolah)."

**Hasil:** `.about__grid` → `.about__text` (list `about__list-item`) + `.about__stats` (4× `.stat-card`).

---

## Grid Top Universitas

**Prompt:**
> "Buatkan grid kartu untuk menampilkan 12–13 universitas terbaik di Indonesia. Setiap kartu berisi ranking, logo universitas (ambil dari URL resmi kampus, dengan fallback teks singkatan jika gambar gagal dimuat), nama, lokasi, deskripsi singkat keunggulan, dan tombol 'Konsul Alumni' yang mengarah ke link WhatsApp berisi pesan template otomatis sesuai nama universitas tersebut. Beri efek hover yang halus (transform + shadow) pada setiap kartu."

**Hasil:** `.uni-grid` → `.uni-card` × 12/13, atribut `onerror` pada `<img>` untuk fallback logo, link `wa.me` dengan query string pesan.

---

## Galeri Foto & Lightbox

**Prompt:**
> "Tambahkan galeri foto kegiatan sekolah dalam grid, dan saat foto diklik, tampilkan lightbox fullscreen dengan navigasi next/prev antar foto serta tombol close."

**Hasil:** `.gallery` section + `.lightbox` (elemen di luar flow utama) dan modul JS *Gallery Lightbox* (`open`, `close`, `loadImage`, `next`, `prev`, `updateNav`).

---

## Form Kontak (Kirim via WhatsApp)

**Prompt:**
> "Buatkan section kontak dua kolom: kiri berisi info kontak sekolah (alamat, WhatsApp guru BK, email) dengan ikon, kanan berisi form (nama, kelas, pesan dengan character counter maks 500 karakter). Saat tombol 'Kirim via WhatsApp' ditekan, validasi input dulu (beri efek shake dan border merah jika ada field kosong), lalu buka WhatsApp dengan pesan yang sudah terformat otomatis dari isian form."

**Hasil:** `.contact__form` dengan `#contactName`, `#contactClass`, `#contactMsg`, `#charCount`, tombol `#contactSendBtn`, dan fungsi JS `shake()`, `setError()` untuk validasi.

---

## Footer

**Prompt:**
> "Buatkan footer 3 kolom: logo + tagline program, info kontak sekolah, dan navigasi cepat ke section-section utama. Tambahkan baris copyright di paling bawah."

**Hasil:** `<footer class="footer">` dengan `.footer__grid` (`footer__brand`, `footer__contact`, `footer__links`) + `.footer__bottom`.

---

## Penyempurnaan & Interaksi Umum

Prompt tambahan yang diterapkan lintas komponen selama proses pengembangan:

- **Scroll Reveal:** *"Tambahkan animasi fade-up saat elemen section masuk ke viewport menggunakan `IntersectionObserver`."*
- **Smooth Anchor Scroll:** *"Buat semua link navigasi (`#section`) melakukan smooth scroll ke section tujuan, dengan offset supaya tidak tertutup header sticky."*
- **Header on Scroll:** *"Ubah tampilan header (background lebih solid/shadow) saat halaman di-scroll melewati batas tertentu."*
- **Responsivitas Mobile:** *"Perbaiki tampilan semua section di layar mobile — grid universitas jadi 1 kolom, hero slider menyesuaikan tinggi, hamburger menu berfungsi penuh, dan kartu-kartu tidak overflow."*
- **Perapian Ikon:** *"Ganti semua ikon placeholder dengan SVG inline (bukan gambar/font-icon) supaya ringan dan gampang diberi warna sesuai tema."*
- **Integrasi Logo Asli:** *"Ganti logo universitas dari placeholder ke URL logo resmi masing-masing kampus, tambahkan fallback jika link gambar rusak."*

---

## Struktur Akhir Proyek

```
UAS_AI_2411501642/
├── index.html      → Struktur semua section (Header, Hero, Roadmap, UTBK Tools, Tentang, Universitas, Galeri, Kontak, Footer)
├── style.css       → Design system (CSS variables), glassmorphism, dark/light theme, responsive layout
├── main.js         → Theme, Slider, Header scroll, Mobile Drawer, Scroll Reveal, Smooth Scroll, Countdown, Pomodoro, Kalkulator, Contact Form, Roadmap Filter, Gallery dan Slider
└── img/            → Aset gambar (logo, slider)
```

---

### Catatan Etika Penggunaan AI

Website ini tidak sepenuh nya menggunakan AI karena untuk memberikan gambar logo universitas dan lain nya yang mengandung kode seperti "href" harus diganti dan juga css dark mode yang masih terang ataupun tidak mobile friendly. Dikembangkan dengan bantuan AI sebagai *coding assistant/pair programmer* — AI membantu menerjemahkan instruksi/prompt di atas menjadi kode HTML/CSS/JS. Proses pengambilan keputusan desain (skema warna, struktur informasi, fitur apa yang dibutuhkan siswa SMA), penyesuaian konten (data universitas, tanggal roadmap, nomor kontak), serta pengujian dan iterasi tetap dilakukan oleh saya sebagai pengembang.
