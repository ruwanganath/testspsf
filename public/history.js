let map;
let mapLong = 144.946457;
let mapLat = -37.840935;
let userLat = -37.840935;
let userLong = 144.946457;
let mapZoom=12;
let dup_history_data;
let marker_array=[]
let directionsDisplay;
let directionsService;

var selected_loc_index=0

$(document).ready(function () {
   //handling recenter feature of the parking map page
   $( "#btn-viewme" ).click(function() {
    //geting user current location
   getUserCurrentLocation();
   map.zoom = 15;
   map.panTo({ lat: parseFloat(userLat), lng: parseFloat(userLong)}) 
});
  
})

function initMap() {
  const markerArray = [];
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();
  directionsDisplay=new google.maps.DirectionsRenderer();
  // Create a map and center it on Manhattan.
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: parseFloat(mapZoom),
    center: { lat: parseFloat(mapLat), lng: parseFloat(mapLong) },
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

  for(var i=0;i<dup_history_data.length;i++)
  {
    //console.log(parseFloat(dup_history_data[i]['lat']));
    var hLatLng= new google.maps.LatLng(parseFloat(dup_history_data[i]['lat']),parseFloat(dup_history_data[i]['lon']));
    marker=new google.maps.Marker({
      position: hLatLng,
      icon:'images/opts.png',
      title: 'Duration: '+dup_history_data[i]['duration'],
      map,
      label:{fontSize:'11px',text:dup_history_data[i]['bay_id'].toString()},         
    });
    marker_array.push(marker);
  }

  selected_loc_index=dup_history_data.length-1;

  //Pointing the current location of the user
  if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function(position){
        userLat = position.coords.latitude;
        userLong = position.coords.longitude;
      });
      
    }else{
      alert('Geo location is not supported');
    }
  
}

function zoomTolocation(loc_index)
{
  //var bounds=new google.maps.LatLngBounds();
  //map.fitBounds(bounds);
  map.setZoom(15);
  marker_array[loc_index].setTitle('Duration: '+dup_history_data[loc_index]['duration']);
  map.panTo(marker_array[loc_index].position);
  selected_loc_index=loc_index;
}

function setHistoryData(historydata)
{
  dup_history_data=historydata;
}

function navigate_to_location()
{
  var start=new google.maps.LatLng(parseFloat(userLat),parseFloat(userLong));

  var end = new google.maps.LatLng(marker_array[selected_loc_index].getPosition().lat(),marker_array[selected_loc_index].getPosition().lng());

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