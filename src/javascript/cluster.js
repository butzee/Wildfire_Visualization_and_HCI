let geometries = [];

function updateCluster(value) {
    geometries = [];

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

    const minFiresize = data.reduce((min, d) => Math.min(min, d.firesize), Infinity);
    const maxFiresize = data.reduce((max, d) => Math.max(max, d.firesize), -Infinity);

    const getColor = (d) => {
        const normalizedValue = (d.firesize - minFiresize) / (maxFiresize - minFiresize);
        const index = Math.floor(normalizedValue * (COLOR_RANGE.length - 1));
        const [color1, color2 = COLOR_RANGE[index]] = COLOR_RANGE.slice(index, index + 2);
        const t = normalizedValue * (COLOR_RANGE.length - 1) - index;
        const interpolate = (a, b) => Math.round((1 - t) * a + t * b);
        return `rgb(${color1.map((c, i) => interpolate(c, color2[i])).join(',')})`;
    };

    clusterLayer.clear();
    data.forEach(dataPoint => {
        var factor = document.querySelector('#displaySizeDropdownContent input[type="checkbox"]:checked').value;

        var circle = new maptalks.Circle(dataPoint.coordinates, Math.sqrt((dataPoint.firesize * 4046.86) / Math.PI)*factor , {
            'properties' : dataPoint,
            'symbol' : {
                lineWidth: 0,
                polygonFill: getColor(dataPoint),
                polygonOpacity: 0.8
            }
        });
        circle.addTo(clusterLayer);
    });
}