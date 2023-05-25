// Connecting to SQLite Database
const db = require('better-sqlite3')('./data.sqlite', {verbose:console.log})


/*let db = new sqlite3.Database('./data.sqlite', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});*/

exports.db = db;