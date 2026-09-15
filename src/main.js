// FiiO Control Portable Desktop - Core Engine
// Author: Rama Armytha (Rama-X2)
// Repository: https://github.com/Rama-X2/fiio-control-desktop

const { app, BrowserWindow, Tray, Menu, ipcMain, screen, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const LocalServer = require('./local_server');

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow = null;
let quickControlWindow = null;
let tray = null;
let localServer = null;
let serverPort = 41789;

// Global device & audio state
const appState = {
  device: 'Scanning...',
  preset: 'harman_target',
  presetName: 'Harman In-Ear Target',
  eqEnabled: true,
  globalGain: 0.0
};

const iconPath = path.join(__dirname, '..', 'assets', 'app_icon.ico');
const presetsDir = path.join(__dirname, '..', 'presets');

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'FiiO Control Desktop Portable - by Rama-X2',
    icon: iconPath,
    backgroundColor: '#121214',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  // Setup WebHID and WebSerial auto-connect hooks
  const session = mainWindow.webContents.session;

  session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    return true; // Auto-grant all device and media permissions
  });

  session.setDevicePermissionHandler((details) => {
    return true; // Auto-grant device permission without prompt
  });

  // Automatically select FiiO / JadeAudio HID device without showing any browser modal
  session.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    console.log('[FiiO Main] HID Device List available:', details.deviceList.map(d => `${d.productName} (VID:${d.vendorId}, PID:${d.productId})`));

    // Target FiiO, JadeAudio, and known DAC vendor IDs
    const fiioDevice = details.deviceList.find(d => {
      const name = (d.productName || '').toLowerCase();
      const vid = d.vendorId;
      return (
        vid === 0x2972 || vid === 10610 || vid === 13058 || vid === 2578 || vid === 1638 || vid === 12722 ||
        name.includes('fiio') || name.includes('jade') || name.includes('ja11') || name.includes('ka17') ||
        name.includes('ka15') || name.includes('btr') || name.includes('snowsky')
      );
    }) || details.deviceList[0];

    if (fiioDevice) {
      console.log('[FiiO Main] Auto-selecting device:', fiioDevice.productName);
      appState.device = fiioDevice.productName || 'FiiO Audio DAC';
      syncStateToWindows();
      updateTrayMenu();
      callback(fiioDevice.deviceId);
    } else {
      console.log('[FiiO Main] No matching HID device found in list');
      callback('');
    }
  });

  // Automatically select FiiO Serial Port if applicable
  session.on('select-serial-port', (event, portList, webContents, callback) => {
    event.preventDefault();
    console.log('[FiiO Main] Serial Ports available:', portList);
    const fiioPort = portList.find(p => (p.displayName || '').toLowerCase().includes('fiio')) || portList[0];
    callback(fiioPort ? fiioPort.portId : '');
  });

  // Inject auto-connect logic when the page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[FiiO Main] Injecting auto-connect and offline bridge...');
    try {
      const autoConnectCode = fs.readFileSync(path.join(__dirname, 'auto_connect.js'), 'utf-8');
      mainWindow.webContents.executeJavaScript(autoConnectCode);
    } catch (e) {
      console.error('[FiiO Main] Failed to inject auto_connect.js:', e);
    }
  });

  // Load the 100% offline local URL
  mainWindow.loadURL(`http://127.0.0.1:${serverPort}/`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimize to tray instead of closing completely
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      if (tray) {
        tray.displayBalloon({
          icon: iconPath,
          title: 'FiiO Control',
          content: 'Running in background. Click tray icon for Quick Control.'
        });
      }
    }
  });
}

function createQuickControlWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workArea;

  const flyoutWidth = 340;
  const flyoutHeight = 490;
  const margin = 16;

  quickControlWindow = new BrowserWindow({
    width: flyoutWidth,
    height: flyoutHeight,
    x: width - flyoutWidth - margin,
    y: height - flyoutHeight - margin,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  quickControlWindow.loadFile(path.join(__dirname, 'quick_control.html'));

  quickControlWindow.on('blur', () => {
    // Hide when clicking outside
    quickControlWindow.hide();
  });
}

function toggleQuickControl() {
  if (!quickControlWindow) {
    createQuickControlWindow();
  }

  if (quickControlWindow.isVisible()) {
    quickControlWindow.hide();
  } else {
    // Update position in case resolution or taskbar changed
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.workArea;
    const flyoutWidth = 340;
    const flyoutHeight = 490;
    const margin = 16;
    quickControlWindow.setPosition(width - flyoutWidth - margin, height - flyoutHeight - margin);

    syncStateToWindows();
    quickControlWindow.show();
    quickControlWindow.focus();
  }
}

function createTray() {
  tray = new Tray(iconPath);
  tray.setToolTip('FiiO Control Desktop - Portable');

  // Left click toggles Quick Control flyout
  tray.on('click', () => {
    toggleQuickControl();
  });

  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) return;

  const presets = [
    { id: 'harman_target', label: 'Harman In-Ear Target' },
    { id: 'bass_boost_plus_3db', label: 'Bass Boost (+3dB)' },
    { id: 'bass_boost_plus_6db', label: 'Bass Boost (+6dB)' },
    { id: 'gaming_fps_footsteps', label: 'Gaming FPS Footsteps' },
    { id: 'gaming_cinematic_moba', label: 'Gaming MOBA & Cinema' },
    { id: 'vocal_clarity', label: 'Vocal Clarity' },
    { id: 'treble_air_sparkle', label: 'Treble Air' },
    { id: 'rock_dynamic', label: 'Rock & Metal' },
    { id: 'flat_reference', label: 'Flat Reference' }
  ];

  const presetSubmenu = presets.map(p => ({
    label: p.label,
    type: 'radio',
    checked: appState.preset === p.id,
    click: () => {
      applyPresetFromId(p.id, p.label);
    }
  }));

  const contextMenu = Menu.buildFromTemplate([
    { label: `Device: ${appState.device}`, enabled: false },
    { type: 'separator' },
    { label: 'Quick Control Panel', click: () => toggleQuickControl() },
    { label: 'Presets', submenu: presetSubmenu },
    {
      label: 'EQ Enabled',
      type: 'checkbox',
      checked: appState.eqEnabled,
      click: (item) => {
        appState.eqEnabled = item.checked;
        syncStateToWindows();
        sendActionToRenderer('toggle-eq', item.checked);
      }
    },
    { type: 'separator' },
    { label: 'Open FiiO Studio Window', click: () => showMainWindow() },
    { label: 'Open Presets Folder', click: () => shell.openPath(presetsDir) },
    { label: 'Buat Shortcut Desktop & Start Menu', click: () => createDesktopAndStartMenuShortcuts(true) },
    { type: 'separator' },
    {
      label: 'Launch on Windows Startup',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      }
    },
    { label: 'Exit FiiO Control', click: () => {
      app.isQuitting = true;
      app.quit();
    }}
  ]);

  tray.setContextMenu(contextMenu);
}

function showMainWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
}

function syncStateToWindows() {
  if (quickControlWindow && !quickControlWindow.isDestroyed()) {
    quickControlWindow.webContents.send('sync-device-state', appState);
  }
  if (localServer) {
    localServer.currentDevice = appState.device;
    localServer.activePreset = appState.presetName;
    localServer.eqEnabled = appState.eqEnabled;
    localServer.globalGain = appState.globalGain;
  }
}

function applyPresetFromId(presetId, presetName) {
  appState.preset = presetId;
  appState.presetName = presetName;
  syncStateToWindows();
  updateTrayMenu();

  // Read preset JSON file and send to FiiO webapp renderer
  try {
    const presetPath = path.join(presetsDir, `${presetId}.json`);
    if (fs.existsSync(presetPath)) {
      const pdata = JSON.parse(fs.readFileSync(presetPath, 'utf-8'));
      sendActionToRenderer('load-preset', pdata);
    }
  } catch (e) {
    console.error('[FiiO Main] Error applying preset:', e);
  }
}

function sendActionToRenderer(action, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('quick-control-action', action, payload);
    // Also execute in web context if needed
    if (action === 'load-preset') {
      mainWindow.webContents.executeJavaScript(`
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('fiio-apply-preset', { detail: ${JSON.stringify(payload)} }));
        }
      `).catch(() => {});
    }
  }
}

