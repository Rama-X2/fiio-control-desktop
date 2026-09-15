const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fiioDesktopBridge', {
  notifyDeviceConnected: (deviceName) => {
    ipcRenderer.send('device-connected', deviceName);
  },
  notifyDeviceDisconnected: () => {
    ipcRenderer.send('device-disconnected');
  },
  savePresetLocal: async (presetData) => {
    return await ipcRenderer.invoke('save-preset-local', presetData);
  },
  loadPresetsLocal: async () => {
    return await ipcRenderer.invoke('load-presets-local');
  },
  openQuickControl: () => {
    ipcRenderer.send('toggle-quick-control');
  },
  onQuickControlAction: (callback) => {
    ipcRenderer.on('quick-control-action', (event, action, payload) => {
      callback(action, payload);
    });
  }
});
