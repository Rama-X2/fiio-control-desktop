// Build script for FiiO Control Portable 64-bit (x64)
// Author: Rama Armytha (Rama-X2) - https://github.com/Rama-X2

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const outDir = path.join(distDir, 'FiiO-Control-x64');
const outZip = path.join(distDir, 'FiiO-Control-Portable-v1.0.0-win-x64.zip');

function buildX64() {
  console.log('====================================================');
  console.log('[Build] Building FiiO Control Portable Windows 64-bit (x64)');
  console.log('====================================================');

  fs.mkdirSync(distDir, { recursive: true });

  // 1. Locate or download electron x64 zip
  const cacheDir = path.join(process.env.LOCALAPPDATA || '', 'electron', 'Cache');
  let electronZip = null;
  if (fs.existsSync(cacheDir)) {
    const files = fs.readdirSync(cacheDir, { recursive: true });
    for (const f of files) {
      if (typeof f === 'string' && f.includes('win32-x64.zip')) {
        electronZip = path.join(cacheDir, f);
        break;
      }
    }
  }

  if (!electronZip || !fs.existsSync(electronZip)) {
    electronZip = path.join(distDir, 'electron-win32-x64.zip');
    console.log('[Download] Downloading Electron x64 runtime...');
    execSync(`curl.exe -L -s "https://github.com/electron/electron/releases/download/v31.4.0/electron-v31.4.0-win32-x64.zip" -o "${electronZip}"`, { stdio: 'inherit' });
  }

  // 2. Extract runtime
  console.log('[Extract] Extracting Electron x64 runtime...');
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  execSync(`7z x "${electronZip}" -o"${outDir}" -y`, { stdio: 'inherit' });

  // 3. Rename executable
  const oldExe = path.join(outDir, 'electron.exe');
  const newExe = path.join(outDir, 'FiiO-Control-x64.exe');
  if (fs.existsSync(oldExe)) {
    fs.renameSync(oldExe, newExe);
  }

  // 4. Assemble app bundle in resources/app
  const appTarget = path.join(outDir, 'resources', 'app');
  fs.mkdirSync(appTarget, { recursive: true });
  const defaultAppAsar = path.join(outDir, 'resources', 'default_app.asar');
  if (fs.existsSync(defaultAppAsar)) fs.unlinkSync(defaultAppAsar);

  fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(appTarget, 'package.json'));
  fs.copyFileSync(path.join(rootDir, 'LICENSE'), path.join(appTarget, 'LICENSE'));
  fs.copyFileSync(path.join(rootDir, 'README.md'), path.join(appTarget, 'README.md'));
  execSync(`xcopy "${path.join(rootDir, 'src')}" "${path.join(appTarget, 'src')}" /E /I /Y /Q`);
  execSync(`xcopy "${path.join(rootDir, 'presets')}" "${path.join(appTarget, 'presets')}" /E /I /Y /Q`);
  execSync(`xcopy "${path.join(rootDir, 'assets')}" "${path.join(appTarget, 'assets')}" /E /I /Y /Q`);
  execSync(`xcopy "${path.join(rootDir, 'web_offline')}" "${path.join(appTarget, 'web_offline')}" /E /I /Y /Q`);

  // 5. Apply icon and version metadata
  const rcedit = path.join(rootDir, 'node_modules', 'rcedit', 'bin', 'rcedit-x64.exe');
  if (fs.existsSync(rcedit)) {
    console.log('[Metadata] Applying app icon and PE metadata...');
    execSync(`"${rcedit}" "${newExe}" --set-icon "${path.join(rootDir, 'assets', 'app_icon.ico')}" --set-version-string "CompanyName" "Rama-X2" --set-version-string "FileDescription" "FiiO Control Desktop Portable" --set-version-string "ProductName" "FiiO Control Portable" --set-version-string "LegalCopyright" "Copyright (c) 2026 Rama Armytha (Rama-X2)" --set-file-version "1.0.0" --set-product-version "1.0.0"`);
  }

  // 6. Create portable zip
  console.log(`[Archive] Packaging into portable archive: ${outZip}`);
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  execSync(`7z a -tzip "${outZip}" "${outDir}\\*" -mx5`, { stdio: 'inherit' });

  console.log('[Done] FiiO Control Portable x64 build completed successfully.');
}

buildX64();
