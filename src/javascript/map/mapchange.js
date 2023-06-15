// Initialize variables
let scatter = true; // Flag for scatter display type
let nextMapIdx = 1; // Index for cycling through map layers

// Function to change page with map transition
function changePageMap(event, href) {
    event.preventDefault();

    const elementsToMoveOut = document.querySelectorAll("#map, #map-controls, #bottombar, .topbar");
    elementsToMoveOut.forEach((element) => {
        element.style.opacity = '0';
    });

    const main = document.querySelector(".main");
    main.addEventListener("transitionend", () => {
        window.location.href = href;
    });
}

// Function to change page with main window transition
function changePage(event, href) {
    event.preventDefault();

    const mainWindow = document.querySelector(".mainwindow");
    mainWindow.style.transform = 'translateY(-100%)';
    mainWindow.addEventListener("transitionend", () => {
        window.location.href = href;
    });
}

// Function to change the map layer type
function changeMapType() {
    const newBaseLayer = new maptalks.TileLayer('base', {
        'urlTemplate': layerTemplates[nextMapIdx++ % n_templates],
        'subdomains': ['a', 'b', 'c'],
        'attribution': '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    });
    map.setBaseLayer(newBaseLayer);
}

// Function to toggle the display type
function changeDisplayType() {
    const button = document.getElementById("displayType");

    if (!button.classList.contains('disabled')) {
        scatter = !scatter; // Toggle scatter display flag

        // Add/remove layers based on the scatter flag
        map.removeLayer(scatter ? clusterLayer : [deckglLayer, markerLayer]);
        map.addLayer(scatter ? [deckglLayer, markerLayer] : clusterLayer);

        const rangeSliderValue = document.getElementById('rangeSlider').value;

        // Call appropriate update function based on the scatter flag
        scatter ? updateScatter(rangeSliderValue) : updateCluster(rangeSliderValue);

        // Update the display label to change the scatter/cluster-icon
        document.getElementById("display").innerHTML = scatter ? "join" : "scatter_plot";
    }
}