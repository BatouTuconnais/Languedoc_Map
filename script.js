// Initialisation carte Leaflet centrée sur France
const map = L.map('map', {
  zoomControl: true,
  minZoom: 5,
  maxZoom: 18,
}).setView([46.5, 2.5], 6);

// Pas de fond de carte, fond blanc (vide)
const emptyLayer = L.tileLayer('', { attribution: '' }).addTo(map);

// DOM des contrôles
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

// Fonction style (sans contour)
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

// Charge un fichier GeoJSON, crée la couche, l’ajoute si visible
async function loadLayer(name, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();

    if (layers[name]) map.removeLayer(layers[name]);

    layers[name] = L.geoJSON(data, {
      style: styleFunction(name),
    });

    if (controls[name].visible.checked) {
      layers[name].addTo(map);
    }
  } catch (err) {
    alert(`Erreur de chargement de ${url}: ${err.message}`);
  }
}

// Recharge toutes les couches
function reloadAllLayers() {
  loadLayer('routes', 'data/ROUTES_LEGER_UNIFIE.geojson');
  loadLayer('hydro', 'data/Hydro_languedoc.geojson');
  loadLayer('nature', 'data/Nature_LanguedocV2.geojson');
}

// Met à jour le style d'une couche déjà chargée
function updateStyle(name) {
  if (!layers[name]) return;
  layers[name].setStyle(styleFunction(name));
}

// Affiche ou masque la couche selon checkbox
function toggleLayer(name) {
  if (controls[name].visible.checked) {
    if (layers[name]) layers[name].addTo(map);
  } else {
    if (layers[name]) map.removeLayer(layers[name]);
  }
}

// Ajout écouteurs sur contrôles
Object.keys(controls).forEach((name) => {
  controls[name].color.addEventListener('input', () => updateStyle(name));
  controls[name].opacity.addEventListener('input', () => updateStyle(name));
  controls[name].visible.addEventListener('change', () => toggleLayer(name));
});

// Initialisation des couches
reloadAllLayers();

// Ajout contrôle de recherche Leaflet Control Geocoder
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
