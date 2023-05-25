var dbmgr = require('./dbmgr');
var db = dbmgr.db;

const ALL_FIRES= `'C','D','E','F','G'`;

// Funktion, um Formen für ein bestimmtes Jahr abzurufen
// Parameter:
// - sliderValue: aktuelles Jahr
// - fireCause: Ursache des Feuers
// - fireSizeClass: Größe des Feuers
exports.getFiresForYear = (sliderValue, fireCause, fireSizeClass) => {
  let year;

  // Überprüfen, ob sliderValue gültig ist, andernfalls den Standardwert 1992 setzen
  if (isNaN(sliderValue) || sliderValue == undefined || sliderValue == null || sliderValue == 0) {
    year = 1992;
  } else {
    year = 1992 + parseInt(sliderValue);
  }

  let whereClause = '';

  // Bedingung für sliderValue hinzufügen
  whereClause += ` WHERE FIRE_YEAR = '${year}'`;

  // Bedingung für fireCause hinzufügen, wenn die Array-Länge größer als 0 ist und der erste Eintrag nicht '0' ist. Steht für "Alle Ursachen"
  if (fireCause.length > 0 && fireCause[0] !== '0') {
    whereClause += ` AND NWCG_GENERAL_CAUSE IN('${fireCause.join("','")}')`;
  }

  // Bedingungen für fireSizeClass hinzufügen, wenn die Array-Länge größer als 0 ist und der erste Eintrag nicht '-1' ist. Steht für "Alle Größen"
  if (fireSizeClass.length > 0 && fireSizeClass[0] !== '-1') {
    whereClause += ` AND FIRE_SIZE_CLASS IN('${fireSizeClass.join("','")}')`;
  } else {
    whereClause += ` AND FIRE_SIZE_CLASS IN(${ALL_FIRES})`;
  }

  // Die whereClause in der SQL-Abfrage verwenden
  const sqlStatement = `SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires ${whereClause}`;

  return new Promise((resolve, reject) => {
    fetchDataFromDatabase(sqlStatement)
      .then(rows => {
        resolve(rows);
      })
      .catch(error => {
        reject(error);
      });
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
    resolve(db.prepare(sql).all());
  });
}