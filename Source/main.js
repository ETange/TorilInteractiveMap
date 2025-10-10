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
var elaraPopupContent = `
    <div class="figure-popup">
        <h4>Elara</h4>
        <p><strong>Description:</strong> A rogue on a secret mission.</p>
        <p><strong>Notes:</strong> Level: 5, Class: Rogue</p>
    </div>
`;
var figure = L.marker([2800, 2300], {draggable: true}).bindPopup(elaraPopupContent);
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

// Function to add a new figure
function addFigure(coords) {
    var figureId = 'figure-' + new Date().getTime(); // Unique ID for the figure

    var formContent = `
        <div id="${figureId}-form">
            <h4>Add New Figure</h4>
            <label for="name">Name:</label><br>
            <input type="text" id="${figureId}-name" name="name"><br>
            <label for="image">Image URL:</label><br>
            <input type="text" id="${figureId}-image" name="image"><br>
            <label for="description">Description:</label><br>
            <textarea id="${figureId}-description" name="description"></textarea><br>
            <label for="notes">Notes:</label><br>
            <textarea id="${figureId}-notes" name="notes"></textarea><br><br>
            <button onclick="saveFigure('${figureId}')">Save</button>
        </div>
    `;

    var newFigure = L.marker(coords, { draggable: true })
        .bindPopup(formContent)
        .addTo(map)
        .openPopup();

    markers.push(newFigure);
    featureGroup.addLayer(newFigure);
}

// Add a context menu to the map to add new figures
map.on('contextmenu', function(e) {
    e.originalEvent.preventDefault();
    addFigure(e.latlng);
});

// Function to save figure details and update the popup
function saveFigure(figureId) {
    var name = document.getElementById(figureId + '-name').value;
    var imageUrl = document.getElementById(figureId + '-image').value;
    var description = document.getElementById(figureId + '-description').value;
    var notes = document.getElementById(figureId + '-notes').value;

    var popupContent = `
        <div class="figure-popup">
            <h4>${name}</h4>
            ${imageUrl ? `<img src="${imageUrl}" alt="${name}" width="150">` : ''}
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Notes:</strong> ${notes}</p>
        </div>
    `;

    var markerToUpdate = markers.find(m => m.getPopup().getContent().includes(figureId));
    if (markerToUpdate) {
        markerToUpdate.setPopupContent(popupContent).openPopup();
    }
}