# FiiO Control Desktop (x64 & 32-bit)

<p align="center">
  <img src="assets/fiio_header_logo.png" alt="FiiO Born for Music" width="360" />
</p>

<p align="center">
  <strong>Standalone Windows Desktop Application for FiiO & JadeAudio DACs / Amplifiers</strong><br>
  <em>Automatic Connection • 100% Offline • Local Preset Management • Taskbar Quick Control Flyout</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20x64%20%7C%20x86%20(32--bit)-0078D6?style=flat&logo=windows" alt="Windows Platform" />
  <img src="https://img.shields.io/badge/License-GPLv3-blue?style=flat" alt="GPLv3 License" />
  <img src="https://img.shields.io/badge/Distribution-Portable%20%26%20Installer-success?style=flat" alt="Distribution" />
  <img src="https://img.shields.io/badge/Offline-100%25%20Local-blueviolet?style=flat" alt="100% Offline" />
  <img src="https://img.shields.io/badge/Developer-Rama--X2-ff4081?style=flat&logo=github" alt="Author Rama-X2" />
</p>

---

## Overview

FiiO officially provides the FiiO Control application exclusively for mobile platforms (Android and iOS). For Windows and PC users, the only official option available is the browser-based web application (`fiiocontrol.fiio.com`). The web client introduces several practical limitations:
1. **Internet Dependency**: An active internet connection is required to load the web interface and assets.
2. **Repetitive Connection Prompts**: Users are required to click "Connect Device", select the USB/Serial port, and accept the browser WebHID permission prompt every time the page is accessed.
3. **Restricted Storage**: Equalizer presets are confined to browser local storage and cannot be easily managed as native files on the Windows filesystem.

