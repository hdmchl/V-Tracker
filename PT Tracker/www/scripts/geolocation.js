/* geolocation.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var geoLocation_timer = null;
var geoLocation_watchID = null;

function geoLocation_startWatching() {
	geoLocation_watchID = navigator.geolocation.watchPosition(geoLocation_onSuccess, geoLocation_onError, {
																frequency: 10000, //frequency is not part of W3C and will not be supported in the future
																maximumAge: 10000, //Accept a cached position whose age is no greater than the specified time
																timeout: 5000, //max time between call, and receipt
																enableHighAccuracy: true
															  });	
	consoleLog("geoLocation watch started, ID: " + geoLocation_watchID);
}

function geoLocation_get() {
	navigator.geolocation.getCurrentPosition(geoLocation_onSuccess, geoLocation_onError);
}

var c = 0;
var geoLocation_onSuccess = function(position) {	
	updateGeoLocationTable(position); //update SQL
	localisation_setUserLocation(position); //set localise data
	
	
	c = c+1;
	console.log(c);
	if (c==7){
		console.log('yup');
		notifications_showAlert()
	}
	
	if (position.coords.speed >=0) {var speedINkph = position.coords.speed * (60*60/1000);} else {var speedINkph = -1;} //calculate speed in km/hr
	
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
}

// onError Callback receives a PositionError object
function geoLocation_onError(error) {
	consoleLog('Geolocation error code: ' + error.code + ' & Message: ' + error.message);
}

function geoLocation_stopWatching() {
	navigator.geolocation.clearWatch(geoLocation_watchID);
	geoLocation_timer = null;
	consoleLog("geoLocation watch stopped, ID: " + geoLocation_watchID);
}
