var dbmgr = require('./dbmgr');
var db = dbmgr.db;


// return all fetched rows
exports.getShapesForYear = (sliderValue, fireCause, fireSizeClass) => {
    let year;
    if (sliderValue == NaN || sliderValue == undefined || sliderValue == null || sliderValue == 0) {
      year = 1992;
    } else {
      year = 1992 + parseInt(sliderValue);
    }
    const sql = "SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires " +
        "WHERE FIRE_YEAR='" + year + "' LIMIT 10000"
    return new Promise((resolve, reject) => {
      fetchDataFromDatabase(sql)
        .then(rows => {
          resolve(rows);
        })
        .catch(error => {
          reject(error);
        });
    });
};

exports.getShapesForDay = (sliderValue, year, fireCause, fireSizeClass) => {
    let day;
    if (sliderValue == NaN || sliderValue == undefined || sliderValue == null || sliderValue == 0) {
      day = 1;
    } else {
      day = 1 + parseInt(sliderValue);
    }
    year = year+1992;
    const sql = "SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires " +
        "WHERE FIRE_YEAR='" + year + "' AND (DISCOVERY_DOY < " + day + " AND CONT_DOY > " + day + ") LIMIT 10000"
    return new Promise((resolve, reject) => {
      fetchDataFromDatabase(sql)
        .then(rows => {
          resolve(rows);
        })
        .catch(error => {
          reject(error);
        });
    });
};

function fetchDataFromDatabase(sql) {
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err); // Reject the Promise if there's an error
        } else {
          resolve(rows); // Resolve the Promise with the fetched rows
        }
      });
    });
  }