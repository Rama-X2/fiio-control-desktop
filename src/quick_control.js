// FiiO Quick Control Flyout Controller
// Author: Rama Armytha (Rama-X2) - https://github.com/Rama-X2

const { ipcRenderer } = require('electron');

const elDeviceName = document.getElementById('deviceName');
const elStatusDot = document.getElementById('statusDot');
const elStatusText = document.getElementById('statusText');
const elBtnReconnect = document.getElementById('btnReconnect');
const elToggleEq = document.getElementById('toggleEq');
const elEqStateDesc = document.getElementById('eqStateDesc');
const elPresetDropdown = document.getElementById('presetDropdown');
const elActivePresetBadge = document.getElementById('activePresetBadge');
const elGainSlider = document.getElementById('gainSlider');
const elGainValue = document.getElementById('gainValue');
const elBtnOpenMain = document.getElementById('btnOpenMain');
const elBtnCloseFlyout = document.getElementById('btnCloseFlyout');
const elBtnFullStudio = document.getElementById('btnFullStudio');
const elLinkSavePreset = document.getElementById('linkSavePreset');
const elLinkOpenFolder = document.getElementById('linkOpenFolder');
const pills = document.querySelectorAll('.pill');

// Update UI from device state
ipcRenderer.on('sync-device-state', (event, state) => {
  if (state.device && state.device !== 'Scanning...') {
    elDeviceName.textContent = state.device;
    elStatusDot.className = 'status-dot online';
    elStatusText.textContent = 'Connected';
  } else {
    elDeviceName.textContent = 'No DAC Detected';
    elStatusDot.className = 'status-dot';
    elStatusText.textContent = 'Scanning...';
  }

  if (state.preset) {
    elActivePresetBadge.textContent = state.presetName || state.preset;
    elPresetDropdown.value = state.preset;
    updatePillSelection(state.preset);
  }

  if (state.eqEnabled !== undefined) {
    elToggleEq.checked = state.eqEnabled;
    elEqStateDesc.textContent = state.eqEnabled ? 'DSP Active' : 'Bypassed';
    elEqStateDesc.style.color = state.eqEnabled ? '#00e676' : '#8e8e93';
  }

  if (state.globalGain !== undefined) {
    elGainSlider.value = state.globalGain;
    elGainValue.textContent = (state.globalGain > 0 ? '+' : '') + Number(state.globalGain).toFixed(1) + ' dB';
  }
});

function updatePillSelection(presetId) {
  pills.forEach(pill => {
    if (pill.dataset.preset === presetId) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

// Preset selection handler
elPresetDropdown.addEventListener('change', (e) => {
  const selected = e.target.value;
  const optName = e.target.options[e.target.selectedIndex].text;
  elActivePresetBadge.textContent = optName;
  updatePillSelection(selected);
  ipcRenderer.send('quick-control-change-preset', { id: selected, name: optName });
});

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    const presetId = pill.dataset.preset;
    elPresetDropdown.value = presetId;
    elActivePresetBadge.textContent = pill.textContent;
    updatePillSelection(presetId);
    ipcRenderer.send('quick-control-change-preset', { id: presetId, name: pill.textContent });
  });
});

// EQ Toggle switch
elToggleEq.addEventListener('change', (e) => {
  const enabled = e.target.checked;
  elEqStateDesc.textContent = enabled ? 'DSP Active' : 'Bypassed';
  elEqStateDesc.style.color = enabled ? '#00e676' : '#8e8e93';
  ipcRenderer.send('quick-control-toggle-eq', enabled);
});

// Gain Slider
elGainSlider.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  elGainValue.textContent = (val > 0 ? '+' : '') + val.toFixed(1) + ' dB';
  ipcRenderer.send('quick-control-change-gain', val);
});

// Reconnect button
elBtnReconnect.addEventListener('click', () => {
  elStatusText.textContent = 'Reconnecting...';
  ipcRenderer.send('quick-control-reconnect');
});

// Window controls
elBtnOpenMain.addEventListener('click', () => {
  ipcRenderer.send('show-main-window');
});

elBtnFullStudio.addEventListener('click', () => {
  ipcRenderer.send('show-main-window');
});

elBtnCloseFlyout.addEventListener('click', () => {
  ipcRenderer.send('hide-quick-control');
});

// Links
elLinkOpenFolder.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-presets-folder');
});

elLinkSavePreset.addEventListener('click', (e) => {
  e.preventDefault();
  const name = prompt('Enter name for the new preset:');
  if (name && name.trim()) {
    ipcRenderer.send('save-current-preset-prompt', name.trim());
  }
});
