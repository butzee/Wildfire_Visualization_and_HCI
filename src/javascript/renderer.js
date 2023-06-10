const buttonSQL = document.getElementById('queryButton');
let yearsArray;

function areAllYearsDisplayed() {
    const year = Array.from(document.querySelectorAll('#yearDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    return year[0] === "-1";
}

// Send Message via exposed api from preload.js to main.js and receive answer
buttonSQL.addEventListener('click', async () => {
    const year = Array.from(document.querySelectorAll('#yearDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    const causeOptions = Array.from(document.querySelectorAll('#causeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    const sizeOptions = Array.from(document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    try {
        showLoadingAnimation();
        yearsArray = await window.electronAPI.getFires(year, causeOptions, sizeOptions);
        showLoadingAnimation();
        let b = d3.select("#rangeSlider");
        if (areAllYearsDisplayed()) {
            b.property("min", 0);
            b.property("max", 28);
        } else {
            b.property("min", 0);
            b.property("max", 365);
        }

        console.log("done");
        console.log(yearsArray);
    } catch (error) {
        console.error(error);
    }
    updateScatter(0); // Zeige Feuer für ersten Zeitpunkt
    updateTimeDisplay();
});


const slider = document.getElementById('rangeSlider');
let isDragging = false;

slider.addEventListener('mousedown', () => isDragging = true);
slider.addEventListener('mouseup', () => isDragging = false);
slider.addEventListener('change', handleSliderChange);
slider.addEventListener('input', handleSliderChange);

let myTimer;

function showLoadingAnimation() {
    document.getElementById("load").classList.toggle("show-options");
}

function getDate(day, year) {
    let date = new Date(year, 0);
    date.setDate(day);
    let options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    let string = date.toLocaleDateString('de-DE', options);
    return string;
}

function updateTimeDisplay() {
    if (document.getElementById("yearCheckbox").checked) {
        document.getElementById("current-year").innerText = "Current year: " + String(Number(document.getElementById('rangeSlider').value)+1992);
    } else {
        const day = Number(document.getElementById('rangeSlider').value)+1;
        const checkboxes = document.querySelectorAll('#yearDropdownContent input[type="checkbox"]');
        let year;
        checkboxes.forEach(cb => {
            if (cb.checked) {
                year = cb.value;
            }
        });
        document.getElementById("current-year").innerText = "Current date: " + getDate(day, year);
    }
}

function isAnimating() {
    button = document.getElementById("start_pause");
    return button.firstElementChild.innerHTML === "pause";
}

function displayNextAnimationState(state) {
    button = document.getElementById("start_pause");
    button.firstElementChild.innerHTML = state;
}

function play() {
    clearInterval(myTimer);
    let b = d3.select("#rangeSlider");
    let maxValue = +b.property("max");

    const speed = Number(Array.from(document.querySelectorAll('#speedDropdownContent input[type="checkbox"]:checked'))[0].value);
    
    myTimer = setInterval(function () {
      let value = +b.property("value");
      updateTimeDisplay();
      updateScatter(value)
      if (value === maxValue) {
        clearInterval(myTimer);
        displayNextAnimationState("play_arrow")
      }
      b.property("value", value + 1);
    }, 1000/speed);
}

function pause() {
    clearInterval(myTimer);
}

d3.select("#start_pause").on("click", () => {
    if (!isAnimating()) {
        let b = d3.select("#rangeSlider");
        let maxValue = +b.property("max");
        if (+b.property("value") === maxValue) {
            b.property("value", 0);
            updateTimeDisplay();
        }
        play()
        displayNextAnimationState("pause")
    } else {
        pause()
        displayNextAnimationState("play_arrow")
    }
});

d3.select("#stop").on("click", function () {
    d3.select("#rangeSlider").property("value", 0);
    updateYearDisplay();
    clearInterval(myTimer)
    button = document.getElementById("start_pause");
    button.firstElementChild.innerHTML = "play_arrow";
    updateScatter(0);
    updateTimeDisplay();
});

d3.select("#updateScatterHelper").on("click", function () {
    updateScatter(document.getElementById('rangeSlider').value);
});

function handleSliderChange(event) {
    if (!isDragging) {
        const value = event.target.value;
        updateScatter(value);
    }
    updateTimeDisplay();
  }

// Map creation and utilities ----------------------------------------------------------
layerTemplates = [
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
]
const n_templates = layerTemplates.length;
let nextMapIdx = 1;

function createMap() {
    let map = new maptalks.Map('map', {
        center: [-98, 37],
        zoom: 4,
        minZoom: 4,
        maxZoom: 18,
        baseLayer: new maptalks.TileLayer('base', {
        'urlTemplate' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'subdomains'  : ['a','b','c'],
        'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
        '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
    })
    map.setMaxExtent(map.getExtent());
    return map;
}

const map = createMap();
var deckglLayer = new maptalks.DeckGLLayer('kkkk', {'zIndex': 1 }).addTo(map);
var markerLayer  = new maptalks.VectorLayer('marker', {'zIndex': 9999}).addTo(map);

const maxExtend = map.getExtent()

// Controls ----------------------------------------------------------

class DateDisplay extends maptalks.control.Control {
    buildOn(map) {
        let div = maptalks.DomUtil.createEl("div");
        div.id = "current-year";
        div.innerHTML = "Current year: 1992";
    return div;
    }
}

DateDisplay.mergeOptions({
    position: 'top-left',
});

let dateDisplay = new DateDisplay();
map.addControl(dateDisplay);

function resizeMap() {
    map.fitExtent(maxExtend, 0)
}

function changeMapType() {
    let newBaseLayer = new maptalks.TileLayer('base', {
        'urlTemplate' : layerTemplates[nextMapIdx++ % n_templates], // Immer abwechselnd eines der drei Layer
        'subdomains'  : ['a','b','c'],
        'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
        '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
    map.setBaseLayer(newBaseLayer);
}

// Draw fires ----------------------------------------------------------

function updateScatter(value) {
    deckglLayer.setProps({
        layers: []
    });
    markerLayer.clear();

    const data = yearsArray[value].map((yearData) => ({
        firesize: yearData.FIRE_SIZE,
        coordinates: [yearData.LONGITUDE, yearData.LATITUDE],
        nwcg_general_cause: yearData.NWCG_GENERAL_CAUSE,
        discovery_date: yearData.DISCOVERY_DATE,
        cont_date: yearData.CONT_DATE,
        nwcg_cause_classification: yearData.NWCG_CAUSE_CLASSIFICATION,
        fire_name: yearData.FIRE_NAME,
        state: yearData.STATE,
        fire_size_class: yearData.FIRE_SIZE_CLASS,
        nwcg_reporting_unit_name: yearData.NWCG_REPORTING_UNIT_NAME,
        objectid: yearData.OBJECTID
      }));

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
    const getColor = (d) => {
        const normalizedValue = (d.firesize - minFiresize) / (maxFiresize - minFiresize);
        const index = Math.floor(normalizedValue * (COLOR_RANGE.length - 1));
        const [color1, color2 = COLOR_RANGE[index]] = COLOR_RANGE.slice(index, index + 2);
        const t = normalizedValue * (COLOR_RANGE.length - 1) - index;
        const interpolate = (a, b) => Math.round((1 - t) * a + t * b);
        const r = interpolate(color1[0], color2[0]);
        const g = interpolate(color1[1], color2[1]);
        const b = interpolate(color1[2], color2[2]);
        return [r, g, b];
    };

    const minFiresize = Math.min(...data.map(d => d.firesize));
    const maxFiresize = Math.max(...data.map(d => d.firesize));
    
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
    deckglLayer.setProps({
        layers: [scatterplotLayer]
    });
}