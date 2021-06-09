let map;
let mapLong = 144.946457;
let mapLat = -37.840935;
let userLat = -37.840935;
let userLong = 144.946457;
let mapZoom=12;
let directionsDisplay;
let directionsService;

$(document).ready(function () {

  //geting user current location
  getUserCurrentLocation();

  //navigate_to_location(select_lat,select_lon);
  $('.bs-timepicker').timepicker();

    //handling recenter feature of the parking map page
    $( "#btn-viewme" ).click(function() {
       //geting user current location
      getUserCurrentLocation();
      map.zoom = 15;
      map.panTo({ lat: parseFloat(userLat), lng: parseFloat(userLong)}) 
  });

});
  
//seting up user current location on the map function
getUserCurrentLocation = function (){

  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function (position) {
      userLat = position.coords.latitude;
      userLong = position.coords.longitude;
    });
    
  }else{
    alert('Geo location is not supported');
  }
}

function initMap() {
  const markerArray = [];
  // Instantiate a directions service.
  //const directionsService = new google.maps.DirectionsService();
  // Create a map and center it on Manhattan.

  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(position){
      userLat = position.coords.latitude;
      userLong = position.coords.longitude;
    });
    
  }else{
    alert('Geo location is not supported');
  }


  directionsService = new google.maps.DirectionsService();
  directionsDisplay=new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: parseFloat(mapZoom),
    center: { lat: parseFloat(userLat), lng: parseFloat(userLong) },
    streetViewControl:false,
    mapTypeControl: false,
    styles:[
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
}

$(window).on('load',function()
{
  navigate_to_location(select_lat,select_lon);
});

function navigate_to_location(sel_lat,sel_long)
{
  var start=new google.maps.LatLng(parseFloat(userLat),parseFloat(userLong));

  var end = new google.maps.LatLng(parseFloat(sel_lat),parseFloat(sel_long));

  var bounds=new google.maps.LatLngBounds();
  bounds.extend(start);
  bounds.extend(end);
  map.fitBounds(bounds);

  var request={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request,function(response,status){
    if(status==google.maps.DirectionsStatus.OK)
    {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
    }
    else
    {
      console.log("Direction request failed:"+status);
    }

  });
}