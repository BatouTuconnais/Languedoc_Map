// Initialisation de la carte centrée sur Languedoc (coordonnées approximatives)
var map = L.map('map').setView([43.6, 3.9], 9);

// On enlève le fond OpenStreetMap
// Si tu veux un fond neutre, on peut mettre un fond gris clair
var baseLayer = L.tileLayer('', {
    attribution: ''
}).addTo(map);

// Fonction pour charger une couche GeoJSON, avec option couleur modifiable
function loadGeoJsonLayer(url, defaultColor, layerName) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return L.geoJSON(data, {
                style: function(feature) {
                    return { color: defaultColor, weight: 2, fillOpacity: 0.5 };
                }
            }).addTo(map).bindPopup(layerName);
        })
        .catch(err => {
            console.error("Erreur chargement couche " + layerName, err);
            alert("Erreur chargement couche " + layerName);
        });
}

// Variables pour stocker les couches (pour pouvoir les gérer ensuite)
var routesLayer, hydroLayer, natureLayer;

// Chargement des couches (modifie les noms de fichiers si besoin)
loadGeoJsonLayer('ROUTES_LEGER_UNIFIE.geojson', '#ff0000', 'Routes').then(layer => {
    routesLayer = layer;
    // Ici tu peux ajouter du code pour permettre à l'utilisateur de modifier la couleur
});

loadGeoJsonLayer('Hydro_languedoc.geojson', '#0000ff', 'Hydrologie').then(layer => {
    hydroLayer = layer;
});

loadGeoJsonLayer('Nature_LanguedocV2.geojson', '#008000', 'Végétation').then(layer => {
    natureLayer = layer;
});

// Fonction simple pour afficher ou masquer une couche
function toggleLayer(layer, visible) {
    if (visible) {
        map.addLayer(layer);
    } else {
        map.removeLayer(layer);
    }
}

// Exemple d'utilisation avec checkbox dans ton HTML (à créer)
// <input type="checkbox" id="routesChk" checked> Routes
// <input type="checkbox" id="hydroChk" checked> Hydrologie
// <input type="checkbox" id="natureChk" checked> Végétation

document.getElementById('routesChk').addEventListener('change', function() {
    toggleLayer(routesLayer, this.checked);
});
document.getElementById('hydroChk').addEventListener('change', function() {
    toggleLayer(hydroLayer, this.checked);
});
document.getElementById('natureChk').addEventListener('change', function() {
    toggleLayer(natureLayer, this.checked);
});