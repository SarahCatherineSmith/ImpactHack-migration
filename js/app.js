// Add in mock data into the countryData JSON
countriesData.features.map(val => {
    var value = asylum[val.properties.name];

    if (typeof asylum[val.properties.name] === undefined) {
        console.log(val.properties.name);
    }
    val.properties['data'] = asylum[val.properties.name];
    
});
console.log("For Zambia ... ", asylum['Zambia'])
var selectedCountry = "";
var map = L.map('map').setView([0.0, 0.0], 2);

var basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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
function getColor(feature) {
    if (selectedCountry == "") {
        var d = feature.properties.data;
        return d > 10 ? '#000000' :
           d > 5  ? '#000000' :
           d > 2  ? '#111111' :
           d > 1  ? '#333333' :
           d > 0.5   ? '#999999' :
           d > 0.25   ? '#bbbbbb' :
           d > 0.1  ? '#dddddd' :
           d >= 0 ? '#eeeeee' :
                      '#ffffff';
    } else if (selectedCountry == "Colombia") {
        switch (feature.properties.name){
            case selectedCountry:
                return "#FF0000";
            case "Cameroon":
                return "#000000";
            case "Chad":
                return "#000000";
            case "Democratic Republic of the Congo":
                return "#000000";
            case "Sudan":
                return "#000000";
            default: 
                return "#CCCCCC";
        }
    } else if (selectedCountry == "Eritrea") {
        switch (feature.properties.name) {
            case selectedCountry:
                return "#FF0000";
            case 'Canada':
                return "#000000";
            case 'Costa Rica':
                return "#000000";
            case 'Ecuador':
                return "#000000";
            case 'Panama':
                return "#000000";
            case 'Venezuela':
                return "#000000";
            default:
                return "#CCCCCC";
        }
    } else if (selectedCountry == "Iraq") {
        switch (feature.properties.name) {
            case selectedCountry:
                return "#FF0000";
            case 'Ethiopia':
                return "#000000"
            case 'Israel':
                return "#000000"    
            case 'Sudan':
                return "#000000"    
            case 'Sweden':
                return "#000000"    
            case 'Switzerland':
                return "#000000";
            default:
                return "#CCCCCC";
        }
    } else if (selectedCountry == "Somalia") {
        switch (feature.properties.name) {
            case selectedCountry:
                return "#FF0000";
                case 'Germany':
                    return "#000000";
                case 'Iran':
                    return "#000000";
                case 'Jordan':
                    return "#000000";
                case 'Sweden':
                    return "#000000";
                case 'Syria':
                    return "#000000";
                default:
                    return "#CCCCCC";
        }
    } else if (selectedCountry == "Central African Republic") {
        switch (feature.properties.name) {
            case selectedCountry:
                return "#FF0000";
                case 'Austria':
                    return "#000000";
                case 'Germany':
                    return "#000000";
                case 'Iran':
                    return "#000000";
                case 'Pakistan':
                    return "#000000";
                case 'Sweden':
                    return "#000000";
                default:
                    return "#CCCCCC";
        }
    }
    
}

function style(feature) {
    if (selectedCountry == ""){
            return {
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '',
                fillOpacity: 0.7,
                fillColor: getColor(feature)
            }
        // }
        // else {
        //     return {
        //         weight: 0,
        //         opacity: 0,
        //         color: 'red',
        //         dashArray: '',
        //         fillOpacity: 0.0,
        //         fillColor: getColor(feature)
        //     }
        // };
    } else {
        // if(feature.properties.data > 0) {
            return {
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '',
                fillOpacity: 1,
                fillColor: getColor(feature)
            }
        // }
        // else {
        //     return {
        //         weight: 0,
        //         opacity: 0,
        //         color: 'red',
        //         dashArray: '',
        //         fillOpacity: 0.0,
        //         fillColor: getColor(feature)
        //     }
        // };
    }
    
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
    if(feature.properties.data >= 0) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
    });
    var stringToAdd = "" + feature.properties.name + "<br/>";
    stringToAdd += feature.properties.data + "<br/>";
    layer.bindPopup(stringToAdd);
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
    console.log(geojson);
    selectedCountry = country.value;
    console.log("Selected Country = ", selectedCountry);
    geojson.setStyle(style)
    // var name = country.value;
    // var ret = "";

    // var topFive = countryOrigin[name];

    // Object.keys(topFive).forEach((key, index) => {
    //     ret += (index+1) + ". " + topFive[key]["Pct_to_Dest"] + "<br/>";
    // })

}

