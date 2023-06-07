var dbmgr = require('./dbmgr');
var db = dbmgr.db;

exports.getFires = (selectedYear, fireCause, fireSizeClass) => {
  const queries = [];
  let whereClause = getWhereClause(fireCause, fireSizeClass);
  let sqlStatement = `SELECT OBJECTID, DISCOVERY_DOY, CONT_DOY, FIRE_SIZE, FIRE_SIZE_CLASS, LONGITUDE, LATITUDE FROM Fires WHERE ${whereClause} FIRE_YEAR = `

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
    return results.map(result => result);//TODO: Reich return results aus?
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
};

function getWhereClause(fireCause, fireSizeClass) {
  let whereClause = '';
  if (fireCause.length > 0 && fireCause[0] !== '0') {
    whereClause += ` NWCG_GENERAL_CAUSE IN('${fireCause.join("','")}')`;
  }

  if (fireSizeClass.length > 0 && fireSizeClass[0] !== '-1') {
    if (whereClause.length > 4) {
      whereClause += ' AND';
    }
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
