const { contextBridge, ipcRenderer } = require('electron');

// Bridge different process types together
// Exposes global Methods to the Renderer Process via global variable called "api"
const getFires = (param1, param2, param3 ) => {
  return ipcRenderer.invoke('sql:getFires', [param1, param2, param3]);
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// Send Messages to Main and reseive messaages from main
contextBridge.exposeInMainWorld('electronAPI', {
  getFires: getFires,
});