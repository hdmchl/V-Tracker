/* sensorsAPI.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************* geolocationAPI ************************************//
var geolocationAPI = {
	watchID: null,
	
	options: {	frequency: 10000, 	//frequency is not part of W3C and will not be supported in the future
				maximumAge: 10000, 	//Accept a cached position whose age is no greater than the specified time
				timeout: 5000, 		//max time between call and receipt
				enableHighAccuracy: false },
				
	data: {	timestamp: [],
			latitude: [],
			longitude: [],
			altitude: [],
			accuracy: [],
			altitudeAccuracy: [],
			heading: [],
			speed: [] },
			
	successCBs: [], //this is an array of functions that get called "onSuccess"
	
	// Start watching the geolocation
	startWatching:function() {
		geolocationAPI.watchID = navigator.geolocation.watchPosition(geolocationAPI.onSuccess, geolocationAPI.onError, geolocationAPI.options);	
		console.log("geoLocation watch started, ID: " + geolocationAPI.watchID);
	},
	
	// Stop watching the geolocation
	stopWatching:function() {
		navigator.geolocation.clearWatch(geolocationAPI.watchID);
		console.log("geoLocation watch stopped");
		geolocationAPI.watchID = null; //reset the watch id
	},
	
	// get geolocation
	get:function() {
		navigator.geolocation.getCurrentPosition(geolocationAPI.onSuccess, geolocationAPI.onError);
	},
	
	// onSuccess: take a snapshot of the current location - can't use "this." in here...
	onSuccess:function(position) {	
		geolocationAPI.data.timestamp.push(position.timestamp);
		geolocationAPI.data.latitude.push(position.coords.latitude);
		geolocationAPI.data.longitude.push(position.coords.longitude);
		geolocationAPI.data.accuracy.push(position.coords.accuracy);
		geolocationAPI.data.altitude.push(position.coords.altitude);
		geolocationAPI.data.altitudeAccuracy.push(position.coords.altitudeAccuracy);
		geolocationAPI.data.heading.push(position.coords.heading);
		geolocationAPI.data.speed.push(position.coords.heading);
		
		//execute onSuccess callback functions
		for(i=0;i<geolocationAPI.successCBs.length;i++) {
			geolocationAPI.successCBs[i](position);
		}
	},
	
	// onError Callback receives a PositionError object
	onError:function(error) {
		console.log('geoLocation error, Code: ' + error.code + ' & Message: ' + error.message);
	},
	
	// return HTML formatted geolocation data
	formatDataForHTML:function(geolocationData) {
		if (geolocationData.speed >=0) {var speedINkph = geolocationData.speed * (60*60/1000);} else {var speedINkph = -1;} //calculate speed in km/hr

		var formattedData = 'Latitude: '          + geolocationData.latitude          + '<br />' +
							'Longitude: '         + geolocationData.longitude         + '<br />' +
							'Accuracy: '          + geolocationData.accuracy          + '<br />' +
							'Altitude: '          + geolocationData.altitude          + '<br />' +
							'Altitude Accuracy: ' + geolocationData.altitudeAccuracy  + '<br />' +
							'Heading: '           + geolocationData.heading           + '<br />' +
							'Speed: '             + geolocationData.speed + ' || ' + speedINkph + '<br />' +
							'Timestamp: '         + formatDate(geolocationData.timestamp)       + '<br />';
		return formattedData;
	},
	
	// return SQL formatted geolocation data
	formatDataForSQL:function(geolocationData) {
		//this variable can be created dynamically using the "geolocationAPI.data" array property
		var formattedData = '"' + new Date(geolocationData.timestamp)      + '",' +
							'"' + geolocationData.coords.latitude          + '",' +
							'"' + geolocationData.coords.longitude         + '",' +
							'"' + geolocationData.coords.altitude          + '",' +
							'"' + geolocationData.coords.accuracy          + '",' +
							'"' + geolocationData.coords.altitudeAccuracy  + '",' +
							'"' + geolocationData.coords.heading           + '",' +
							'"' + geolocationData.coords.speed             + '"';
		return formattedData;
	}
}
//*********************************** END geolocationAPI **********************************//