**FiiO Control Desktop** was created by [**Rama Armytha (Rama-X2)**](https://github.com/Rama-X2) to provide a seamless, standalone desktop solution for Windows. The application automatically connects to supported DACs upon launch without manual prompts, operates completely offline, manages presets directly on your local drive, and includes a **Quick Control Flyout in the Windows system tray** for instant audio tuning.

---

## Key Features

### 1. Instant Auto-Detect & Auto-Connect
- Detects and connects to your FiiO or JadeAudio DAC automatically when the application opens, matching the convenience of the Android mobile app.
- Built-in **USB Hotplug Listener**: if you disconnect and reconnect your DAC, the application automatically re-establishes the connection immediately.

### 2. 100% Standalone & Offline
- All application assets, JavaScript chunks, CSS stylesheets, parametric EQ biquad filter calculations, high-resolution device images, and logos are bundled locally.
- Fully functional without any internet access.

### 3. Quick Control Flyout (Taskbar Tray Widget)
- Dedicated system tray icon located in the Windows notification area (bottom-right corner).
- **Left Click**: Toggles a sleek, floating Windows 11 Fluent dark flyout panel:
  - Real-time device connection status and name display (e.g., `JadeAudio JA11`).
  - 1-click sound preset switching (Harman Target, Bass Boost, FPS Footsteps, etc.).
  - Quick EQ enable / bypass toggle.
  - Global Gain slider (-12 dB to +12 dB).
  - Direct shortcut to open the full FiiO Studio window.
- **Right Click**: Traditional context menu for rapid profile selection, desktop shortcut creation, and Windows startup settings.

### 4. Local Preset Storage & Management
- Parametric EQ (PEQ) profiles are stored directly in the `presets/` directory in standard JSON format, fully compatible with official FiiO export and import specifications.
- Create custom presets, import existing configurations, and export or share tuning profiles effortlessly.

### 5. Pre-loaded Audiophile & Gaming Profiles
Includes 9 carefully calibrated sound profiles ready for immediate use:
- **Harman In-Ear Target**: International acoustic target benchmark with controlled sub-bass and natural pinna gain.
- **Bass Boost (+3dB & +6dB)**: Clean low-end elevation without muddying vocal clarity or midrange instruments.
- **Gaming FPS Footsteps (CS2 / Valorant / Apex)**: Attenuates explosion rumble while amplifying critical footsteps (1.5 kHz - 3.5 kHz) and weapon reload cues.
- **Gaming Cinematic & MOBA**: Expansive soundstage, atmospheric sub-bass, and crystal-clear voice communication.
- **Vocal Clarity & Acoustic**: Brings lead vocals and acoustic guitars forward with enhanced intimacy.
- **Treble Air & Micro-Details**: Expands top-end extension for instrument separation and cymbal sparkle.
- **Rock & Metal Dynamic**: Punchy V-shaped tuning featuring authoritative drum kicks and energetic electric guitars.
- **Flat Reference (Neutral)**: Pure 0 dB flat response for audio mastering and reference monitoring.

### 6. Dual Architecture Support (x64 & 32-bit)
- Provided in both 64-bit (x64) and 32-bit (ia32) binaries to ensure compatibility across modern Windows 11, Windows 10, and legacy Windows installations.

---

## Supported Devices

Supports the full lineup of USB DACs, Bluetooth DACs, and DSP Dongles from FiiO and JadeAudio:

| Category | Supported Models |
|---|---|
| **JadeAudio Series** | JadeAudio JA11, JadeAudio JIEZI, JadeAudio TRUSTBLU, JadeAudio JK13 |
| **KA Series (Dongle DAC)** | FIIO KA17, FIIO KA15, FIIO KA13, FIIO KA1, FIIO KA2, FIIO KA3, FIIO KA5 |
| **BTR Series (Bluetooth/USB)** | FIIO BTR17, FIIO BTR15, FIIO BTR13, FIIO BTR7, FIIO BTR5, FIIO BTR3K |
| **Desktop K Series** | FIIO K19, FIIO K17, FIIO K15, FIIO K13 R2R, FIIO K9 Pro, FIIO K7 |
| **In-Ear DSP & Others** | FIIO FP3, FIIO FX17, FIIO LS-TC2, FIIO Air Link, FIIO BT11, RETRO NANO, SNOWSKY Melody, SNOWSKY Tiny A/B |

---

## Installation & Usage

The application is distributed in two formats: **Official Setup Installer** and **Portable Edition**.

### Option 1: Official Setup Installer (Recommended)
1. Download the installer for your system architecture from the [Releases](https://github.com/Rama-X2/fiio-control-desktop/releases) page:
   - `FiiO Control-Setup-1.0.0-x64.exe` (Windows 64-bit)
   - `FiiO Control-Setup-1.0.0-ia32.exe` (Windows 32-bit)
2. Run the executable and follow the standard setup wizard.
3. Shortcuts are automatically added to the Desktop and Start Menu, allowing quick access via Windows Search.
4. Includes a clean uninstaller accessible through Windows Settings and Control Panel.

### Option 2: Portable Edition (Zero-Install)
1. Download the portable zip archive corresponding to your system architecture:
   - `FiiO-Control-Portable-v1.0.0-win-x64.zip` (Windows 64-bit)
   - `FiiO-Control-Portable-v1.0.0-win-ia32.zip` (Windows 32-bit)
2. Extract the archive into any folder (e.g., Program Files, Desktop, or a USB flash drive).
3. Run `FiiO-Control-x64.exe` (or `FiiO-Control-ia32.exe`).
4. On first launch, the portable version can also generate Desktop and Start Menu shortcuts automatically, or on-demand via the tray icon menu.

---

## Development & Building from Source

Prerequisites: **Node.js** (version 18 or later) and **Git**.

```bash
# 1. Clone the repository
git clone https://github.com/Rama-X2/fiio-control-desktop.git
cd fiio-control-desktop

# 2. Install dependencies
npm install

# 3. Start development mode
npm start

# 4. Build portable packages (.zip)
npm run build:portable-x64   # 64-bit portable
npm run build:portable-ia32  # 32-bit portable
npm run build:portable-all   # Both architectures

# 5. Build official setup installers (.exe)
npm run build:installer-x64  # 64-bit installer
npm run build:installer-ia32 # 32-bit installer
npm run build:installer-all  # Both architectures
```

Binary outputs are generated in the `dist/` folder, and setup installers are placed in `dist/installers/`.

---

## Project Structure

```text
fiio-control-desktop/
├── .github/
│   └── workflows/release.yml   # GitHub Actions workflow for automated multi-arch builds
├── assets/                     # Application icons, logos, and product graphics
│   ├── app_icon.ico
│   ├── app_icon.png
│   ├── fiio_header_logo.png
│   └── fiio_logo.svg
├── presets/                    # Pre-tuned PEQ sound profiles (.json)
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
│   ├── main.js                 # Electron main process (auto-connect, tray, windows)
│   ├── preload.js              # Secure IPC bridge
│   ├── auto_connect.js         # Injected auto-detection and hotplug engine
│   ├── local_server.js         # Embedded loopback server for offline assets and presets
│   ├── quick_control.html      # Taskbar tray flyout markup
│   ├── quick_control.css       # Taskbar tray flyout stylesheet
│   └── quick_control.js        # Taskbar tray flyout controller
├── web_offline/                # Bundled offline FiiO Control SPA (HTML, JS, CSS, PNG)
├── scripts/
│   ├── build-portable-x64.js   # 64-bit portable build script
│   ├── build-portable-ia32.js  # 32-bit portable build script
│   └── build-all.js            # Master multi-arch build script
├── package.json
├── LICENSE
├── .gitignore
└── README.md
```

---

## License

This project is licensed under the terms of the [GNU General Public License v3.0 (GPLv3)](LICENSE).

Developer: **Rama Armytha (Rama-X2)**  
- GitHub Profile: [https://github.com/Rama-X2](https://github.com/Rama-X2)  
- Repository: [https://github.com/Rama-X2/fiio-control-desktop](https://github.com/Rama-X2/fiio-control-desktop)

---

## Legal Disclaimer & Trademark Notice

1. **Project Status**: This software is an independent, third-party community utility. This project is **NOT affiliated with, endorsed by, sponsored by, or officially associated with Guangzhou FiiO Electronics Technology Co., Ltd.**
2. **Trademarks**: "FiiO", "JadeAudio", and associated logos or product names are the registered trademarks of Guangzhou FiiO Electronics Technology Co., Ltd. The use of these trademarks within this project is strictly for the purpose of nominative fair use to identify hardware compatibility.
3. **Source Code**: The desktop integration bridge, embedded local server, automated WebHID permission handlers, Quick Control tray panel, and packaging scripts in this repository are distributed under the open-source GNU General Public License v3.0 (GPLv3).

