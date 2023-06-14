const path = require('path');
const electron = require('electron');

// Get the path to the database file
const dbFilePath = path.join(electron.app.getAppPath(), '..', 'data.sqlite');
console.log(dbFilePath)

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