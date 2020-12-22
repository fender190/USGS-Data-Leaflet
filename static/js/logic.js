// set var for site address
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// center coordinates, Los Angeles
// Los Angeles, CA is in an earthquake prone area
var centercoor = [34.0522, -118.2437];

// Features
d3.json(geoData, data => {
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            "<h3 align='center'>" +
            feature.properties.place +
            "</h3><hr><p><b>Occurrence:</b> " +
            new Date(feature.properties.time) +
            "</p>" +
            "</h3><p><b>Magnitude:</b> " +
            feature.properties.mag +
            "</p>"
        );
    }

    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
            var geojsonMarkerOptions = {
                radius: 5 * feature.properties.mag,
                fillColor: getColor(feature.properties.mag),
                color: "none",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });

    createMap(earthquakes);
}

// Map layers
function createMap(earthquakes) {
    var lightMap = L.tileLayer(
        
    )

}

///////##############

var sat = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});


function choosecolor(mag) {
    var color = "";

    if (mag >= 8.0) {
        color = "darkred";
    }
    else if (mag >= 7.0) {
        color = "red";
    }
    else if (mag >= 6.0) {
        color = "orange";
    }
    else if (mag >= 5.0) {
        color = "yellow";
    }
    else if (mag >= 4.0) {
        color = "lightgreen";
    }
    else {
        color = "green";
    }
    return color
}

function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><h3>" + feature.properties.mag + " magnitude</h3><hr><p>"
        + new Date(feature.properties.time) + "</p>")
}

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// Perform a GET request to the query URL
d3.json(link, function (data) {
    //check data
    console.log(data.features);

    //    add geojson layer
    L.geoJson(data.features, { onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                color: choosecolor(feature.properties.mag),
                fillColor: choosecolor(feature.properties.mag),
                fillOpacity: 0.75,
                radius: (feature.properties.mag) * 20000
            });
        }
    }).addTo(map);
});

var map = L.map("map", {
    center: [14.7194, -92.4256],
    zoom: 5,
    layers: [out]
  });

var baseMaps = {
    Satellite: sat,
    Light: light,
    Outdoors: out,
};

L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [2,4,5,6,7,8];
    var labels = ["Minor", "Light", "Moderate", "Strong", "Major", "Great"];

    div.innerHTML = "<h4>Richter Scale</h4>";
  

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + choosecolor(grades[i]) + '"></i>' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);