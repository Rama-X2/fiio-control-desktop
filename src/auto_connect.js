// FiiO Control Desktop Auto-Connect & Local Storage Engine
// Author: Rama Armytha (Rama-X2) - https://github.com/Rama-X2

(function() {
  console.log('[FiiO Desktop Bridge] Auto-Connect Engine Initialized');

  let connectAttempts = 0;
  const maxAttempts = 15;
  let isConnected = false;

  function attemptAutoConnect() {
    if (isConnected) return;

    // Check if device is already connected by looking at header or URL
    const headerDevice = document.querySelector('.header-right, .device-name, .header-title');
    if (headerDevice && (headerDevice.textContent.includes('JA11') || headerDevice.textContent.includes('KA17') || headerDevice.textContent.includes('FiiO'))) {
      isConnected = true;
      console.log('[FiiO Desktop Bridge] Device already connected:', headerDevice.textContent);
      if (window.fiioDesktopBridge) {
        window.fiioDesktopBridge.notifyDeviceConnected(headerDevice.textContent.trim());
      }
      return;
    }

    // 1. Look for "Connect device" button on welcome screen
    const buttons = Array.from(document.querySelectorAll('button, .el-button'));
    const connectBtn = buttons.find(b => {
      const txt = (b.textContent || '').trim().toLowerCase();
      return txt === 'connect device' || txt === 'connect' || txt === '连接设备' || txt === '连接';
    });

    if (connectBtn) {
      console.log('[FiiO Desktop Bridge] Found connect button, triggering auto-connect...');
      connectBtn.click();

      // After clicking, check if modal opens with "Connect" action
      setTimeout(() => {
        const modalButtons = Array.from(document.querySelectorAll('.el-dialog button, .el-dialog .el-button, .dialog-footer button'));
        const modalConnect = modalButtons.find(b => {
          const txt = (b.textContent || '').trim().toLowerCase();
          return txt === 'connect' || txt === '确定' || txt === '连接';
        });

        if (modalConnect) {
          console.log('[FiiO Desktop Bridge] Confirming connect dialog...');
          modalConnect.click();
        }
      }, 300);
    } else {
      // If we are on welcome page or device list, retry
      connectAttempts++;
      if (connectAttempts < maxAttempts) {
        setTimeout(attemptAutoConnect, 600);
      }
    }
  }

  // Monitor DOM for device connection changes & update Electron Tray / Quick Control
  const observer = new MutationObserver(() => {
    // Check if device name appears in header
    const rightHeader = document.querySelector('.header-right, span.header-device-name');
    if (rightHeader) {
      const text = rightHeader.textContent.trim();
      if (text && text.length > 2 && text !== 'Connect Device' && text !== 'Login') {
        if (!isConnected || window._lastConnectedDevice !== text) {
          isConnected = true;
          window._lastConnectedDevice = text;
          console.log('[FiiO Desktop Bridge] Connected device detected:', text);
          if (window.fiioDesktopBridge) {
            window.fiioDesktopBridge.notifyDeviceConnected(text);
          }
        }
      }
    }

    // Auto-dismiss or hide web-only prompts (like browser compatibility notes)
    const browserWarnings = document.querySelectorAll('.browser-warning, .unsupported-browser');
    browserWarnings.forEach(el => el.style.display = 'none');
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Listen for USB device plug-in events to trigger auto-reconnect
  if (navigator.hid) {
    navigator.hid.addEventListener('connect', (event) => {
      console.log('[FiiO Desktop Bridge] USB HID Device plugged in:', event.device.productName);
      isConnected = false;
      connectAttempts = 0;
      setTimeout(attemptAutoConnect, 500);
    });

    navigator.hid.addEventListener('disconnect', (event) => {
      console.log('[FiiO Desktop Bridge] USB HID Device unplugged:', event.device.productName);
      isConnected = false;
      if (window.fiioDesktopBridge) {
        window.fiioDesktopBridge.notifyDeviceDisconnected();
      }
    });
  }

  // Start auto-connection sequence
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(attemptAutoConnect, 800));
  } else {
    setTimeout(attemptAutoConnect, 800);
  }

  // Expose global manual trigger
  window.fiioDesktopConnect = function() {
    isConnected = false;
    connectAttempts = 0;
    attemptAutoConnect();
  };

})();
