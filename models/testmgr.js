var dbmgr = require('./dbmgr');
var db = dbmgr.db;

exports.getFiresForYear = (fireCause, fireSizeClass) => {
  const queries = [];
  const validFireSizeClasses = ['C', 'D', 'E', 'F', 'G'];
  let whereClause = '';

  // Wenn keine Ursache ausgewählt wurde, wird die Abfrage nicht eingeschränkt
  for (let year = 1992; year <= 2020; year++) {
    // Einer oder andere Bedingung
    if (fireCause[0] !== '0' || fireSizeClass[0] !== '-1') {
      whereClause = ' AND';
    }
    
    if (fireCause.length > 0 && fireCause[0] !== '0') {
      whereClause += ` NWCG_GENERAL_CAUSE IN('`;
      for(let i = 0; i < fireCause.length; i++) {
        whereClause += fireCause[i];
      }
      whereClause += `')`;
    }

    if (fireSizeClass.length > 0 && fireSizeClass[0] !== '-1') {
      if (whereClause.length > 4) {
        whereClause += ' AND';
      }
      whereClause += ` FIRE_SIZE_CLASS IN('`;
      for(let i = 0; i < fireSizeClass.length; i++) {
        whereClause += fireSizeClass[i];
      }
      whereClause += `')`;
    }

    //const sqlStatement = `SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires WHERE FIRE_YEAR = ${year} ${whereClause}`
    const sqlStatement = `SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires WHERE FIRE_YEAR = ${year};
    
    // FIRE_SIZE_CLASS IN('${validFireSizeClasses.join("','")}')`;
    queries.push(fetchDataFromDatabase(sqlStatement));
  }
  return Promise.all(queries)
  .then(results => {
    return results.map(result => result);
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
};

// Funktion, um Formen für einen bestimmten Tag abzurufen
// Parameter:
// - sliderValue: aktueller Tag
// - year: Jahr des Feuers
// - fireCause: Ursache des Feuers
// - fireSizeClass: Größe des Feuers
exports.getFiresForDay = (sliderValue, year, fireCause, fireSizeClass) => {
  let day;

  // Überprüfen, ob sliderValue gültig ist, andernfalls den Standardwert 1 setzen
  if (isNaN(sliderValue) || sliderValue == undefined || sliderValue == null || sliderValue == 0) {
    day = 1;
  } else {
    day = 1 + parseInt(sliderValue);
  }

  year = year + 1992;

  // SQL-Abfrage für die Formen an einem bestimmten Tag
  const sql = "SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires " +
    "WHERE FIRE_YEAR='" + year + "' AND (DISCOVERY_DOY < " + day + " AND CONT_DOY > " + day + ") LIMIT 10000";

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

// Funktion zum Abrufen von Daten aus der Datenbank
function fetchDataFromDatabase(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err); // Promise ablehnen, wenn ein Fehler auftritt
      } else {
        resolve(rows); // Promise mit den abgerufenen Zeilen auflösen
      }
    });
  });
}
