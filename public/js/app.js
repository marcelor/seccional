  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }


  var map = L.map('map'); // .setView([-34.918, -56.154], 14);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyY2Vsb3IiLCJhIjoiY2loNDU2dDE1MHk4cTRwbTN2cnVjM2R3eCJ9.Mkw4lMJisM1Bt6Sg3gypqQ', {
    maxZoom: 18,
    attribution: '',
    id: 'marcelor.o6jchnm4'
  }).addTo(map);

  // L.marker([-34.906944,-56.150148]).addTo(map);
  // L.marker([-34.894212,-56.112052]).addTo(map);

  // control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h4>Seccionales policiales del departamento de Montevideo</h4>' +  (props ?
      '<b>' + props.title + '</b><br/>' + props.description : 'Haz click sobre una seccional');
  };

  info.addTo(map);


  // get color depending on population density value
  function getColor(d) {
    return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
              '#FFEDA0';
  }

  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.density)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    //info.update(e.target.properties);
  }

  function onEachFeature(feature, layer) {
    var latlng = feature.properties.location.split(',');
    var lat = latlng[0];
    var lng = latlng[1];
    console.log('lat: ' + lat + ' lng: ' + lng);
    //L.marker([lat,lng]).addTo(map);
    L.marker([lat,lng], {icon: L.AwesomeMarkers.icon({icon: 'cog',  prefix: 'glyphicon', markerColor: 'orange'})}).addTo(map);

    layer.on({
      mouseover: highlightFeature,
      //mouseout: resetHighlight,
      click: function(e) {
        zoomToFeature(e);
        info.update(layer.feature.properties);
      }
    });
  }

  geojson = L.geoJson(seccionalData, {
    //style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  getLocation();

  var highlightStyle = {
    color: '#2262CC',
    weight: 3,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
  };

  function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    //var lat = -34.918;
    //var lng = -56.154
    console.log("Latitude: " + lat + " - Longitude: " + lng);
    leafletPip.bassackwards = true;
    var results = leafletPip.pointInLayer([lat, lng], geojson, true);
    //console.log('Seccionales: ' + results);
    console.log('Tu seccional es: ' + results[0].feature.properties.title);
    results[0].setStyle(highlightStyle);
  };

  function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map);
      //.bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
  }

  map.on('locationfound', onLocationFound);

  map.locate({setView: true, maxZoom: 13});

  var legend = L.control({position: 'bottomright'});

  // legend.onAdd = function (map) {

  //     var div = L.DomUtil.create('div', 'info legend'),
  //         grades = [0, 10, 20, 50, 100, 200, 500, 1000],
  //         labels = [],
  //         from, to;

  //     for (var i = 0; i < grades.length; i++) {
  //         from = grades[i];
  //         to = grades[i + 1];

  //         labels.push(
  //             '<i style="background:' + getColor(from + 1) + '"></i> ' +
  //             from + (to ? '&ndash;' + to : '+'));
  //     }

  //     div.innerHTML = labels.join('<br>');
  //     return div;
  // };

  //legend.addTo(map);