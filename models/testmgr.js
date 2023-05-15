var dbmgr = require('./dbmgr');
var db = dbmgr.db;


// return all fetched rows
exports.getShapes = (sliderValue) => {
    var year;
    if (sliderValue == NaN || sliderValue == undefined || sliderValue == null || sliderValue == 0) {
      year = parseInt(1992);
    } else {
      year = parseInt(1992) + parseInt(sliderValue);
    }
    return new Promise((resolve, reject) => {
      fetchDataFromDatabase("SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, LONGITUDE, LATITUDE FROM Fires WHERE FIRE_YEAR='"+year+"' LIMIT 10000")
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