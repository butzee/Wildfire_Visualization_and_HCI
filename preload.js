const { contextBridge, ipcRenderer } = require('electron')
const testMgr = require('./models/testmgr')

const getShapesForYear = (sliderValue, fireCause, fireSizeClass) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getShapesResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getShapesForYear', sliderValue, fireCause, fireSizeClass);
  });
};

const getShapesForDay = (sliderValue, year, fireCause, fireSizeClass) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getShapesResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getShapesForDay', sliderValue, year, fireCause, fireSizeClass);
  });
};

contextBridge.exposeInMainWorld('api', {
  getShapesForYear: getShapesForYear,
  getShapesForDay: getShapesForDay
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
})

