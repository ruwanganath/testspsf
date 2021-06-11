let map;
let mapLong = 144.946457;
let mapLat = -37.840935;
let userLat = -37.840935;
let userLong = 144.946457;
let mapZoom=12;
let directionsDisplay;
let directionsService;
let isAvailable=false;
var getRoute; 
//function as a service to calculate distance among given coordinates
let calculateDistanceFunctionUrl='https://us-south.functions.appdomain.cloud/api/v1/web/ruwanganath%40hotmail.com_dev/default/getDistanceToParkingSpot'


$(document).ready(function () {

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

  //save parking history
  $("#btn-notify").click(function() {

 
    var slat = document.getElementById("slat").value
    var slon = document.getElementById("slon").value

    $.ajax({
        url: calculateDistanceFunctionUrl,
        method: "GET",
        dataType: 'json',
        async:true,
        data: "userLatitude="+userLat+"&userLongitude="+userLong+"&parkingLat="+parseFloat(slat)+"&parkingLon="+parseFloat(slon),
        success: function(data) {
          data = JSON.stringify(data);
          data = JSON.parse(data);
          let distance = parseFloat(data.dist) *1000   
          if(data.res===false){
            alert("You are "+distance+"m from the parking location. You must be with in 50m of the parking spot to use this service.") 
          }               
        }      
      })
  })
  
//seting up user current location on the map function
getUserCurrentLocation = async function (){
    
  if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function (position) {
        userLat = position.coords.latitude;
        userLong = position.coords.longitude;
      }, function (e) {
           alert(e);
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
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

  


  var myLatLng = new google.maps.LatLng(parseFloat(userLat), parseFloat(userLong));
  new google.maps.Marker({
    position: myLatLng,
    icon:"/images/yous.png",
    map,
    title: '',            
  });

  // get updated available parking
  getUpdatedAvailableParkingData = function(){
    // Fetching Parking data from the ajax server
    $.ajax({
      url: '/getAllAvailableParkingData',
      method: "GET",
      success: function(data) {
  
        let arrayNearestParking = [];
        jsonData = JSON.parse(data);
        var keys = Object.keys(jsonData);

        keys.forEach(function(key,index){
          if( (jsonData[key].lat==select_lat) && (jsonData[key].lon==select_lon)){
            isAvailable=true
          }

        });  
       }
    });
  }
}

$(window).on('load',function()
{
  navigate_to_location(select_lat,select_lon);
});
//navigation
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
      getRoute = response.routes[0].legs[0]; //get current route from response 
      //console.log(getRoutes);
      //console.log(routes.steps[i].instructions);
//display step by step directions to user inside the map 
    var navigateHTML="<div id='history_info' style='width: 100%;height:100%;overflow-y:auto'><table class='table table-striped'><tr><th>Your Steps</th></tr>";
      navigateHTML+="<tr>";
      navigateHTML+="<td>"+'Distance '+getRoute.distance.text+' '+'Duration '+getRoute.duration.text+' ';
      navigateHTML+="</td>";
      navigateHTML+="</tr>"; 

    for(var i=0; i < getRoute.steps.length; i++){
      console.log(getRoute.steps[i].instructions+ ' -> ' +getRoute.steps[i].distance.value);
      navigateHTML+="<tr>";
      navigateHTML+="<td>"+getRoute.steps[i].instructions+' -> '+"</td>";
      navigateHTML+="</tr>";
    }

    console.log(getRoute);

    getRoute.steps.instructions+="</table></div>"
    document.getElementById("navigate_data").innerHTML=navigateHTML;}
    else
    {
      console.log("Direction request failed:"+status);
    }
    
  });
}
  