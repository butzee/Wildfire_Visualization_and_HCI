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