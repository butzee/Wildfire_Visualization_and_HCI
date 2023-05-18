var dbmgr = require('./dbmgr');
var db = dbmgr.db;


// return all fetched rows
exports.getShapes = (sliderValue, fireCause, fireSizeClass) => {
    var year;
    if (sliderValue == NaN || sliderValue == undefined || sliderValue == null || sliderValue == 0) {
      year = 1992;
    } else {
      year = 1992 + parseInt(sliderValue);
    }
    let sql = "SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires " +
            "WHERE FIRE_YEAR='" + year + "' AND FIRE_SIZE_CLASS='"+fireSizeClass+"' LIMIT 10000"
    if (fireSizeClass === "-1" || fireSizeClass === undefined ) {
         sql = "SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires " +
            "WHERE FIRE_YEAR='" + year + "' LIMIT 10000"
    }
    console.log(sql)
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