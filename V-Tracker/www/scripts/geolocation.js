/* geolocation.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var geolocationObj = {
	watchID: null,
	
	options: {	frequency: 10000, 	//frequency is not part of W3C and will not be supported in the future
				maximumAge: 10000, 	//Accept a cached position whose age is no greater than the specified time
				timeout: 5000, 		//max time between call and receipt
				enableHighAccuracy: true },
				
	data: {	timestamp: null,
			latitude: null,
			longitude: null,
			altitude: null,
			accuracy: null,
			altitudeAccuracy: null,
			heading: null,
			speed: null },
	
	// Start watching the geolocation
	startWatching:function() {
		this.watchID = navigator.geolocation.watchPosition(this.onSuccess, this.onError, this.options);	
		consoleLog.add("geoLocation watch started, ID: " + this.watchID);
	},
	
	// Stop watching the geolocation
	stopWatching:function() {
		navigator.geolocation.clearWatch(this.watchID);
		consoleLog.add("geoLocation watch stopped");
		this.watchID = null;
	},
	
	// get geolocation
	get:function() {
		navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
	},
	
	// onSuccess: take a snapshot of the current location - can't use "this." in here...
	onSuccess:function(position) {	
		//storage.insertInTable(geolocation(position); //update SQL

		geolocationObj.data.latitude = position.coords.latitude;
		geolocationObj.data.longitude = position.coords.longitude;
		geolocationObj.data.accuracy = position.coords.accuracy;
		geolocationObj.data.altitude = position.coords.altitude;
		geolocationObj.data.altitudeAccuracy = position.coords.altitudeAccuracy;
		geolocationObj.data.heading = position.coords.heading;
		geolocationObj.data.speed = position.coords.heading;
		geolocationObj.data.timestamp = position.timestamp;
		
		if (showRealtimeData) {geolocationObj.updateDisplay();}
	},
	
	// onError Callback receives a PositionError object
	onError:function(error) {
		consoleLog.add('geoLocation error, code: ' + error.code + ' & Message: ' + error.message);
	},
	
	// display results in real-time
	updateDisplay:function() {
		if (this.data.speed >=0) {var speedINkph = this.data.speed * (60*60/1000);} else {var speedINkph = -1;} //calculate speed in km/hr
		
		var element = document.getElementById('geolocation');

		element.innerHTML = 'Latitude: '          + this.data.latitude          + '<br />' +
							'Longitude: '         + this.data.longitude         + '<br />' +
							'Accuracy: '          + this.data.accuracy          + '<br />' +
							'Altitude: '          + this.data.altitude          + '<br />' +
							'Altitude Accuracy: ' + this.data.altitudeAccuracy  + '<br />' +
							'Heading: '           + this.data.heading           + '<br />' +
							'Speed: '             + this.data.speed + ' || ' + speedINkph + '<br />' +
							'Timestamp: '         + formatDate(this.data.timestamp)       + '<br />';
	}
}
