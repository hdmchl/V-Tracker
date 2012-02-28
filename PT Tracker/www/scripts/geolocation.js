function getLocation() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

var t;

var onSuccess = function(position) {
	var location = '<p>Latitude: '          + position.coords.latitude          + '<br />' +
	'Longitude: '         + position.coords.longitude         + '<br />' +
	'Altitude: '          + position.coords.altitude          + '<br />' +
	'Accuracy: '          + position.coords.accuracy          + '<br />' +
	'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br />' +
	'Heading: '           + position.coords.heading           + '<br />' +
	'Speed: '             + position.coords.speed             + '<br />' +
	'Timestamp: '         + new Date(position.timestamp)      + '<br />' + '</p>';
	
	document.getElementById('position').innerHTML = location;
	
	t = setTimeout("getLocation()",200);
}

// onError Callback receives a PositionError object
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

function stop() {
	clearTimeout(t);
	
}
function clear() {
	document.getElementById('position').innerHTML = '';
}
