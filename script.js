// Initialise la carte Leaflet centrée sur la France
const map = L.map('map', {
  zoomControl: true,
  minZoom: 5,
  maxZoom: 18,
}).setView([46.5, 2.5], 6);

// Aucun fond de carte (fond blanc)
const emptyLayer = L.tileLayer('', { attribution: '' }).addTo(map);

// Elements DOM des contrôles
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

// Fonction style des couches (sans contours)
function styleFunction(layerName) {
  return function (feature) {
    const color = controls[layerName].color.value;
    const opacity = parseFloat(controls[layerName].opacity.value);
    return {
      color: color,
      weight: 0,
      fillColor: color,
      fillOpacity: opacity,
      stroke: false,
    };
  };
}

// Variables Leaflet GeoJSON Layer
let layers = {
  routes: null,
  hydro: null,
  nature: null,
};

// Chargement des couches GeoJSON avec styles dynamiques
async function loadLayer(name, url) {
  const response = await fetch(url);
  if (!response.ok) {
    alert(`Erreur de chargement du fichier ${url} : ${response.statusText}`);
    return null;
  }
  const data = await response.json();

  // Supprime la couche précédente si existe
  if (layers[name]) {
    map.removeLayer(layers[name]);
  }

  layers[name] = L.geoJSON(data, {
    style: styleFunction(name),
  });

  if (controls[name].visible.checked) {
    layers[name].addTo(map);
  }
}

// Recharge toutes les couches
function reloadAllLayers() {
  loadLayer('routes', 'data/ROUTES_LEGER_UNIFIE.geojson');
  loadLayer('hydro', 'data/Hydro_languedoc.geojson');
  loadLayer('nature', 'data/Nature_LanguedocV2.geojson');
}

// Mise à jour du style d’une couche existante sans la recharger
function updateStyle(name) {
  if (!layers[name]) return;
  layers[name].setStyle(styleFunction(name));
}

// Gestion visibilité couches
function toggleLayer(name) {
  if (controls[name].visible.checked) {
    if (layers[name]) layers[name].addTo(map);
  } else {
    if (layers[name]) map.removeLayer(layers[name]);
  }
}

// Événements sur inputs
Object.keys(controls).forEach((name) => {
  controls[name].color.addEventListener('input', () => updateStyle(name));
  controls[name].opacity.addEventListener('input', () => updateStyle(name));
  controls[name].visible.addEventListener('change', () => toggleLayer(name));
});

// Initialisation des couches
reloadAllLayers();

// Ajout du contrôle de recherche (Leaflet Control Geocoder)
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Chercher une ville...',
}).addTo(map);

geocoder.on('markgeocode', function (e) {
  const center = e.geocode.center;
  map.setView(center, 13);

  // Affiche le nom de la ville sous la carte
  cityNameDiv.textContent = e.geocode.name;
});
