var map = new maptalks.Map('map', {
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

let center = map.getCenter();

let geometries = [[],[]];

let year = -1 // start with all years

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

fetchAndUpdate(0);

function removeFires() {
    geometries[0] = [];
    clusterLayer.clear();
}

function getSelectedOptions(causeOptions) {
    let causes = []
    for (let i = 0, iLen = causeOptions.length; i < iLen; i++) {
        let opt = causeOptions[i];

        if (opt.selected) {
            causes.push(opt.value || opt.text);
        }
    }
    return causes
}

function fetchAndUpdate(sliderValue) {
    // Clear existing geometries
    removeFires()
    // Call window.api.getShapes with the appropriate parameters based on the slider position

    const fireSizeClass = document.getElementById("size").options
    let causeOptions = document.getElementById("cause").options
    let causes = getSelectedOptions(causeOptions);
    let classes = getSelectedOptions(fireSizeClass);

    let dbRows;
    if (year === -1) { // display overview of year
        dbRows = window.api.getShapesForYear(sliderValue, "1", "2") // Argumente "1" und "2" nur placeholder, weil filtering noch nicht implementiert!
    } else { // year-specific
        dbRows = window.api.getShapesForDay(sliderValue, year, "1", "2")
    }
    dbRows.then(rows => {
        console.log(rows)
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

let myTimer;

const updateYearDisplay = () => {
      document.getElementById("current-year").innerText =
          String(Number(document.getElementById('rangeSlider').value)+1992);
};

// Listen for the 'input' event on the slider
d3.select('#rangeSlider').on('input', function() {
  updateYearDisplay();
  fetchAndUpdate(Number(this.value));
});

function timelineYearly() {
  clearInterval(myTimer);
  let b= d3.select("#rangeSlider");
  b.property("min", 0)
  b.property("max", 30)
  let maxValue = +b.property("max");
  myTimer = setInterval (function() {
      let value = +b.property("value");
      b.property("value", value + 1);
      updateYearDisplay();
      fetchAndUpdate(+b.property("value"));
      if (value === maxValue) {
          clearInterval(myTimer);
      }
  }, 1000);
}

function timelineYear() {
  clearInterval(myTimer);
  let b= d3.select("#rangeSlider");
  b.property("min", 1)
  b.property("max", 365) // Slider goes over every day of the year
  let maxValue = +b.property("max");
  myTimer = setInterval (function() {
      let value = +b.property("value");
      b.property("value", value + 1);
      fetchAndUpdate(+b.property("value"));
      if (value === maxValue) {
          clearInterval(myTimer);
      }
  }, 1000);
}

d3.select("#start").on("click", timelineYearly);
d3.select("#pause").on("click", function() {
  clearInterval (myTimer);
});

d3.select("#stop").on("click", function() {
      d3.select("#rangeSlider").property("value", 0);
      updateYearDisplay();
      clearInterval (myTimer)
      fetchAndUpdate(0);
});

function filterBy() {
    fetchAndUpdate(parseInt(document.getElementById('rangeSlider').value));
}

function showYear(selectedYear) {
    if (selectedYear === "-1") {
        year = -1
        d3.select("#start").on("click", timelineYearly);
        d3.select("#rangeSlider").property("value", 0);
        updateYearDisplay();
        clearInterval(myTimer);
        fetchAndUpdate(0);
    } else {
        year = Number(selectedYear)
        d3.select("#start").on("click", timelineYear);
        d3.select("#rangeSlider").property("value", 0);
        document.getElementById("current-year").innerText = year+1992;
        clearInterval(myTimer);
        fetchAndUpdate(0);
    }
}