const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const testMgr = require('../../models/testmgr');

async function getFiresHandler(event, params) {
  try {
    const loadedFires = await testMgr.getFires(params[0], params[1], params[2]);
    if (Number(params[0]) !== Number("-1")) {
      console.log("Loading fires for a year")
      let firesPerDay = Array.apply(null, Array(365)).map(function () {return [];})
      for (const fire of loadedFires[0]) {
          let found = fire.DISCOVERY_DOY;
          let contained;
          if (fire.CONT_DOY.length===0){ // If no CONT_DOY stored (value is empty string),
            contained = found; // then fire is contained the same day
          } else {
            contained = Number(fire.CONT_DOY); // CONT_DOY is stored as a string
          }
          for (let i = found; i <= contained; i++) {
            if (!firesPerDay[i-1]) {
              firesPerDay[i-1] = []; 
            }
            firesPerDay[i-1].push(fire);
          } 
      }
      console.log("Finished loading")
      return firesPerDay;
    } else {
      console.log("Loading fires all years")
      console.log("Finished loading")
      return loadedFires;
    }
  } catch (error) {
    console.log(error);
  }
}

// Create the browser window:
// Preload: Preload.js
// Open File: src/pages/map.html
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
        // Attaches script to Renderer Process
        preload: path.join(__dirname, './preload.js'),
        // Enables Node.js integration
        contextIsolation: true
    }
  })
  //win.removeMenu();
  // Handle Listerner for invoke call "ping" from Renderer Process
  // return "pong" to Renderer Process
  ipcMain.handle('ping', () => { return "pong";});

  // Handle Listerner for invoke call "getFires" from Renderer Process
  // return All Fires to Renderer Process
  ipcMain.handle('sql:getFires', getFiresHandler);

  // Load the map.html of the app
  win.loadFile('src/pages/index.html');
}

// Create the browser window when the app is ready
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
