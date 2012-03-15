var geoLocation_timer = null;

function geoLocation_startWatching() {
	geoLocation_get();
	console.log("geoLocation watch started");
}

function geoLocation_get() {
	navigator.geolocation.getCurrentPosition(geoLocation_onSuccess, geoLocation_onError);
}

var geoLocation_onSuccess = function(position) {	
	updateGeoLocationTable(position);
	
	var speedINkph = position.coords.speed * (60*60/1000);
	
	var location = 
		'Latitude: '          + position.coords.latitude          + '<br />' +
		'Longitude: '         + position.coords.longitude         + '<br />' +
		'Altitude: '          + position.coords.altitude          + '<br />' +
		'Accuracy: '          + position.coords.accuracy          + '<br />' +
		'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br />' +
		'Heading: '           + position.coords.heading           + '<br />' +
		'Speed: '             + position.coords.speed + ' -- ' + speedINkph + '<br />' +
		'Timestamp: '         + new Date(position.timestamp)      + '<br />';
	
	document.getElementById('geolocation').innerHTML = location;
	
	geoLocation_timer = setTimeout("geoLocation_get()", 200);
}

// onError Callback receives a PositionError object
function geoLocation_onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

function geoLocation_stopWatching() {
	clearTimeout(geoLocation_timer);
	console.log("geoLocation_timer stopped");
}
