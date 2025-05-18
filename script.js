const map = L.map('map', {
  center: [43.5, 3.0],  // Centre Languedoc
  zoom: 7,
  layers: [],
  zoomControl: true,
});

const emptyLayer = L.tileLayer('', { attribution: '' });
emptyLayer.addTo(map);

let batimentsLayer = null;
let hydroLayer = null;
let natureLayer = null;
let routesLayer = null;

function loadGeoJSON(url, color, onLoad) {
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      const layer = L.geoJSON(data, {
        style: {
          color: color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.5,
        },
      });
      onLoad(layer);
    })
    .catch(err => console.error('Erreur chargement GeoJSON:', err));
}

function loadAllLayers() {
  loadGeoJSON('data/BATIMENTS_LANGEDOC.geojson', document.getElementById('batimentsColor').value, (layer) => {
    batimentsLayer = layer;
    if (document.getElementById('batimentsCheckbox').checked) batimentsLayer.addTo(map);
  });
  loadGeoJSON('data/Hydro_languedoc.geojson', document.getElementById('hydroColor').value, (layer) => {
    hydroLayer = layer;
    if (document.getElementById('hydroCheckbox').checked) hydroLayer.addTo(map);
  });
  loadGeoJSON('data/Nature_LanguedocV2.geojson', document.getElementById('natureColor').value, (layer) => {
    natureLayer = layer;
    if (document.getElementById('natureCheckbox').checked) natureLayer.addTo(map);
  });
  loadGeoJSON('data/routes_languedoc.geojson', document.getElementById('routesColor').value, (layer) => {
    routesLayer = layer;
    if (document.getElementById('routesCheckbox').checked) routesLayer.addTo(map);
  });
}

function updateLayerColor(layer, color) {
  if (!layer) return;
  layer.setStyle({
    color: color,
    fillColor: color,
  });
}

document.getElementById('batimentsCheckbox').addEventListener('change', (e) => {
  if (batimentsLayer) {
    e.target.checked ? batimentsLayer.addTo(map) : map.removeLayer(batimentsLayer);
  }
});
document.getElementById('hydroCheckbox').addEventListener('change', (e) => {
  if (hydroLayer) {
    e.target.checked ? hydroLayer.addTo(map) : map.removeLayer(hydroLayer);
  }
});
document.getElementById('natureCheckbox').addEventListener('change', (e) => {
  if (natureLayer) {
    e.target.checked ? natureLayer.addTo(map) : map.removeLayer(natureLayer);
  }
});
document.getElementById('routesCheckbox').addEventListener('change', (e) => {
  if (routesLayer) {
    e.target.checked ? routesLayer.addTo(map) : map.removeLayer(routesLayer);
  }
});

document.getElementById('batimentsColor').addEventListener('input', (e) => {
  updateLayerColor(batimentsLayer, e.target.value);
});
document.getElementById('hydroColor').addEventListener('input', (e) => {
  updateLayerColor(hydroLayer, e.target.value);
});
document.getElementById('natureColor').addEventListener('input', (e) => {
  updateLayerColor(natureLayer, e.target.value);
});
document.getElementById('routesColor').addEventListener('input', (e) => {
  updateLayerColor(routesLayer, e.target.value);
});

loadAllLayers();
