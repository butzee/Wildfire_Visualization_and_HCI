var scatter = new Boolean(true);  // true = scatterplot, false = cluster

function changePage(event, href) {        
    event.preventDefault(); // Prevent the page from changing immediately
    const elementsToMoveOut = document.querySelectorAll(
      "#map, #map-controls, #bottombar, .topbar"
    );
    elementsToMoveOut.forEach((element) => {
      element.style.opacity = '0';
    });
    const main = document.querySelector(".main");
    main.addEventListener("transitionend", () => {
      window.location.href = href
    });
  }

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
  scatter = !scatter;
  map.removeLayer(scatter ? clusterLayer : [deckglLayer, markerLayer]);
  map.addLayer(scatter ? [deckglLayer, markerLayer] : clusterLayer);
  scatter ? updateScatter(document.getElementById('rangeSlider').value) : updateCluster(document.getElementById('rangeSlider').value);
  scatter ? document.getElementById("display").innerHTML = "scatter_plot" : document.getElementById("display").innerHTML = "circles";
}