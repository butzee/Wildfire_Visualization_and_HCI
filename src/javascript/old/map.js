 function createMap() {
  const map = new maptalks.Map('map', {
    center: [-98, 37],
    zoom: 4,
    minZoom: 3,
    maxZoom: 18,
    baseLayer: new maptalks.TileLayer('base', {
      'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
      'subdomains'  : ['a','b','c','d'],
      'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
      '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    })
  });

  const resizeButton = new ResizeButton();
  map.addControl(resizeButton);

  return map;
}
