// Renderer has access to the following:
// Api variable from preload.js
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Render test");
    console.log(electronAPI.info());
});

// Send Message via exposed api from preload.js to main.js and receive answer
const func = async () => {
    const response = await window.electronAPI.ping();
    console.log(response);
}
func();

const buttonSQL = document.getElementById('queryButton');
let yearsArray;

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
        if (year[0] === "-1") {
            b.property("min", 0);
            b.property("max", 28);
        } else {
            b.property("min", 0);
            b.property("max", 365);
        }

        console.log("done");
    } catch (error) {
        console.error(error);
    }
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
      b.property("value", value + 1);
      updateTimeDisplay();
      updateScatter(value)
      if (value === maxValue) {
        clearInterval(myTimer);
      }
    }, 1000/speed);
}

function pause() {
    clearInterval(myTimer);
}

d3.select("#start_pause").on("click", () => {
    if (!isAnimating()) {
        play()
        displayNextAnimationState("pause")
    } else {
        pause()
        displayNextAnimationState("play_arrow")
    }
});


function handleSliderChange(event) {
    if (!isDragging) {
        const value = event.target.value;
        updateScatter(value);
    }
    updateTimeDisplay();
  }

function createMap() {
    var  map = new maptalks.Map('map', {
        center: [-98, 37],
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        baseLayer: new maptalks.TileLayer('base', {
        'urlTemplate' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'subdomains'  : ['a','b','c'],
        'attribution'  : '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, '+
        '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
    })
    return map;
}

const options = {
    'position' : 'top-left',
};

class ResizeButton extends maptalks.control.Control {
    buildOn(map) {
    var div = maptalks.DomUtil.createEl("div");
    div.id = "current-year";
    div.innerHTML = "Current year 1992";
    return div;
    }
}

ResizeButton.mergeOptions(options);

const map = createMap();

var resizeButton = new ResizeButton();
map.addControl(resizeButton);

function updateScatter(value) {
    //Wenn deckgllayer schon vorhanden, dann löschen
    if (map.getLayer('kkkk')) {
        map.removeLayer('kkkk');
    }
    const data = [];
    const deckglLayer = new maptalks.DeckGLLayer('kkkk', {});
    for (let i = 0; i < yearsArray[value].length; i++) {
        const obj = {
        firesize: yearsArray[value][i].FIRE_SIZE,
        coordinates: [yearsArray[value][i].LONGITUDE, yearsArray[value][i].LATITUDE]
        };
        data.push(obj);
    }
    console.log(data);

    map.addLayer(deckglLayer);
    const COLOR_RANGE = [
        [255, 191, 191], // Light red
        [255, 0, 0]      // Dark red
      ];
    
    const LIGHT_SETTINGS = {
        lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
        ambientRatio: 0.4,
        diffuseRatio: 0.6,
        specularRatio: 0.2,
        lightsStrength: [0.8, 0.0, 0.8, 0.0],
        numberOfLights: 2
    };
    const getColor = d => {
        const normalizedValue = (d.firesize - minFiresize) / (maxFiresize - minFiresize);
        const index = Math.floor(normalizedValue * (COLOR_RANGE.length - 1));
        const color1 = COLOR_RANGE[index];
        const color2 = COLOR_RANGE[index + 1];

        if (color1 === undefined || color2 === undefined) {
            // Handle the case when color1 or color2 is undefined
            console.error('Invalid color values');
            return [0, 0, 0]; // Return a default color
          }

        const t = normalizedValue * (COLOR_RANGE.length - 1) - index;
        const r = interpolate(color1[0], color2[0], t);
        const g = interpolate(color1[1], color2[1], t);
        const b = interpolate(color1[2], color2[2], t);
        return [r, g, b];
      };

    function interpolate(a, b, t) {
    return Math.round((1 - t) * a + t * b);
    }

    const minFiresize = Math.min(...data.map(d => d.firesize));
    const maxFiresize = Math.max(...data.map(d => d.firesize));

    const scatterplotLayer = {
        layerType: 'ScatterplotLayer',
        id: 'heatmap',
        colorRange: COLOR_RANGE,
        data: data,
        pickable: true,
        getPosition: d => d.coordinates,
        getRadius: d => Math.sqrt((d.firesize * 4046.86) / Math.PI),
        lightSettings: LIGHT_SETTINGS,
        opacity: 1,
        radiusScale: 1,
        radiusMinPixels: 2,
        getColor: getColor,
    };
    deckglLayer.setProps({
        layers: [scatterplotLayer]
    });
}