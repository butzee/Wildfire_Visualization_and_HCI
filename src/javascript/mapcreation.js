var scatter = new Boolean(true);  // true = scatterplot, false = cluster

// Map creation and utilities
const layerTemplates = [
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
  ];
  const n_templates = layerTemplates.length;
  let nextMapIdx = 1;
  
  function createMap() {
    const map = new maptalks.Map('map', {
      center: [-98, 37],
      zoom: 4,
      minZoom: 4,
      maxZoom: 18,
      baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c'],
          attribution: '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '
              + '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      })
    });
    map.setMaxExtent(map.getExtent());
    return map;
  }
  
  const map = createMap();
  const maxExtend = map.getExtent();

map.on('click', function (e) {
  console.log(clusterLayer.identify(e.coordinate));
});


  // For Scatterplot
  const deckglLayer = new maptalks.DeckGLLayer('kkkk', {'zIndex': 1 }).addTo(map);
  const markerLayer  = new maptalks.VectorLayer('marker', {'zIndex': 9999}).addTo(map);

  // For Cluster
  const clusterLayer = new maptalks.ClusterLayer('cluster', [], {
    'noClusterWithOneMarker': true,
    'maxClusterZoom': 6,
    'maxClusterRadius': 100,
    symbol: {
        'markerType': 'ellipse',
        'markerFill': { property: 'count', type: 'interval', stops: [[0, '#fef001'], [100, '#ffce03'], [500, '#fd9a01'], [1000, '#fd6104'], [1500, '#ff2c05'], [2500, '#f00505']] },
        'markerFillOpacity': 0.7,
        'markerLineOpacity': 1,
        'markerLineWidth': 2,
        'markerLineColor': '#fff',
        'markerWidth': { property: 'count', type: 'interval', stops: [[0, 40], [100, 60], [500, 60], [1000, 80], [2500, 100], [2500, 125]] },
        'markerHeight': { property: 'count', type: 'interval', stops: [[0, 40], [100, 60], [500, 60], [1000, 80], [2500, 100], [2500, 125]] }
    },
    'drawClusterText': true,
    'geometryEvents': true,
    'single': true
})

function changeDisplayType() {
  var button = document.getElementById("displayType");
  if (!button.classList.contains('disabled')) {
    scatter = !scatter;
    map.removeLayer(scatter ? clusterLayer : [deckglLayer, markerLayer]);
    map.addLayer(scatter ? [deckglLayer, markerLayer] : clusterLayer);
    scatter ? updateScatter(document.getElementById('rangeSlider').value) : updateCluster(document.getElementById('rangeSlider').value);
    scatter ? document.getElementById("display").innerHTML = "join" : document.getElementById("display").innerHTML = "scatter_plot";
  }
}

  // Controls
  class DateDisplay extends maptalks.control.Control {
    buildOn() {
      const div = maptalks.DomUtil.createEl("div");
      div.id = "current-year";
      div.innerHTML = "Current year: 1992";
      return div;
    }
  }
  
  DateDisplay.mergeOptions({
    position: 'top-left',
  });
  
  const dateDisplay = new DateDisplay();
  map.addControl(dateDisplay);
  
  // Other Functions and Utilities
  function resizeMap() {
    map.fitExtent(maxExtend, 0);
  }
  
  function changeMapType() {
    const newBaseLayer = new maptalks.TileLayer('base', {
      'urlTemplate' : layerTemplates[nextMapIdx++ % n_templates],
      'subdomains'  : ['a','b','c'],
      'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
      '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    });
    map.setBaseLayer(newBaseLayer);
  }