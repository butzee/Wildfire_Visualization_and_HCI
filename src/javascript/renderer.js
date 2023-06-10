// DOM Elements
const buttonSQL = document.getElementById('queryButton');
const slider = document.getElementById('rangeSlider');
const startPauseButton = d3.select("#start_pause");
const stopButton = d3.select("#stop");
const updateScatterHelperButton = d3.select("#updateScatterHelper");

// Variables
let yearsArray;
let isDragging = false;
let myTimer;

// Event Listeners
buttonSQL.addEventListener('click', async () => {
  const year = getSelectedValues('#yearDropdownContent input[type="checkbox"]');
  const causeOptions = getSelectedValues('#causeDropdownContent input[type="checkbox"]');
  const sizeOptions = getSelectedValues('#sizeDropdownContent input[type="checkbox"]');
  try {
    showLoadingAnimation();
    yearsArray = await window.electronAPI.getFires(year, causeOptions, sizeOptions);
    showLoadingAnimation();
    d3.select("#rangeSlider")
     .property("min", 0)
     .property("max", areAllYearsDisplayed() ? 28 : 365);
  } catch (error) {
    console.error(error);
  }
  updateScatter(0);
  updateTimeDisplay();
});

slider.addEventListener('mousedown', () => isDragging = true);
slider.addEventListener('mouseup', () => isDragging = false);
slider.addEventListener('change', handleSliderChange);
slider.addEventListener('input', handleSliderChange);

startPauseButton.on("click", () => {
    if (!isAnimating()) {
        const b = d3.select("#rangeSlider");
        const maxValue = +b.property("max");
        if (+b.property("value") === maxValue) {
          b.property("value", 0);
          updateTimeDisplay();
        }
        play();
      } else {
        pause();
      }
      displayNextAnimationState(isAnimating() ? "play_arrow" : "pause");
});

stopButton.on("click", () => {
  d3.select("#rangeSlider").property("value", 0);
  updateYearDisplay();
  clearInterval(myTimer);
  document.getElementById("start_pause").firstElementChild.innerHTML = "play_arrow";  
  updateScatter(0);
  updateTimeDisplay();
});

updateScatterHelperButton.on("click", () => {
  updateScatter(document.getElementById('rangeSlider').value);
});

// Utility Functions
function getSelectedValues(selector) {
  return Array.from(document.querySelectorAll(`${selector}:checked`),  checkbox => checkbox.value);
}

function areAllYearsDisplayed() {
  return getSelectedValues('#yearDropdownContent input[type="checkbox"]')[0] === "-1";
}

function showLoadingAnimation() {
  document.getElementById("load").classList.toggle("show-options");
}

function getDate(day, year) {
  const date = new Date(year, 0);
  date.setDate(day);
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('de-DE', options);
}

function updateTimeDisplay() {
  if (document.getElementById("yearCheckbox").checked) {
    document.getElementById("current-year").innerText = "Current year: " + String(Number(document.getElementById('rangeSlider').value) + 1992);
  } else {
    const day = Number(document.getElementById('rangeSlider').value) + 1;
    const year = Array.from(document.querySelectorAll('#yearDropdownContent input[type="checkbox"]')).map(cb => cb.value)[0];
    document.getElementById("current-year").innerText = "Current date: " + getDate(day, year);
  }
}

function isAnimating() {
  const button = document.getElementById("start_pause");
  return button.firstElementChild.innerHTML === "pause";
}

function displayNextAnimationState(state) {
  const button = document.getElementById("start_pause");
  button.firstElementChild.innerHTML = state;
}

function play() {
  clearInterval(myTimer);
  const maxValue = +d3.select("#rangeSlider").property("max");
  const speed = Number(Array.from(document.querySelectorAll('#speedDropdownContent input[type="checkbox"]:checked'))[0].value);
  
  myTimer = setInterval(() => {
    const value = +b.property("value") + 1;
    updateTimeDisplay();
    updateScatter(value);
    if (value > maxValue) {
        clearInterval(myTimer);
        displayNextAnimationState("play_arrow");
    } else {
        b.property("value", value);
    }
  }, 1000 / speed);
}

function pause() {
  clearInterval(myTimer);
}

function handleSliderChange(event) {
  if (!isDragging) {
    const value = event.target.value;
    updateScatter(value);
  }
  updateTimeDisplay();
}

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
const deckglLayer = new maptalks.DeckGLLayer('kkkk', {'zIndex': 1 }).addTo(map);
const markerLayer  = new maptalks.VectorLayer('marker', {'zIndex': 9999}).addTo(map);
const maxExtend = map.getExtent();

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

