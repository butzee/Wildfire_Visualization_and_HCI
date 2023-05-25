function fetchData(sliderValue, year, causeOptions, sizeOptions) {
    let dbRows;
    const start = performance.now();
    if (year == -1) {
      // Parameters:
      // sliderValue: current year
      // fireCause: cause of fire
      // fireSizeClass: size of fire
      dbRows = window.api.getFiresForYear(sliderValue, causeOptions, sizeOptions);
    } else {
      // Parameters:
      // sliderValue: day of year
      // year: year
      // fireCause: cause of fire
      // fireSizeClass: size of fire
      dbRows = window.api.getFiresForDay(sliderValue, year, causeOptions, sizeOptions);
    }
  
    return dbRows.then(rows => {
      const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
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