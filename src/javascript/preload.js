const { contextBridge, ipcRenderer } = require('electron');

// Bridge different process types together
// Exposes global Methods to the Renderer Process via global variable called "api"
const infomethode = () => {
  return "info";
}

const getFires = (param1, param2, param3 ) => {
  console.log("Info: "+param1+" "+param2+" "+param3);
  return ipcRenderer.invoke('sql:getFires', [param1, param2, param3]);
}

const displayFireyear = (param) => {
  return ipcRenderer.invoke('layer:firesOfYear', param);
}

const pingmethode = () => {
  return ipcRenderer.invoke('ping');
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// Send Messages to Main and reseive messaages from main
contextBridge.exposeInMainWorld('electronAPI', {
  info: infomethode,
  ping: pingmethode,
  getFires: getFires,
  displayFireyear: displayFireyear
});