// Create a DeckGL layer
const deckglLayer = new maptalks.DeckGLLayer('kkkk', { 'zIndex': 1 }).addTo(map);

// Create a marker layer
const markerLayer = new maptalks.VectorLayer('marker', { 'zIndex': 9999 }).addTo(map);

// Define the cluster layer symbol properties
const clusterSymbol = {
    markerType: 'ellipse',
    markerFill: { property: 'count', type: 'interval', stops: [[0, '#fef001'], [100, '#ffce03'], [500, '#fd9a01'], [1000, '#fd6104'], [1500, '#ff2c05'], [2500, '#f00505']] },
    markerFillOpacity: 0.7,
    markerLineOpacity: 1,
    markerLineWidth: 2,
    markerLineColor: '#fff',
    markerWidth: { property: 'count', type: 'interval', stops: [[0, 40], [100, 60], [500, 60], [1000, 80], [2500, 100], [2500, 125]] },
    markerHeight: { property: 'count', type: 'interval', stops: [[0, 40], [100, 60], [500, 60], [1000, 80], [2500, 100], [2500, 125]] }
};

// Create the cluster layer with optimized options
const clusterLayer = new maptalks.ClusterLayer('cluster', [], {
    noClusterWithOneMarker: true,
    maxClusterZoom: 6,
    maxClusterRadius: 100,
    symbol: clusterSymbol,
    drawClusterText: true,
    geometryEvents: true,
    single: true
});