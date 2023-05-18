var map = new maptalks.Map('map', {
    center: [-98, 37],
    zoom: 4,
    minZoom: 3,
    maxZoom: 18,
    baseLayer: new maptalks.TileLayer('base', {
      'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      'subdomains'  : ['a','b','c','d'],
      'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
      '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    })
  });

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
const options = {
    'position' : 'top-right'
};
ResizeButton.mergeOptions(options);

var center = map.getCenter();

var geometries = [[],[]];

// Create the clusterLayer and add it to the map
const clusterLayer = new maptalks.ClusterLayer('cluster', [], {
    'noClusterWithOneMarker' : true,
    'maxClusterZoom' : 9,
    symbol:{
        'markerType' : 'ellipse',
        'markerFill' : { property:'count', type:'interval', stops: [[0, '#fef001'], [100, '#ffce03'], [500, '#fd9a01'], [1000, '#fd6104'], [1500, '#ff2c05'],[2500, '#f00505']] },
        'markerFillOpacity' : 0.7,
        'markerLineOpacity' : 1,
        'markerLineWidth' : 2,
        'markerLineColor' : '#fff',
        'markerWidth' : { property:'count', type:'interval', stops: [[0, 40], [100, 60],[500, 60], [1000, 80], [2500, 100], [2500, 125]] },
        'markerHeight' : { property:'count', type:'interval', stops: [[0, 40], [100, 60],[500, 60], [1000, 80], [2500, 100], [2500, 125]] }
    },
    'drawClusterText': true,
    'geometryEvents' : true,
    'single': true
  });
  
// Function to update clustering options based on zoom level
function updateClusterOptions() {
    const currentZoom = map.getZoom();

    /* Check the currentZoom value and decide whether to enable clustering
    if (currentZoom >= 18) {
        clusterLayer.clear();
        clusterLayer.addGeometry(geometries[0]);
    } else {
        clusterLayer.setGeometries(geometries[0]);
    }
    */
}
  
// Listen for the zoomend event on the map
map.addEventListener('zoomend', updateClusterOptions);

fetchandupdate(0);
const slider = document.getElementById("rangeSlider");

slider.addEventListener("input", function(event) {
  sliderPosition = event.target.value;
  fetchandupdate(sliderPosition);
});

function removeFires() {
    geometries[0] = [];
    clusterLayer.clear();
}
function fetchandupdate(sliderValue) {
    // Clear existing geometries
    removeFires()
    // Call window.api.getShapes with the appropriate parameters based on the slider position
    window.api.getShapes(sliderValue)
      .then(rows => {
        rows.forEach(row => {
            geometries[0].push(new maptalks.Circle([row.LONGITUDE, row.LATITUDE], Math.sqrt((row.FIRE_SIZE * 4046.86) / Math.PI)));
        });
      
        // Update the clusterLayer with the new geometries

        clusterLayer.addGeometry(geometries[0]);
        map.addLayer(clusterLayer);

      })
       .catch(error => {
        console.error(error);
      });
  }

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

function onClick(e) {
  console.log(e.target);
  // Sum of _radiuses of all markers in cluster
  clusterLayer.getClusters().forEach(function(cluster) {
    console.log(cluster['children'].reduce(function (accumulator, currentValue) {
      return accumulator + currentValue._radius;
    }, 0));
  });
}

function fit_to_extend() {
    map.fitExtent(extent, 0);
    //testmgr.getShapes()
}

var resizeButton = new ResizeButton();
map.addControl(resizeButton);

class TextBanner extends maptalks.control.Control {
  buildOn(map) {
    var div = document.createElement('div');
    div.className = 'text-banner';
    div.textContent = 'Slider Value: ';

    var sliderValue = document.createElement('span');
    sliderValue.textContent = '1992';
    div.appendChild(sliderValue);

    // Update the slider value dynamically
    const updateSliderValue = () => {
      sliderValue.textContent = parseInt(document.getElementById('rangeSlider').value)+parseInt(1992);
    };

    // Listen for the 'input' event on the slider
    d3.select('#rangeSlider').on('input', function() {
      updateSliderValue();
      fetchandupdate(Number(this.value));
    });
    var myTimer;
    d3.select("#start").on("click", function() {
      clearInterval (myTimer);
      myTimer = setInterval (function() {
          var b= d3.select("#rangeSlider");
          var t = (+b.property("value") + 1) % (+b.property("max") + 1);
          if (t == 0) { 
            clearInterval (myTimer); 
            fetchandupdate(Number(1992));
          };
          b.property("value", t);
          updateSliderValue();
          fetchandupdate(parseInt(b.property("value")));
      }, 1000);
    });
    d3.select("#stop").on("click", function() {
      d3.select("#rangeSlider").property("value", 0);
      updateSliderValue();
      clearInterval (myTimer)
    });
    d3.select("#pause").on("click", function() {
      clearInterval (myTimer);
    });
    

    return div;
  }
}

const textBannerControl = new TextBanner({ position: 'top-middle' });
map.addControl(textBannerControl);

let year = -1;
let cause = -1;
let size = -1;

function filterBy(selector) {
    removeFires();
    if (selector.id === "year") {
        year = parseInt(selector.value)
    } else if (selector.id === "cause") {
        cause = selector.value
    } else {
        size = selector.value
    }
}