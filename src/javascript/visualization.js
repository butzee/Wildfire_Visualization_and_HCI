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

function fetchAndUpdate(sliderValue) {
  // Holt Daten und aktualisiert die Karte
 
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

const extent = map.getExtent();
map.setMaxExtent(extent);

map.on('click', function (e) {
  console.log(clusterLayer.identify(e.coordinate));
  //print count of markers in cluster with count property
  console.log(clusterLayer.getClusters());
  clusterLayer.getClusters().forEach(function(cluster) {
    //Sum of _radiuses of all markers in cluster
    console.log(cluster['children'].reduce(function (accumulator, currentValue) {
      return accumulator + currentValue._radius;
    }, 0));
    console.log(cluster['children'].length);
  });
});