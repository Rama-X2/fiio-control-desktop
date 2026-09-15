# FiiO Control Desktop Portable (x64 & 32-bit)

<p align="center">
  <img src="assets/fiio_header_logo.png" alt="FiiO Born for Music" width="360" />
</p>

<p align="center">
  <strong>Software Windows Mandiri untuk Kontrol DAC & Amplifier FiiO / JadeAudio</strong><br>
  <em>Auto-Connect Otomatis • 100% Offline • Penyimpanan Preset Lokal • Quick Control Flyout Pojok Kanan Bawah</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20x64%20%7C%20x86%20(32--bit)-0078D6?style=flat&logo=windows" alt="Windows Platform" />
  <img src="https://img.shields.io/badge/License-GPLv3-blue?style=flat" alt="GPLv3 License" />
  <img src="https://img.shields.io/badge/Type-Portable%20%26%20Installer-success?style=flat" alt="Type" />
  <img src="https://img.shields.io/badge/Offline-100%25%20Local-blueviolet?style=flat" alt="100% Offline" />
  <img src="https://img.shields.io/badge/Developer-Rama--X2-ff4081?style=flat&logo=github" alt="Author Rama-X2" />
</p>

---

## Latar Belakang

FiiO secara resmi hanya menyediakan aplikasi FiiO Control untuk perangkat mobile (Android/iOS), sedangkan untuk pengguna Windows/PC hanya tersedia versi web berbasis browser (`fiiocontrol.fiio.com`). Versi web memiliki sejumlah keterbatasan operasional:
1. **Ketergantungan Internet**: Memerlukan koneksi internet aktif untuk memuat halaman web dan aset.
2. **Koneksi Manual Berulang**: Pengguna harus menekan tombol "Connect Device", memilih port USB/Serial, dan menyetujui izin browser WebHID setiap kali halaman dibuka.
3. **Penyimpanan Terbatas**: Preset equalizer tersimpan di browser storage dan tidak terintegrasi ke file sistem Windows.

