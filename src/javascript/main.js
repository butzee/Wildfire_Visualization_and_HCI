const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const testMgr = require('../models/testmgr');

// Asynchronously retrieves fire data based on the provided parameters
async function getFiresHandler(event, params) {
    try {
        // Call the testMgr.getFires() function to fetch the fires based on the parameters
        const loadedFires = await testMgr.getFires(params[0], params[1], params[2]);

        // Check if the selected year is not "-1"
        if (Number(params[0]) !== Number("-1")) {
            console.log("Loading fires for a year");

            // Initialize an array to store fires per day
            let firesPerDay = Array.apply(null, Array(365)).map(function () {
                return [];
            });

            // Process each loaded fire and assign it to the corresponding day(s)
            for (const fire of loadedFires[0]) {
                let found = fire.DISCOVERY_DOY;
                let contained;
                if (fire.CONT_DOY.length === 0) {
                    contained = found;
                } else {
                    contained = Number(fire.CONT_DOY);
                }
                for (let i = found; i <= contained; i++) {
                    if (!firesPerDay[i - 1]) {
                        firesPerDay[i - 1] = [];
                    }
                    firesPerDay[i - 1].push(fire);
                }
            }

            console.log("Finished loading");
            return firesPerDay;
        } else {
            console.log("Loading fires for all years");
            console.log("Finished loading");
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
        width: 1500,
        height: 800,
        'minWidth': 1500,
        'minHeight': 800,
        'maxWidth': 1500,
        'maxHeight': 800,
        icon: __dirname + '/assets/fire.ico',
        webPreferences: {
            // Attaches script to Renderer Process
            preload: path.join(__dirname, './preload.js'),
            // Enables Node.js integration
            contextIsolation: true
        }
    })
    //win.removeMenu();

    // Handle Listerner for invoke call "getFires" from Renderer Process
    // return All Fires to Renderer Process
    ipcMain.handle('sql:getFires', getFiresHandler);

    // Load the map.html of the app
    win.loadFile('src/pages/home.html');
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
