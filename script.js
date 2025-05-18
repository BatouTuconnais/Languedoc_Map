// Initialisation de la carte Leaflet centrée sur France
const map = L.map("map", {
  zoomControl: true,
  minZoom: 5,
  maxZoom: 18,
}).setView([46.5, 2.5], 6);

// Pas de fond de carte (fond vide)
const emptyLayer = L.tileLayer('', {
  attribution: ''
}).addTo(map);

// Variables pour stocker les couches
let routesLayer, hydroLayer, natureLayer;

// Fonction style sans contours, avec couleur et opacité dynamiques
function getStyle(color, opacity) {
  return {
    color: color,
    weight: 0,
    fillColor: color,
    fillOpacity: opacity,
    stroke: false,
  };
}

// Fonction pour charger un GeoJSON avec style dynamique
function loadGeoJSON(url, colorInput, opacityInput, onEachFeature) {
  return fetch(url)
    .then(res => res.json())
    .then(data => {
      return L.geoJSON(data, {
        style: function () {
          return getStyle(colorInput.value, parseFloat(opacityInput.value));
        },
        onEachFeature: onEachFeature,
      });
    });
}

// Gestion de la recherche avec Leaflet Control Geocoder
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: "Chercher une ville...",
}).addTo(map);

const cityNameDiv = document.getElementById("city-name");

// Quand une ville est choisie
geocoder.on('markgeocode', function(e) {
  const center = e.geocode.center;
  map.setView(center, 13);

  // Affiche le nom de la ville
  cityNameDiv.textContent = e.geocode.name;
});

// Chargement initial des couches avec contrôles couleur + transparence
const routesColor = document.getElementById("routes-color");
const routesOpacity = document.getElementById("routes-opacity");

const hydroColor = document.getElementById("hydro-color");
const hydroOpacity = document.getElementById("hydro-opacity");

const natureColor = document.getElementById("nature-color");
const natureOpacity = document.getElementById("nature-opacity");

// Fonction pour (re)charger la couche avec la couleur et opacité choisies
function refreshLayer(layer, url, colorInput, opacityInput, targetVarName) {
  if (layer) {
    map.removeLayer(layer);
  }
  loadGeoJSON(url, colorInput, opacityInput).then(newLayer => {
    window[targetVarName] = newLayer.addTo(map);
  });
}

// Chargement initial
refreshLayer(null, "ROUTES_LEGER_UNIFIE.geojson", routesColor, routesOpacity, "routesLayer");
refreshLayer(null, "Hydro_languedoc.geojson", hydroColor, hydroOpacity, "hydroLayer");
refreshLayer(null, "Nature_LanguedocV2.geojson", natureColor, natureOpacity, "natureLayer");

// Réagir aux changements de couleur et transparence
routesColor.addEventListener("input", () => refreshLayer(routesLayer, "ROUTES_LEGER_UNIFIE.geojson", routesColor, routesOpacity, "routesLayer"));
routesOpacity.addEventListener("input", () => refreshLayer(routesLayer, "ROUTES_LEGER_UNIFIE.geojson", routesColor, routesOpacity, "routesLayer"));

hydroColor.addEventListener("input", () => refreshLayer(hydroLayer, "Hydro_languedoc.geojson", hydroColor, hydroOpacity, "hydroLayer"));
hydroOpacity.addEventListener("input", () => refreshLayer(hydroLayer, "Hydro_languedoc.geojson", hydroColor, hydroOpacity, "hydroLayer"));

natureColor.addEventListener("input", () => refreshLayer(natureLayer, "Nature_LanguedocV2.geojson", natureColor, natureOpacity, "natureLayer"));
natureOpacity.addEventListener("input", () => refreshLayer(natureLayer, "Nature_LanguedocV2.geojson", natureColor, natureOpacity, "natureLayer"));
