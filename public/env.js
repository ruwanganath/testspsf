let map;
let centerCoords={ lat: -37.840935, lng: 144.946457 };
let mapZoom=12;

$(document).ready(function () {

  var mapLong =  144.946457;
  var mapLat = -37.840935;

   if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(position){
      //console.log('lat : '+position.GeolocationCoordinates.lat+'long : '+position.GeolocationCoordinates.lng)
      console.log(position.coords.latitude)
    });
    
  }else{
    alert('Geo location is not supported');
  }

  //showParkingForSuburb();
  
})

convertJsonToArray = function (json){
  var arrayOutput = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
      arrayOutput.push(json[key]);
  });
  return arrayOutput;
}

showParkingForSuburb = function(){
  var mapLong= 144.946457;
  var mapLat = -37.840935;

  $("#suburblist").change(function(){
    if(this.value==='non'){
      mapLong =  144.946457;
      mapLat = -37.840935;
    }else if(this.value==='carlton'){
      mapLong =  144.969861;
      mapLat = -37.801047;
    }else if(this.value==='carltonnorth'){
      mapLong =  144.973236;
      mapLat = -37.784553;
    }else if(this.value==='docklands'){
      mapLong =  144.946014;
      mapLat = -37.815018;
    }else if(this.value==='eastmelbourne'){
      mapLong =  144.9850;
      mapLat = -37.8130;
    }else if(this.value==='flemington'){
      mapLong =  144.9277;
      mapLat = -37.7833;
    }else if(this.value==='kensington'){
      mapLong =  144.9277;
      mapLat = -37.7941;
    }else if(this.value==='melb3000'){
      mapLong =  144.9639;
      mapLat = -37.8152;
    }else if(this.value==='melb3004'){
      mapLong =  144.9805;
      mapLat = -37.8302;
    }else if(this.value==='northmelb'){
      mapLong =  144.9805;
      mapLat = -37.8302;
    }else if(this.value==='parkville'){
      mapLong =  144.9805;
      mapLat = -37.8302;
    }else if(this.value==='portmelb'){
      mapLong =  144.9805;
      mapLat = -37.8302;
    }else if(this.value==='southwarf'){
      mapLong =  144.9520;
      mapLat = -37.8250;
    }else if(this.value==='southyarra'){
      mapLong =  144.9805;
      mapLat = -37.8302;
    }else if(this.value==='southbank'){
      mapLong =  144.9805;
      mapLat = -37.8302;
    }else if(this.value==='westmelb'){
      mapLong =  144.9291;
      mapLat = -37.8089;
    }
  });
  centerCoords = { lat: mapLat, lng: mapLong };
  mapZoom = 15; 
}

function initMap() {
  var mapLong =  144.946457;
  var mapLat = -37.840935;
  
  map = new google.maps.Map(document.getElementById("map"), {
    center: centerCoords,
    zoom: mapZoom,
    streetViewControl:false,
  });

  $.ajax({
    url: '/getAllAvailableParkingData',
    method: "GET",
    success: function(data) {
  
      jsonData = JSON.parse(data);
      var keys = Object.keys(jsonData);
     
      keys.forEach(function(key){
          let myLatLng = { lat: parseFloat(jsonData[key].lat), lng: parseFloat(jsonData[key].lon)};
          new google.maps.Marker({
            position: myLatLng,
            map,
            title: 'Bay/Base Property - '+jsonData[key].bay,
          });
      });
    }
  });

}



  