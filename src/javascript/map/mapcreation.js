// Array of layer templates for different map tile sources
const layerTemplates = [
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
];
const n_templates = layerTemplates.length; // Number of layer templates

/**
 * Function to create a map instance
 * @returns {maptalks.Map} Map instance
 */
function createMap() {
    const map = new maptalks.Map('map', {
        center: [-98, 37],
        zoom: 4,
        minZoom: 4,
        maxZoom: 18,
        baseLayer: new maptalks.TileLayer('base', {
            urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c'],
            attribution: '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, ' +
                '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
    });
    map.setMaxExtent(map.getExtent());
    return map;
}

const map = createMap(); // Create a map instance

const dateDisplay = new DateDisplay(); // Create a DateDisplay control
map.addControl(dateDisplay); // Add the DateDisplay control to the map