// IPC Handlers
ipcMain.on('device-connected', (event, deviceName) => {
  console.log('[FiiO IPC] Device connected:', deviceName);
  appState.device = deviceName;
  syncStateToWindows();
  updateTrayMenu();
});

ipcMain.on('device-disconnected', () => {
  console.log('[FiiO IPC] Device disconnected');
  appState.device = 'Scanning...';
  syncStateToWindows();
  updateTrayMenu();
});

ipcMain.on('toggle-quick-control', () => toggleQuickControl());
ipcMain.on('show-main-window', () => showMainWindow());
ipcMain.on('hide-quick-control', () => {
  if (quickControlWindow) quickControlWindow.hide();
});

ipcMain.on('quick-control-change-preset', (event, { id, name }) => {
  applyPresetFromId(id, name);
});

ipcMain.on('quick-control-toggle-eq', (event, enabled) => {
  appState.eqEnabled = enabled;
  syncStateToWindows();
  updateTrayMenu();
  sendActionToRenderer('toggle-eq', enabled);
});

ipcMain.on('quick-control-change-gain', (event, gain) => {
  appState.globalGain = gain;
  syncStateToWindows();
  sendActionToRenderer('change-gain', gain);
});

ipcMain.on('quick-control-reconnect', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.executeJavaScript('if (window.fiioDesktopConnect) window.fiioDesktopConnect();').catch(() => {});
  }
});

ipcMain.on('open-presets-folder', () => {
  shell.openPath(presetsDir);
});

ipcMain.on('save-current-preset-prompt', (event, name) => {
  const safeName = name.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_').toLowerCase();
  const filePath = path.join(presetsDir, `${safeName}.json`);
  const presetData = {
    name: name,
    description: "Saved from FiiO Quick Control",
    globalGain: appState.globalGain,
    bands: []
  };
  fs.writeFileSync(filePath, JSON.stringify(presetData, null, 2));
  shell.showItemInFolder(filePath);
});

function createDesktopAndStartMenuShortcuts(notifyUser = false) {
  const exePath = app.getPath('exe');
  if (exePath.toLowerCase().endsWith('electron.exe')) return;

  const { exec } = require('child_process');
  const desktopLnk = path.join(app.getPath('desktop'), 'FiiO Control.lnk');
  const startMenuDir = path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs');
  const startMenuLnk = path.join(startMenuDir, 'FiiO Control.lnk');

  const script = `$ws = New-Object -ComObject WScript.Shell; $d = $ws.CreateShortcut('${desktopLnk.replace(/'/g, "''")}'); $d.TargetPath = '${exePath.replace(/'/g, "''")}'; $d.IconLocation = '${exePath.replace(/'/g, "''")},0'; $d.Description = 'FiiO Control Desktop - Portable by Rama-X2'; $d.Save(); $s = $ws.CreateShortcut('${startMenuLnk.replace(/'/g, "''")}'); $s.TargetPath = '${exePath.replace(/'/g, "''")}'; $s.IconLocation = '${exePath.replace(/'/g, "''")},0'; $s.Description = 'FiiO Control Desktop - Portable by Rama-X2'; $s.Save();`;

  exec(`powershell -NoProfile -Command "${script}"`, (err) => {
    if (!err) {
      console.log('[FiiO Main] Desktop and Start Menu shortcuts created successfully');
      if (notifyUser && tray) {
        tray.displayBalloon({
          icon: iconPath,
          title: 'FiiO Control',
          content: 'Shortcut FiiO Control berhasil dibuat di Desktop dan Start Menu!'
        });
      }
    } else {
      console.error('[FiiO Main] Failed to create shortcuts:', err);
    }
  });
}

// App Startup
app.whenReady().then(async () => {
  console.log('[FiiO Main] App starting...');

  // Start local embedded server for 100% offline assets
  localServer = new LocalServer({ port: serverPort, presetsDir });
  try {
    serverPort = await localServer.start();
  } catch (err) {
    console.error('[FiiO Main] Failed to start local server:', err);
  }

  createMainWindow();
  createQuickControlWindow();
  createTray();

  // Create shortcuts automatically on first launch
  setTimeout(() => {
    createDesktopAndStartMenuShortcuts(false);
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (localServer) {
    localServer.stop();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep running in tray
  }
});
