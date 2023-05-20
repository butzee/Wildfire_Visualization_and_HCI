function createClusterLayer() {
    const clusterLayer = new maptalks.ClusterLayer('cluster', [], {
        'noClusterWithOneMarker': true,
        'maxClusterZoom': 9,
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
    });
  
    return clusterLayer;
}
  
function updateClusters(clusterLayer, map, geometries) {
    geometries[0] = [];
    clusterLayer.clear();
    clusterLayer.addGeometry(geometries);
    map.addLayer(clusterLayer);
}
  