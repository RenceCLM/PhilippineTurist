var map = L.map('map').setView([14.5995, 120.9842], 13); // Manila

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var waypoints = [];

map.on('click', function (e) {
    if (waypoints.length < 2) {
        waypoints.push(e.latlng);
        L.marker(e.latlng).addTo(map);

        if (waypoints.length === 2) {
            L.Routing.control({
                waypoints: waypoints,
                createMarker: function () { return null; },
                routeWhileDragging: true,
                lineOptions: {
                    styles: [{ className: 'animate-route' }] // Attach the animation class
                }
            }).addTo(map);
        }
    } else {
        resetMap(e.latlng);
    }
});

function resetMap(startPoint) {
    waypoints = [startPoint];
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Routing.Control || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    L.marker(startPoint).addTo(map);
}
