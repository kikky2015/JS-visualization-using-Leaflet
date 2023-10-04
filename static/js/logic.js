// using url for all earthquakes in the past day
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// query URL
d3.json(url).then(data => {

    // display geojson data 
    console.log(data);

    // call the function with the data features
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // function to display place and time of each earthquake
  function onEachFeature(features, layer){
    layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);};

    // Create a GeoJSON layer that contains the features array on the earthquakeData object
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        // point to layer for the circle coordinates
        pointToLayer: function(features, coordinates) {
        let depth = features.properties.mag;
        console.log(depth)
        let geoMarkers = {
            radius: depth * 5,
            fillColor: colors(depth*100),
            fillOpacity: 0.7,
            weight: 0.5
        };
        return L.circleMarker(coordinates, geoMarkers);
    }
    });

  // call function
  createMap(earthquakes);
};

// color scale
function colors(depth) {

    // variable to hold the color
    let color = "";
 
//display depth by color
    if (depth >400) {
        return color ="#ea2c2c" ;
    }
    else if (depth > 300) {
        return color ="#ea822c" ;
    }
    else if (depth > 200) {
        return color ="#ee9c00" ;
    }
    else if (depth > 100) {
        return color = "#eecc00" ;
    }
    else if (depth > 50) {
        return color = "#d4ee00";
    }
    else {
        return color =  "#98ee00";
    }

};
// function to create the map
function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // topographic view
    let topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?',{layers: 'TOPO-WMS'});

    let grayscale = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'YnpQEhRDopnhG3NFNlYUwXCpK50fR3yagyHj5MwZJKWU0gnuq4iYH7xJ49UjNWaC'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
        "Grayscale Map": grayscale
    };

    // overlay object for street map and topgraphic map
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add the layer control to the map.
    // To choose between map view options
    L.control.layers(baseMaps, overlayMaps, {
        // collapsed: false
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright"});

    legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [0, 50, 100, 200, 300, 400];
    let labels= [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c" ];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colors(grades[i] + 1) + '"></i> ' +
        grades[i] + '&ndash;' + grades[i + 1] +'<br/>' ;
    }

    return div;
    };

    legend.addTo(myMap);

};


