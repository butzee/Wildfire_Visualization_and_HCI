const { contextBridge, ipcRenderer } = require('electron')
const testMgr = require('./models/testmgr')

const getShapes = (sliderValue) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('getShapesResponse', (event, arg) => {
      if (arg.error) {
        reject(arg.error);
      } else {
        resolve(arg.data);
      }
    });
    ipcRenderer.send('getShapes', sliderValue);
  });
};

contextBridge.exposeInMainWorld('api', {
  getShapes: getShapes
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

