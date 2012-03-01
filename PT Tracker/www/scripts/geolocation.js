function get_geoLocation() {
	navigator.geolocation.getCurrentPosition(GL_onSuccess, GL_onError);
}

var GL_t;

var GL_onSuccess = function(position) {
	var location = 
		'Latitude: '          + position.coords.latitude          + '<br />' +
		'Longitude: '         + position.coords.longitude         + '<br />' +
		'Altitude: '          + position.coords.altitude          + '<br />' +
		'Accuracy: '          + position.coords.accuracy          + '<br />' +
		'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br />' +
		'Heading: '           + position.coords.heading           + '<br />' +
		'Speed: '             + position.coords.speed             + '<br />' +
		'Timestamp: '         + new Date(position.timestamp)      + '<br />';
	
	document.getElementById('geolocation').innerHTML = location;
	
	GL_t = setTimeout("get_geoLocation()",500);
}

// onError Callback receives a PositionError object
function GL_onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

function GL_stop() {
	clearTimeout(GL_t);
}
