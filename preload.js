const { contextBridge, ipcRenderer } = require('electron');
const testMgr = require('./models/testmgr');

// Funktion zum Abrufen von Feuer für ein bestimmtes Jahr
const getFiresForYear = (sliderValue, fireCause, fireSizeClass) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getFiresResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getFiresForYear', sliderValue, fireCause, fireSizeClass);
  });
};

// Funktion zum Abrufen von Feuer für einen bestimmten Tag
const getFiresForDay = (sliderValue, year, fireCause, fireSizeClass) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getFiresResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getFiresForDay', sliderValue, year, fireCause, fireSizeClass);
  });
};

// Brücke zur Hauptwelt, um Funktionen und Objekte zugänglich zu machen
contextBridge.exposeInMainWorld('api', {
  getFiresForYear: getFiresForYear,
  getFiresForDay: getFiresForDay
});