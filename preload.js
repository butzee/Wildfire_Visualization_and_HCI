const { contextBridge, ipcRenderer } = require('electron');

// Bridge different process types together
// Exposes global Methods to the Renderer Process via global variable called "api"
const infomethode = () => {
  return "info";
}

const getAllFires = (param1, param2 ) => {
  return ipcRenderer.invoke('sql:getAllFires', [param1, param2]);
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
  //getFiresForYear: getFiresForYear,
  //getFiresForDay: getFiresForDay,
  info: infomethode,
  ping: pingmethode,
  getAllFires: getAllFires,
  displayFireyear: displayFireyear
});


// Funktion zum Abrufen von Feuer für ein bestimmtes Jahr
/*
const getFiresForYear = (fireCause, fireSizeClass) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getFiresResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getFiresForYear', fireCause, fireSizeClass);
  });
};

// Funktion zum Abrufen von Feuer für einen bestimmten Tag
const getFiresForDay = (year, fireCause, fireSizeClass) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getFiresResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getFiresForDay', year, fireCause, fireSizeClass);
  });
};
*/
