var geoLocation_timer = null;

function geoLocation_startWatching() {
	geoLocation_get();
	consoleLog("geoLocation watch started");
}

function geoLocation_get() {
	navigator.geolocation.getCurrentPosition(geoLocation_onSuccess, geoLocation_onError);
}

var geoLocation_onSuccess = function(position) {	
	updateGeoLocationTable(position); //update SQL
	
	var speedINkph = position.coords.speed * (60*60/1000); //calculate speed in km/hr
	
	//display results in real-time
	if (showRealtimeData) {
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
	}
	
	geoLocation_timer = setTimeout("geoLocation_get()", 400); //send off a new request after 400ms
}

// onError Callback receives a PositionError object
function geoLocation_onError(error) {
	consoleLog('Geolocation error code: ' + error.code + ' & Message: ' + error.message);
	
	//try again after 2 seconds	  
	geoLocation_timer = setTimeout("geoLocation_get()", 2000);
}

function geoLocation_stopWatching() {
	clearTimeout(geoLocation_timer);
	geoLocation_timer = null;
	consoleLog("geoLocation_timer stopped");
}
