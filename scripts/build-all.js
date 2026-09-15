// Master build script for both 64-bit and 32-bit portable versions
// Author: Rama Armytha (Rama-X2) - https://github.com/Rama-X2

const { execSync } = require('child_process');
const path = require('path');

console.log('[Build] Starting Full Multi-Arch Build for FiiO Control Portable...');

try {
  console.log('\n[1/2] Building 64-bit version...');
  execSync(`node "${path.join(__dirname, 'build-portable-x64.js')}"`, { stdio: 'inherit' });

  console.log('\n[2/2] Building 32-bit version...');
  execSync(`node "${path.join(__dirname, 'build-portable-ia32.js')}"`, { stdio: 'inherit' });

  console.log('\n[Done] All portable builds (x64 and 32-bit) completed successfully.');
} catch (err) {
  console.error('\n[Error] Build process encountered an error:', err);
  process.exit(1);
}
