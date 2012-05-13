/* geolocation.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var geoLocation = {
	watchID: null,
	options: {	frequency: 10000, 	//frequency is not part of W3C and will not be supported in the future
				maximumAge: 10000, 	//Accept a cached position whose age is no greater than the specified time
				timeout: 5000, 		//max time between call and receipt
				enableHighAccuracy: true },
	
	startWatching:function() {
		geoLocation.watchID = navigator.geolocation.watchPosition(geoLocation.onSuccess, geoLocation.onError, geoLocation.options);	
		
		consoleLog("geoLocation watch started, ID: " + geoLocation.watchID);
	},
	
	stopWatching:function() {
		navigator.geolocation.clearWatch(geoLocation.watchID);
		consoleLog("geoLocation watch stopped");
	},
	
	get:function() {
		return navigator.geolocation.getCurrentPosition(function(position) {}, geoLocation.onError);
	},
	
	onSuccess:function(position) {	
		updateTable.geoLocation(position); //update SQL
		
		if (position.coords.speed >=0) {var speedINkph = position.coords.speed * (60*60/1000);} else {var speedINkph = -1;} //calculate speed in km/hr
		
		var element = document.getElementById('geolocation');
		
		//display results in real-time
		if (showRealtimeData) {
			element.innerHTML = 'Latitude: '          + position.coords.latitude          + '<br />' +
								'Longitude: '         + position.coords.longitude         + '<br />' +
								'Altitude: '          + position.coords.altitude          + '<br />' +
								'Accuracy: '          + position.coords.accuracy          + '<br />' +
								'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br />' +
								'Heading: '           + position.coords.heading           + '<br />' +
								'Speed: '             + position.coords.speed + ' -- ' + speedINkph + '<br />' +
								'Timestamp: '         + new Date(position.timestamp)      + '<br />';
		}
	},
	
	// onError Callback receives a PositionError object
	onError:function(error) {
		consoleLog('geoLocation error, code: ' + error.code + ' & Message: ' + error.message);
	},
}
