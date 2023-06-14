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