// Draw fires ----------------------------------------------------------
const COLOR_RANGE = [ // Farben für die Feuergröße
    [255, 165, 0],
    [204, 0, 0],
    [87, 0, 0]
];

const LIGHT_SETTINGS = {
    lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [0.8, 0.0, 0.8, 0.0],
    numberOfLights: 2
};

function updateScatter(value) {
    deckglLayer.setProps({
        layers: []
    });
    markerLayer.clear();
    const data = yearsArray[value].map(({ FIRE_SIZE, LONGITUDE, LATITUDE, NWCG_GENERAL_CAUSE,DISCOVERY_DATE,CONT_DATE, NWCG_CAUSE_CLASSIFICATION, FIRE_NAME, FIRE_SIZE_CLASS, STATE, NWCG_REPORTING_UNIT_NAME, OBJECTID}) => ({
        firesize: FIRE_SIZE,
        coordinates: [LONGITUDE, LATITUDE],
        nwcg_general_cause: NWCG_GENERAL_CAUSE,
        discovery_date: DISCOVERY_DATE,
        cont_date: CONT_DATE,
        nwcg_cause_classification: NWCG_CAUSE_CLASSIFICATION,
        fire_name: FIRE_NAME,
        state: STATE,
        fire_size_class: FIRE_SIZE_CLASS,
        nwcg_reporting_unit_name: NWCG_REPORTING_UNIT_NAME,
        objectid: OBJECTID
      }));
    const getColor = (d) => {
        const normalizedValue = (d.firesize - minFiresize) / (maxFiresize - minFiresize);
        const index = Math.floor(normalizedValue * (COLOR_RANGE.length - 1));
        const [color1, color2 = COLOR_RANGE[index]] = COLOR_RANGE.slice(index, index + 2);
        const t = normalizedValue * (COLOR_RANGE.length - 1) - index;
        const interpolate = (a, b) => Math.round((1 - t) * a + t * b);
        return color1.map((c, i) => interpolate(c, color2[i]));
    };
    const minFiresize = data.reduce((min, d) => Math.min(min, d.firesize), Infinity);
    const maxFiresize = data.reduce((max, d) => Math.max(max, d.firesize), -Infinity);    
    const scale = Number(document.querySelector('#displaySizeDropdownContent input[type="checkbox"]:checked').value);
    const scatterplotLayer = {
        layerType: 'ScatterplotLayer',
        id: 'heatmap',
        colorRange: COLOR_RANGE,
        data: data,
        pickable: true,
        getPosition: d => d.coordinates,
        getRadius: d => Math.sqrt((d.firesize * 4046.86) / Math.PI),
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.7,
        radiusScale: scale,
        radiusMinPixels: 2,
        getColor: getColor,
        onClick: (info, event)  => {
            markerLayer.clear();
            var marker = new maptalks.Marker([info.object.coordinates[0], info.object.coordinates[1]]).addTo(markerLayer);
            const rows = [
                { label: 'Object ID:', value: info.object.objectid },
                { label: 'Firename:', value: info.object.fire_name },
                { label: 'Discovery Date:', value: info.object.discovery_date },
                { label: 'Containment Date:', value: info.object.cont_date },
                { label: 'Longitude:', value: info.object.coordinates[0] },
                { label: 'Latitude:', value: info.object.coordinates[1] },
                { label: 'Firesize:', value: `${info.object.firesize}m<sup>2</sup>` },
                { label: 'Fire Size Class:', value: info.object.fire_size_class },
                { label: 'General Cause:', value: info.object.nwcg_general_cause },
                { label: 'Classification:', value: info.object.nwcg_cause_classification },
                { label: 'State:', value: info.object.state },
                { label: 'Reporting Unit:', value: info.object.nwcg_reporting_unit_name }
            ];
            const tableContent = rows.map(row => `
                <tr>
                    <td class="tg-first-col"><b>${row.label}</b></td>
                    <td class="tg-second-col">${row.value}</td>
                </tr>
            `).join('');
            const infoContent = `
                <table class="tg">
                    ${tableContent}
                </table>
            `;
            marker.setInfoWindow({
                'title'     : 'InfoWindow',
                'autoCloseOn' : 'click',
                'single' : true,
                'custom' : true,
                'content': infoContent
            });
            marker.openInfoWindow();
        }
    };
    deckglLayer.setProps({layers: [scatterplotLayer]});
}