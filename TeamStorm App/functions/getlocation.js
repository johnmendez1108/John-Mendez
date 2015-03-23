document.addEventListener("deviceready",initialize,false);
var geocoder;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}
// Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
	///alert(lat +' and '+lng );
	googlemaps(lat, lng);
    //codeLatLng(lat, lng);
}

function errorFunction() {
    alert("Geocoder failed");
}

function initialize() {
    geocoder = new google.maps.Geocoder();
	

}

 

  
 function googlemaps(lat, lng) 
 {
 var cur_loc;
	 jQuery.ajax({ 
			type: 'get', 
			dataType: "json",
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false&key=AIzaSyCIoG15SkN9JHBxAoEsrjOrLAtLxZnZvas', 
			success: function (data) {
			
				cur_loc=data.results[0].address_components[1].short_name;
				cur_loc+=', '+data.results[0].address_components[2].short_name;
				cur_loc+=', '+data.results[0].address_components[3].short_name;
				
				//alert(cur_loc);
				
				window.localStorage["cur_loc"]= cur_loc; 
			
			},				
			error: function (err) {
        
			console.log(err.message);
			}}); 
						
 }
  