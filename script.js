// Initialisation carte Leaflet, centrée France (env)
const map = L.map('map', {
  zoomControl: true,
  minZoom: 5,
  maxZoom: 18,
}).setView([46.5, 2.5], 6);

// Pas de fond OpenStreetMap (fond blanc)
const emptyLayer = L.tileLayer('', { attribution: '' }).addTo(map);

// DOM Contrôles
const controls = {
  routes: {
    visible: document.getElementById('routes-visible'),
    color: document.getElementById('routes-color'),
    opacity: document.getElementById('routes-opacity'),
  },
  hydro: {
    visible: document.getElementById('hydro-visible'),
    color: document.getElementById('hydro-color'),
    opacity: document.getElementById('hydro-opacity'),
  },
  nature: {
    visible: document.getElementById('nature-visible'),
    color: document.getElementById('nature-color'),
    opacity: document.getElementById('nature-opacity'),
  },
};

const cityNameDiv = document.getElementById('city-name');

let layers = {
  routes: null,
  hydro: null,
  nature: null,
};

// Style sans contour, avec couleur et opacité variables
function styleFunction(layerName) {
  return function (feature) {
    return {
      color: 'none',         // Pas de contour
      weight: 0,
      fillColor: controls[layerName].color.value,
      fillOpacity: parseFloat(controls[layerName].opacity.value),
      stroke: false,
    };
  };
}

// Charge une couche GeoJSON et ajoute sur la carte
function loadGeoJSONLayer(name, path) {
  return fetch(path)
    .then((response) => {
      if (!response.ok) throw new Error(`Erreur chargement ${path}`);
      return response.json();
    })
    .then((data) => {
      const geojsonLayer = L.geoJSON(data, {
        style: styleFunction(name),
        interactive: true,
      });
      geojsonLayer.addTo(map);
      return geojsonLayer;
    })
    .catch((e) => {
      console.error(e);
      alert(`Erreur chargement de la couche ${name}`);
      return null;
    });
}

// Met à jour la visibilité d'une couche
function updateVisibility(name) {
  if (!layers[name]) return;
  if (controls[name].visible.checked) {
    layers[name].addTo(map);
  } else {
    map.removeLayer(layers[name]);
  }
}

// Met à jour style (couleur et opacité) d'une couche
function updateStyle(name) {
  if (!layers[name]) return;
  layers[name].setStyle(styleFunction(name));
}

// Initialisation : chargement couches
async function initLayers() {
  layers.routes = await loadGeoJSONLayer('routes', 'data/ROUTES_LEGER_UNIFIE.geojson');
  layers.hydro = await loadGeoJSONLayer('hydro', 'data/Hydro_languedoc.geojson');
  layers.nature = await loadGeoJSONLayer('nature', 'data/Nature_LanguedocV2.geojson');

  // Connecte contrôles à fonctions de mise à jour
  for (const name of Object.keys(layers)) {
    if (!layers[name]) continue;
    controls[name].visible.addEventListener('change', () => updateVisibility(name));
    controls[name].color.addEventListener('input', () => updateStyle(name));
    controls[name].opacity.addEventListener('input', () => updateStyle(name));
  }
}
initLayers();

// Ajout du contrôle de recherche (geocoder)
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: "Rechercher une ville...",
}).addTo(map);

geocoder.on('markgeocode', function (e) {
  const bbox = e.geocode.bbox;
  const center = e.geocode.center;
  map.fitBounds(bbox);
  cityNameDiv.textContent = e.geocode.name;
});

// Affiche message par défaut si rien sélectionné
cityNameDiv.textContent = "Rechercher une ville pour afficher son nom ici.";

// Supprime contours par défaut Leaflet au cas où (ex: polygones)
L.Path.prototype.options.stroke = false;
