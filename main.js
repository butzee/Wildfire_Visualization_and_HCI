const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const testMgr = require('./models/testmgr');

async function getAllFiresHandler(event, params) {
  try {
    const rows = await testMgr.getFiresForYear(params[0], params[1]);
    console.log("Finished loading")
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// Create the browser window:
// Preload: Preload.js
// Open File: src/pages/map.html
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1900,
    height: 600,
    webPreferences: {
        // Attaches script to Renderer Process
        preload: path.join(__dirname, './preload.js'),
        // Enables Node.js integration
        contextIsolation: true
    }
  })
  // Handle Listerner for invoke call "ping" from Renderer Process
  // return "pong" to Renderer Process
  ipcMain.handle('ping', () => { return "pong";});

  // Handle Listerner for invoke call "getAllFires" from Renderer Process
  // return All Fires to Renderer Process
  ipcMain.handle('sql:getAllFires', getAllFiresHandler);

  // Load the map.html of the app
  win.loadFile('src/pages/map.html');
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


ipcMain.on('getFiresForYear', async (event, fireCause, fireSizeClass) => {
  try {
    console.log("ipcMain.on('getFiresForYear");
    const rows = await testMgr.getFiresForYear(fireCause, fireSizeClass);
    event.reply('getFiresResponse', { data: rows });
  } catch (error) {
    event.reply('getFiresResponse', { error: error.message });
  }
});

/*
ipcMain.on('getFiresForDay', async (event, year, fireCause, fireSizeClass) => {
  try {
    const rows = await testMgr.getFiresForDay(year, fireCause, fireSizeClass);
    event.reply('getFiresResponse', { data: rows });
  } catch (error) {
    event.reply('getFiresResponse', { error: error.message });
  }
});

ipcMain.handle('executeQuery', async (event, query) => {
  try {
    const rows = await testMgr.executeQuery(query);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}
);
*/