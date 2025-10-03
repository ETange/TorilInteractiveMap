// Define the image's aspect ratio
var imageWidth = 8172;
var imageHeight = 3422;
var imageUrl = 'source/Toril.jpeg';

// Calculate the bounds for the image (in this case, just use pixel values)
var southWest = [0, 0];
var northEast = [imageHeight, imageWidth];
var bounds = [southWest, northEast];

// Initialize the Leaflet map
var map = L.map('map', {
    crs: L.CRS.Simple, // Use a simple coordinate reference system
    minZoom: -1,       // Allow zooming out further to view the entire image
    maxZoom: 2         // Set the max zoom level for the map
});

// Add the image overlay
L.imageOverlay(imageUrl, bounds).addTo(map);

// Create a feature group to hold all markers
var markers = [];

// Add Places to the map
var baldur = L.marker([2631, 2426]).bindPopup("<b><a href='./Cities/baldurs-gate.html'>Baldur's Gate</a></b><br>A bustling port city.");
markers.push(baldur);

var neverwinter = L.marker([2903, 2212]).bindPopup("<b><a href='./Cities/Neverwinter.html'>Neverwinter</b><br>The Jewel of the North.");
markers.push(neverwinter);

var waterdeep = L.marker([2750, 2320]).bindPopup("<b><a href='./Cities/Waterdeep.html'>Waterdeep</a></b><br>The City of Splendors.");
waterdeep.on('add', function() {
    waterdeep.getElement().id = 'waterdeep-marker';
});
markers.push(waterdeep);

// Add a draggable marker for a figure
var figure = L.marker([2800, 2300], {draggable: true}).bindPopup("<b>Elara</b><br>A rogue on a secret mission.<br>Level: 5<br>Class: Rogue");
figure.on('add', function() {
    figure.getElement().id = 'figure-marker';
});
markers.push(figure);

// Add all markers to a feature group
var featureGroup = L.featureGroup(markers).addTo(map);

// Set the map view to fit all markers
map.fitBounds(featureGroup.getBounds().pad(0.1)); // Add padding to ensure markers aren't on the edge

// Update the coordinates on mouseover
map.on('mousemove', function(e) {
    var coord = e.latlng;
    document.getElementById('coordinates').innerHTML =
        'Coordinates: ' + Math.round(coord.lat) + ', ' + Math.round(coord.lng);
});