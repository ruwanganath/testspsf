let map;
let mapLong = 144.946457;
let mapLat = -37.840935;
let userLat = -37.840935;
let userLong = 144.946457;
let mapZoom=12;
let directionsDisplay;
let directionsService;

$(document).ready(function () {

  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(position){
      userLat = position.coords.latitude;
      userLong = position.coords.longitude;
    });
    
  }else{
    alert('Geo location is not supported');
  }

  //navigate_to_location(select_lat,select_lon);
  $('.bs-timepicker').timepicker();

});
  
 

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
  });

  


  var myLatLng = new google.maps.LatLng(parseFloat(userLat), parseFloat(userLong));
  new google.maps.Marker({
    position: myLatLng,
    icon:"/images/yous.png",
    map,
    title: '',            
  });

  


  //navigate_to_location(select_lat,select_lon);
  // Create a renderer for directions and bind it to the map.
  // const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
  // // Instantiate an info window to hold step text.
  // const stepDisplay = new google.maps.InfoWindow();
  // // Display the route between the initial start and end selections.
  // calculateAndDisplayRoute(
  //   directionsRenderer,
  //   directionsService,
  //   markerArray,
  //   stepDisplay,
  //   map
  // );

  // // Listen to change events from the start and end lists.
  // const onChangeHandler = function () {
  //   calculateAndDisplayRoute(
  //     directionsRenderer,
  //     directionsService,
  //     markerArray,
  //     stepDisplay,
  //     map
  //   );
  // };


  // document.getElementById("start").addEventListener("change", onChangeHandler);
  // document.getElementById("end").addEventListener("change", onChangeHandler);
}

$(window).on('load',function()
{
  navigate_to_location(select_lat,select_lon);
});

function navigate_to_location(sel_lat,sel_long)
{


  console.log(userLat);
  console.log(userLong);

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

function calculateAndDisplayRoute(
  directionsRenderer,
  directionsService,
  markerArray,
  stepDisplay,
  map
) {
  // First, remove any existing markers from the map.
  for (let i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }
  // Retrieve the start and end locations and create a DirectionsRequest using
  // WALKING directions.
  directionsService.route(
    {
      origin: document.getElementById("start").value,
      destination: document.getElementById("end").value,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (result, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === "OK" && result) {
        document.getElementById("warnings-panel").innerHTML =
          "<b>" + result.routes[0].warnings + "</b>";
        directionsRenderer.setDirections(result);
        showSteps(result, markerArray, stepDisplay, map);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.
  const myRoute = directionResult.routes[0].legs[0];

  for (let i = 0; i < myRoute.steps.length; i++) {
    const marker = (markerArray[i] =
      markerArray[i] || new google.maps.Marker());
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
      stepDisplay,
      marker,
      myRoute.steps[i].instructions,
      map
    );
  }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, "click", () => {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });


}