const path = require('path');
const electron = require('electron');

// Get the path to the database file
const appPath = electron.app.getAppPath();
var dbFilePath = '';

if(appPath.includes('app.asar')) {
    // If the app is packaged
    dbFilePath = path.join(appPath, '..', 'data.sqlite');
} else {
    // If the app is not packaged
    dbFilePath = path.join(appPath, 'data.sqlite');
}

// Connecting to SQLite Database
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

exports.db = db;