**FiiO Control Desktop** dibangun oleh [**Rama Armytha (Rama-X2)**](https://github.com/Rama-X2) sebagai solusi desktop mandiri (standalone) di Windows. Software ini menghadirkan pengalaman kontrol DAC yang seamless: deteksi otomatis saat aplikasi dibuka (layaknya aplikasi Android), berjalan 100% offline, mendukung penyimpanan preset lokal, serta dilengkapi panel **Quick Control Flyout di taskbar kanan bawah** untuk akses cepat parameter audio.

---

## Fitur Utama

### 1. Auto-Detect & Auto-Connect Otomatis
- Saat aplikasi dibuka, engine otomatis mendeteksi dan mengkoneksikan perangkat DAC FiiO / JadeAudio tanpa memerlukan klik manual atau konfirmasi izin browser.
- Dilengkapi **USB Hotplug Listener**: bila kabel DAC dicabut dan dicolokkan kembali, aplikasi langsung terhubung kembali secara otomatis.

### 2. 100% Mandiri & Offline
- Seluruh aset aplikasi web, chunk JavaScript, lembar gaya CSS, kalkulasi filter biquad PEQ, gambar produk DAC resolusi tinggi, dan logo telah dibundel secara lokal.
- Dapat beroperasi secara penuh di komputer tanpa sambungan internet.

### 3. Quick Control Flyout (Taskbar Kanan Bawah)
- Ikon tray khusus di dekat jam Windows (pojok kanan bawah).
- **Klik Kiri**: Membuka widget mengambang (flyout panel) di atas taskbar Windows:
  - Pemantauan nama dan status koneksi DAC yang terpasang (misal: `JadeAudio JA11`).
  - Pemilihan cepat preset EQ (Harman, Bass Boost, FPS Footsteps, dll.).
  - Toggle cepat EQ Aktif / Bypass.
  - Slider Global Gain (-12 dB hingga +12 dB).
  - Tombol pintas menuju jendela utama FiiO Studio.
- **Klik Kanan**: Menu konteks standar untuk pemilihan preset, pembuatan shortcut, dan pengaturan startup Windows.

### 4. Penyimpanan & Manajemen Preset Lokal
- Konfigurasi equalizer parametrik (PEQ) disimpan langsung ke direktori `presets/` dalam format JSON standar yang kompatibel dengan format resmi FiiO.
- Pengguna dapat membuat preset kustom, mengimpor, mengekspor, dan membagikan file preset antar perangkat.

### 5. Profil Preset Pre-loaded
Tersedia 9 profil tuning audio siap pakai yang telah dikonfigurasi:
- **Harman In-Ear Target**: Kurva target standar audio internasional dengan sub-bass terukur dan pinna gain alami.
- **Bass Boost (+3dB & +6dB)**: Penguatan rentang frekuensi rendah yang bersih tanpa menutupi kejernihan vokal.
- **Gaming FPS Footsteps (CS2 / Valorant / Apex)**: Atenuasi frekuensi ledakan dan penguatan frekuensi langkah kaki (1.5 kHz - 3.5 kHz) serta reload senjata.
- **Gaming Cinematic & MOBA**: Soundstage luas, bass atmosferik, dan artikulasi vokal komunikasi tim yang jelas.
- **Vocal Clarity & Acoustic**: Penonjolan vokal utama dan instrumen akustik.
- **Treble Air & Micro-Details**: Perluasan ruang atas panggung suara untuk detail instrumen dan simbal.
- **Rock & Metal Dynamic**: Karakter V-shaped bertenaga untuk ketukan drum dan distorsi gitar elektrik.
- **Flat Reference (Neutral)**: Respon murni 0 dB untuk kebutuhan referensi monitoring.

### 6. Dukungan Multi-Arsitektur (x64 & 32-bit)
- Tersedia dalam versi 64-bit (x64) dan 32-bit (ia32) untuk mendukung Windows 10, Windows 11, serta perangkat Windows edisi lawas.

---

## Daftar Perangkat yang Didukung

Mendukung jajaran USB DAC, Bluetooth DAC, dan Dongle DAC dari FiiO dan JadeAudio:

| Kategori | Model Perangkat |
|---|---|
| **JadeAudio Series** | JadeAudio JA11, JadeAudio JIEZI, JadeAudio TRUSTBLU, JadeAudio JK13 |
| **KA Series (Dongle DAC)** | FIIO KA17, FIIO KA15, FIIO KA13, FIIO KA1, FIIO KA2, FIIO KA3, FIIO KA5 |
| **BTR Series (Bluetooth/USB)** | FIIO BTR17, FIIO BTR15, FIIO BTR13, FIIO BTR7, FIIO BTR5, FIIO BTR3K |
| **Desktop K Series** | FIIO K19, FIIO K17, FIIO K15, FIIO K13 R2R, FIIO K9 Pro, FIIO K7 |
| **Lainnya / In-Ear DSP** | FIIO FP3, FIIO FX17, FIIO LS-TC2, FIIO Air Link, FIIO BT11, RETRO NANO, SNOWSKY Melody, SNOWSKY Tiny A/B |

---

## Panduan Penggunaan

Software didistribusikan dalam dua format: **Setup Installer** dan **Versi Portable**.

### Opsi 1: Setup Installer (Rekomendasi)
1. Unduh installer dari menu Releases di repositori ini:
   - `FiiO Control-Setup-1.0.0-x64.exe` (Windows 64-bit)
   - `FiiO Control-Setup-1.0.0-ia32.exe` (Windows 32-bit)
2. Jalankan installer dan ikuti instruksi pada layar.
3. Shortcut desktop dan Start Menu akan dibuat secara otomatis sehingga aplikasi dapat langsung ditemukan lewat fitur pencarian Windows.

### Opsi 2: Versi Portable (Tanpa Instalasi)
1. Unduh arsip zip sesuai arsitektur komputer:
   - `FiiO-Control-Portable-v1.0.0-win-x64.zip` (Windows 64-bit)
   - `FiiO-Control-Portable-v1.0.0-win-ia32.zip` (Windows 32-bit)
2. Ekstrak arsip zip ke direktori pilihan (misal: Program Files, Desktop, atau USB Flashdrive).
3. Jalankan `FiiO-Control-x64.exe` (atau `FiiO-Control-ia32.exe`).
4. Saat pertama kali dijalankan, software portable ini juga menyediakan opsi pembuatan shortcut otomatis ke Desktop dan Start Menu melalui klik kanan ikon tray.

---

## Pengembangan & Kompilasi dari Source Code

Prasyarat lingkungan: **Node.js** (versi 18 atau lebih baru) dan **Git**.

```bash
# 1. Clone repositori
git clone https://github.com/Rama-X2/fiio-control-desktop.git
cd fiio-control-desktop

# 2. Pasang dependensi
npm install

# 3. Jalankan dalam mode pengembangan
npm start

# 4. Bangun versi portable
npm run build:portable-x64   # 64-bit portable
npm run build:portable-ia32  # 32-bit portable
npm run build:portable-all   # Kedua arsitektur

# 5. Bangun setup installer resmi
npm run build:installer-x64  # 64-bit installer
npm run build:installer-ia32 # 32-bit installer
npm run build:installer-all  # Kedua arsitektur
```

Output biner portable akan disimpan di direktori `dist/`, sedangkan file setup installer tersimpan di `dist/installers/`.

---

## Struktur Direktori

```text
fiio-control-desktop/
├── .github/
│   └── workflows/release.yml   # Workflow GitHub Actions untuk build rilis otomatis
├── assets/                     # Ikon aplikasi, logo, dan aset visual
│   ├── app_icon.ico
│   ├── app_icon.png
│   ├── fiio_header_logo.png
│   └── fiio_logo.svg
├── presets/                    # Konfigurasi profil tuning PEQ (.json)
│   ├── harman_target.json
│   ├── bass_boost_plus_3db.json
│   ├── bass_boost_plus_6db.json
│   ├── gaming_fps_footsteps.json
│   ├── gaming_cinematic_moba.json
│   ├── vocal_clarity.json
│   ├── treble_air_sparkle.json
│   ├── rock_dynamic.json
│   └── flat_reference.json
├── src/
│   ├── main.js                 # Electron main process
│   ├── preload.js              # IPC bridge
│   ├── auto_connect.js         # Script auto-detect & auto-connect DAC
│   ├── local_server.js         # Loopback server untuk bundle offline & API presets
│   ├── quick_control.html      # Antarmuka panel flyout taskbar
│   ├── quick_control.css       # Lembar gaya flyout
│   └── quick_control.js        # Kontrol interaktif flyout
├── web_offline/                # Bundel offline FiiO Control SPA (HTML, JS, CSS, PNG)
├── scripts/
│   ├── build-portable-x64.js   # Skrip pembangun portable 64-bit
│   ├── build-portable-ia32.js  # Skrip pembangun portable 32-bit
│   └── build-all.js            # Skrip pembangun gabungan
├── package.json
├── LICENSE
├── .gitignore
└── README.md
```

---

## Lisensi

Proyek ini dilisensikan di bawah ketentuan [GNU General Public License v3.0 (GPLv3)](LICENSE).

Pengembang: **Rama Armytha (Rama-X2)**  
- Profil GitHub: [https://github.com/Rama-X2](https://github.com/Rama-X2)  
- Repositori: [https://github.com/Rama-X2/fiio-control-desktop](https://github.com/Rama-X2/fiio-control-desktop)

---

## Pernyataan Hak Cipta & Merek Dagang (Legal Disclaimer)

1. **Status Proyek**: Perangkat lunak ini merupakan proyek utilitas independen pihak ketiga yang dikembangkan oleh komunitas open-source. Proyek ini **TIDAK berafiliasi, didukung, disponsori, atau disetujui secara resmi oleh Guangzhou FiiO Electronics Technology Co., Ltd.**
2. **Merek Dagang**: Nama "FiiO", "JadeAudio", serta logo dan merek dagang terkait adalah hak milik eksklusif dari Guangzhou FiiO Electronics Technology Co., Ltd. Penggunaan nama-nama tersebut di dalam proyek ini dilakukan semata-mata atas dasar penggunaan wajar (nominative fair use) untuk tujuan identifikasi kompatibilitas perangkat keras yang didukung oleh perangkat lunak ini.
3. **Kode Sumber**: Kode jembatan desktop, server lokal tertanam, integrasi WebHID otomatis, panel Quick Control, dan skrip pembangun dalam repositori ini dilindungi di bawah lisensi open-source GNU General Public License v3.0 (GPLv3).

