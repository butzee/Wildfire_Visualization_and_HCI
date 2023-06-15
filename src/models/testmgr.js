var dbmgr = require('./dbmgr');
var db = dbmgr.db;

exports.getFires = (selectedYear, fireCause, fireSizeClass) => {
  const queries = [];
  let whereClause = getWhereClause(fireCause, fireSizeClass);
  let sqlStatement = `SELECT OBJECTID, NWCG_REPORTING_UNIT_NAME, FIRE_NAME, DISCOVERY_DATE, DISCOVERY_DOY, NWCG_CAUSE_CLASSIFICATION, NWCG_GENERAL_CAUSE, CONT_DATE, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE, STATE FROM Fires WHERE ${whereClause} FIRE_YEAR = `
  console.log(sqlStatement);
  if (Number(selectedYear[0]) !== Number("-1")) {
    sqlStatement += `${Number(selectedYear[0])}`;
    queries.push(fetchDataFromDatabase(sqlStatement));
  } else {
    for (let year = 1992; year <= 2020; year++) {
      queries.push(fetchDataFromDatabase(sqlStatement+`${year}`));
    }
  }

  console.log(sqlStatement)
  return Promise.all(queries)
  .then(results => {
    return results.map(result => result);
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
};

function getWhereClause(fireCause, fireSizeClass) {
  let whereClause = '';
  if (fireCause[0] !== '-1') {
    whereClause += ` NWCG_GENERAL_CAUSE IN('${fireCause.join("','")}')`;
    whereClause += ' AND';
  }

  if (fireSizeClass[0] !== '-1') {
    whereClause += ` FIRE_SIZE_CLASS IN('${fireSizeClass.join("','")}')`;
    whereClause += ' AND';
  }
  return whereClause;
}

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
