const options = {
    'position' : 'top-right'
};

class ResizeButton extends maptalks.control.Control {
buildOn(map) {
  var dom = maptalks.DomUtil.createEl("button");
  dom.className = "btn-controls";
  dom.onclick = fit_to_extend;
  var span = maptalks.DomUtil.createEl("span");
  span.className = "material-symbols-rounded";
  span.textContent = "resize";
  dom.appendChild(span);
  return dom;
}
}
//<button style="position:absolute;top:80px;right:10px" onClick="fit_to_extend()"
//                   className="btn-controls">
  //    <span className="material-symbols-rounded">resize</span>
//</button>
ResizeButton.mergeOptions(options);

var map = new maptalks.Map('map', {
  center: [-98, 37],
  zoom: 4.4,
  minZoom : 4.4,
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    'subdomains'  : ['a','b','c','d'],
    'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
    '&copy; <a href="https://carto.com/attributions">CARTO</a>'
  })
});

const extent = map.getExtent();
map.setMaxExtent(extent);

function fit_to_extend() {
    map.fitExtent(extent, 0);
    //testmgr.getShapes()
}

var resizeButton = new ResizeButton();
map.addControl(resizeButton);