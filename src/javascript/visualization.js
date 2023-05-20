const map = new maptalks.Map('map', {
  center: [-98, 37],
  zoom: 4,
  minZoom: 3,
  maxZoom: 18,
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate': 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    'subdomains': ['a', 'b', 'c', 'd'],
    'attribution': '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>'
  })
});

let geometries = [];

const clusterLayer = createClusterLayer();

function removeFires() {
  // Entfernt alle Feuergeometrien
  geometries = [];
  clusterLayer.clear();
}

function fetchAndUpdate(sliderValue) {
  // Holt Daten und aktualisiert die Karte
  removeFires();
 
  const causeOptions = Array.from(document.querySelectorAll('#causeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
    return checkbox.value;
  });

  const sizeOptions = Array.from(document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
    return checkbox.value;
  });

  const year = document.querySelector('.dropdown-year').value;

  fetchData(sliderValue, year, causeOptions, sizeOptions)
    .then(rows => {
      geometries = processRows(rows);
      updateClusters(clusterLayer, map, geometries);
    })
    .catch(error => {
      console.error(error);
    });
}

map.addEventListener('zoomend', () => {
  // Aktualisiert die Cluster beim Zoomen der Karte
  updateClusters(clusterLayer, map, geometries);
});

fetchAndUpdate(0);
