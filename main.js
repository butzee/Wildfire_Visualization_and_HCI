const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const testMgr = require('./models/testmgr');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js')
    }
  })

  win.loadFile('src/pages/task.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('getShapes', async (event, sliderValue) => {
  try {
    const rows = await testMgr.getShapes(sliderValue);
    event.reply('getShapesResponse', { data: rows });
  } catch (error) {
    event.reply('getShapesResponse', { error: error.message });
  }
});
