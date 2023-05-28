let years = [];

function getYearsArray() {
  return years;
};

function fetchData(year, causeOptions, sizeOptions) {
    let dbRows;
    if (year == -1) {
      dbRows = window.api.getFiresForYear(causeOptions, sizeOptions);
    } else {
      dbRows = window.api.getFiresForDay(year, causeOptions, sizeOptions);
    }
    console.log("Nachher")
    return dbRows.then(rows => {
      return rows;
    })
    .catch(error => {
      console.error(error);
    });
}
  
function processRows(rows) {
    let geometries = [];
  
    rows.forEach(row => {
      geometries.push(new maptalks.Circle([row.LONGITUDE, row.LATITUDE], Math.sqrt((row.FIRE_SIZE * 4046.86) / Math.PI)));
    });
  
    return geometries;
}

const queryButton = document.getElementById('queryButton');


// Add an event listener to the button
queryButton.addEventListener('click', () => {
  console.log('Query button clicked');
  const year = document.querySelector('.dropdown-year').value;
  fetchData(year, causeOptions, sizeOptions)
    .then(rows => {
      years.push(rows);
    })
    .catch(error => {
      console.error(error);
    });
});

