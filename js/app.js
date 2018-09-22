// Add in mock data into the countryData JSON
countriesData.features.map(val => {
    var value = asylum[val.properties.name];

    if (typeof asylum[val.properties.name] === undefined) {
        console.log(val.properties.name);
    }
    val.properties['data'] = asylum[val.properties.name];
    
});
console.log("For Zambia ... ", asylum['Zambia'])

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
    return d > 10 ? '#000000' :
           d > 5  ? '#000000' :
           d > 2  ? '#111111' :
           d > 1  ? '#333333' :
           d > 0.5   ? '#999999' :
           d > 0.25   ? '#bbbbbb' :
           d > 0.1  ? '#dddddd' :
           d >= 0 ? '#eeeeee' :
                      '#ffffff';
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


var xValue = ['Western Sahara', 'Mauritania', 'Niger', 'Senegal', 'Oman', 'Peru', 'Egypt', 'Namibia', 'Qatar', 'Sudan'];

var yValue = [4.42, 3.79, 3.72, 3.65, 3.41, 3.39, 3.35, 3.30, 2.94, 2.94];

var trace1 = {
  x: xValue, 
  y: yValue,
  type: 'bar',
  text: yValue,
  textposition: 'auto',
  hoverinfo: 'none',
  marker: {
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rbg(8,48,107)',
      width: 1.5
    }
  }
};

var data = [trace1];

var layout = {
  title: 'Drought 2014'
};

Plotly.newPlot('myDiv', data, layout);

