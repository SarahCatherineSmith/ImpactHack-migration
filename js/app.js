// Add in mock data into the countryData JSON
countriesData.features.map(val => {
    val.properties['data'] = Math.random()*100;
});

var map = L.map('map').setView([0.0, 0.0], 2);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo( map );


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>UK Aid Projects</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.projects + ' projects<br />£' + props.budget + ' budget for 2013/14'
        : 'Hover over a country');
};

info.addTo(map);


// get color depending on budget value
function getColor(d) {
    return d > 100 ? '#CCC' :
           d > 70  ? '#AAA' :
           d > 50  ? '#999' :
           d > 40  ? '#777' :
           d > 30   ? '#555' :
           d > 20   ? '#333' :
           d > 10  ? '#111' :
                      '#000';
    // return d > 100000000 ? '#800026' :
    //        d > 50000000  ? '#BD0026' :
    //        d > 20000000  ? '#E31A1C' :
    //        d > 10000000  ? '#FC4E2A' :
    //        d > 5000000   ? '#FD8D3C' :
    //        d > 2000000   ? '#FEB24C' :
    //        d > 1000000  ? '#FED976' :
    //                   '#FFEDA0';
}

function style(feature) {
    if(feature.properties.data > 0) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.data)
    }
    }
    else {
    return {
        weight: 0,
        opacity: 0,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.0,
        fillColor: getColor(feature.properties.data)
    }
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    if(feature.properties.budget > 0) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //click: zoomToFeature
    });
    layer.bindPopup(feature.properties.name);
    }
}


geojson = L.geoJson(countriesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('DFID IATI data from <a href="http://iatiregistry.org/">IATI Registry</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);


function changeCountry(country) {
    console.log("Selected element", country);
    console.log("Selected country name = ", country.value);
}