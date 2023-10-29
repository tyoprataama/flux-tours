/* eslint-disable */
let isOpen = false;

function toggleMenu() {
  const userNav = document.getElementById('userNav');
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  if (!isOpen) {
    userNav.style.display = 'flex'; // Display the user navigation when the menu is open
  } else {
    userNav.style.display = 'none'; // Hide the user navigation when the menu is closed
  }

  isOpen = !isOpen;
}


const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiZmx1eHRvdXJzIiwiYSI6ImNsb2E5NWIxczAwZjQyam42M2dhemdyeTgifQ.jQAWiBw4Ze0G9drse_zKeA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  scrollZoom: false
  // center: [112.60698908810181, -7.837910652942128],
  // zoom: 7
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';
  // Add marker
  new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
    .setLngLat(loc.coordinates)
    .addTo(map);
  // Add popup
  new mapboxgl.Popup({
      offset: 30
    }).setLngLat(loc.coordinates)
    .setHTML(`<p>${loc.address}</p>`)
    .addTo(map);

  // Extends map bounds to include current locations
  bounds.extend(loc.coordinates)
});
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100
  }
})