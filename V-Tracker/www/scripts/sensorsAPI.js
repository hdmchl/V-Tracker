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
		if (geolocationAPI.watchID) {
			navigator.geolocation.clearWatch(geolocationAPI.watchID);
			console.log("geoLocation watch stopped");
			geolocationAPI.watchID = null; //reset the watch id
		}
	},
	
	// get geolocation
	get:function() {
		navigator.geolocation.getCurrentPosition(geolocationAPI.onSuccess, geolocationAPI.onError);
		console.log("geoLocation requested");
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

		var formattedData = 'Latitude: '          + geolocationData.coords.latitude          + '<br />' +
							'Longitude: '         + geolocationData.coords.longitude         + '<br />' +
							'Accuracy: '          + geolocationData.coords.accuracy          + '<br />' +
							'Altitude: '          + geolocationData.coords.altitude          + '<br />' +
							'Altitude Accuracy: ' + geolocationData.coords.altitudeAccuracy  + '<br />' +
							'Heading: '           + geolocationData.coords.heading           + '<br />' +
							'Speed: '             + geolocationData.coords.speed + ' || ' + speedINkph + '<br />' +
							'Timestamp: '         + formatDate(geolocationData.timestamp)       + '<br />';
		return formattedData;
	},
	
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

//*************************************** compassAPI **************************************//
var compassAPI = {
	watchID: null,
	
	options: { frequency: 1000 }, //Set update interval in milliseconds
	
	data: {	timestamp:null, 
			magneticHeading: null, 
			trueHeading: null,
			headingAccuracy: null },
			
	successCBs: [], //this is an array of functions that get called "onSuccess"

	// Start watching the compass
	startWatching:function() {	
		compassAPI.watchID = navigator.compass.watchHeading(compassAPI.onSuccess, compassAPI.onError, compassAPI.options);
		console.log("compass.watch started, ID: " + compassAPI.watchID);
	},
	
	// Stop watching the compass
	stopWatching:function() {
		if (compassAPI.watchID) {
			navigator.compass.clearWatch(compassAPI.watchID);
			console.log("compass.watch stopped");	
			compassAPI.watchID = null; //reset the watch id
		}
	},
	
	onSuccess:function(compassHeading) {
		compassAPI.data.magneticHeading = compassHeading.magneticHeading;
		compassAPI.data.trueHeading = compassHeading.trueHeading;
		compassAPI.data.headingAccuracy = compassHeading.headingAccuracy;
		compassAPI.data.timestamp = compassHeading.timestamp;

		//execute onSuccess callback functions
		for(i=0;i<compassAPI.successCBs.length;i++) {
			compassAPI.successCBs[i](compassHeading);
		}
	},
	
	// onError: Failed to get the compass heading
	onError:function(compassError) {
		console.log('Could not get compass data. Error: ' + compassError.code);
	},
	
	// return HTML formatted compass data
	formatDataForHTML:function(compassData) {
		var formattedData = 	'Magnetic heading: ' 	+ Math.round(100000*parseFloat(compassData.magneticHeading))/100000 + '<br />' +
								'True heading: ' 		+ Math.round(100000*parseFloat(compassData.trueHeading))/100000 + '<br />' +
								'Heading accuracy: ' 	+ compassData.headingAccuracy + '<br />' +
								'Timestamp: '			+ formatDate(compassData.timestamp);
		return formattedData;
	},
	
	// return SQL formatted compass data
	formatDataForSQL:function(compassData) {
		//this variable can be created dynamically using the "compassAPI.data" array property
		var formattedData = 	'"' + new Date(compassData.timestamp)  + '",' +               
								'"' + compassData.magneticHeading      + '",' + 
								'"' + compassData.trueHeading    	   + '",' + 
								'"' + compassData.headingAccuracy      + '"';
		return formattedData;
	}
}
//************************************* END compassAPI ************************************//

//************************************ accelerometerAPI ***********************************//
var accelerometerAPI = {
	watchID: null,
	
	options: { frequency: 200 }, //Set update interval in milliseconds - check wiki if you're unsure of values
	
	data: {	timestamp: null,
			x: null,
			y: null,
			z: null },
	
	successCBs: [], //this is an array of functions that get called "onSuccess"
	
	// Start watching the acceleration
	startWatching:function() {
		accelerometerAPI.watchID = navigator.accelerometer.watchAcceleration(accelerometerAPI.onSuccess, accelerometerAPI.onError, accelerometerAPI.options);
		console.log("accelerometer.watch started, ID: " + accelerometerAPI.watchID);
	},
	
	// Stop watching the acceleration
	stopWatching:function() {
		if (accelerometerAPI.watchID) {
			navigator.accelerometer.clearWatch(accelerometerAPI.watchID);
			console.log("accelerometer.watch stopped");	
		}
	},
	
	// onSuccess: take a snapshot of the current acceleration - can't use "this." in here...
	onSuccess:function(accelerationData) {
		accelerometerAPI.data.timestamp = accelerometerAPI.timestamp;
		accelerometerAPI.data.x = accelerometerAPI.x;
		accelerometerAPI.data.y = accelerometerAPI.y;
		accelerometerAPI.data.z = accelerometerAPI.z;
		
		//execute onSuccess callback functions
		for(i=0;i<accelerometerAPI.successCBs.length;i++) {
			accelerometerAPI.successCBs[i](accelerationData);
		}
	},
	
	// onError: Failed to get the acceleration
	onError:function() {
		console.log('Error: Could not get accelerometer data!');
	},
	
	// return HTML formatted accelerometer data
	formatDataForHTML:function(accelerationData) {
		var formattedData = 	'Acceleration X: ' + Math.round(100000*parseFloat(accelerationData.x))/100000 + '<br />' +
								'Acceleration Y: ' + Math.round(100000*parseFloat(accelerationData.y))/100000 + '<br />' +
								'Acceleration Z: ' + Math.round(100000*parseFloat(accelerationData.z))/100000 + '<br />' +
								'Timestamp: '      + formatDate(accelerationData.timestamp);
		return formattedData;
	},
	
	// return SQL formatted accelerometer data
	formatDataForSQL:function(accelerationData) {
		//this variable can be created dynamically using the "accelerometerAPI.data" array property
		var formattedData = 	'"' + new Date(accelerationData.timestamp) + '",' +
								'"' + accelerationData.x          + '",' +
								'"' + accelerationData.y          + '",' +
								'"' + accelerationData.z          + '"';
		return formattedData;
	}
}
	
	/*calculateRP:function() {
		//calculate roll and pitch
		var gravity = -10.05;
		
		var x = -parseFloat(this.data.x);
		var y = -parseFloat(this.data.y);
		var z = -parseFloat(this.data.z);
		
		var r1 = Math.atan2(z,x);
		var r2 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(x,2)+Math.pow(z,2)), -1) );
		var roll = (r1 - r2) * 180/Math.PI;
		
		var p1 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(y,2)+Math.pow(z,2)), -1) );
		var p2 = Math.atan2(z,y); 
		var pitch = (p1 - p2) * 180/Math.PI;
		
		var ret =   'Roll: '  + Math.round(100*roll)/100 + '<br />' +
					'Pitch: ' + Math.round(100*pitch)/100 + '<br />';
		
		return ret;
	},

	highPassFilter:function() {
		var kFilteringFactor = 0.96;
		
		// Subtract the low-pass value from the current value to get a simplified high-pass filter
	    this.accelX = acceleration.x - ( (acceleration.x * kFilteringFactor) + (this.accelX * (1.0 - kFilteringFactor)) );
	    this.accelY = acceleration.y - ( (acceleration.y * kFilteringFactor) + (this.accelY * (1.0 - kFilteringFactor)) );
	    this.accelZ = acceleration.z - ( (acceleration.z * kFilteringFactor) + (this.accelZ * (1.0 - kFilteringFactor)) );
		
		var filtered = 'Filtered: ' + this.accelX + ' || ' + this.accelY + ' || ' + this.accelZ; 
		
		return filtered;
	}*/
//********************************** END accelerometerAPI *********************************//

//************************************** gyroscopeAPI *************************************//
var gyroscopeAPI = {	
	watchID: null,
	
	options: { frequency: 500 }, //Set update interval in milliseconds
	
	data: {	timestamp: null,
			alpha: null,
			beta: null,
			gamma: null },
	
	successCBs: [], //this is an array of functions that get called "onSuccess"
	
	startWatching:function() {
		window.addEventListener("deviceorientation", gyroscopeAPI.onSuccess);
		gyroscopeAPI.watchID = setTimeout("gyroscopeAPI.executeCBs()", gyroscopeAPI.options.frequency);
		console.log("gyroscope.watch started, ID: " + gyroscopeAPI.watchID);
	},
	
	stopWatching:function() {
		if (gyroscopeAPI.watchID) {
			window.removeEventListener("deviceorientation", gyroscopeAPI.onSuccess);
			clearTimeout(gyroscopeAPI.watchID);
			console.log("gyroscope.watch stopped");
		}
	},
	
	executeCBs:function() {
		gyroscopeAPI.watchID = setTimeout("gyroscopeAPI.executeCBs()", gyroscopeAPI.options.frequency);
		//execute onSuccess callback functions
		for(i=0;i<gyroscopeAPI.successCBs.length;i++) {
			gyroscopeAPI.successCBs[i](gyroscopeAPI.data);
		}
	},
	
	// onSuccess: take a snapshot of the orientation - can't use "this." in here...
	onSuccess:function(orientation) {
		gyroscopeAPI.data.timestamp = new Date().getTime();
		gyroscopeAPI.data.alpha = orientation.alpha;
		gyroscopeAPI.data.beta = orientation.beta;
		gyroscopeAPI.data.gamma = orientation.gamma;
	},
	
	// return HTML formatted gyro data
	formatDataForHTML:function(orientationData) {
		var formattedData = 	'Alpha (yaw): '  	+ orientationData.alpha + '<br />' +
								'Beta (pitch): '  	+ orientationData.beta  + '<br />' +
								'Gamma (roll): ' 	+ orientationData.gamma + '<br />' +
								'Timestamp: '       + formatDate(orientationData.timestamp);
		return formattedData;
	},
	
	// return SQL formatted gyro data
	formatDataForSQL:function(orientationData) {
		//this variable can be created dynamically using the "gyroscopeAPI.data" array property
		var formattedData = 	'"' + new Date(orientationData.timestamp) 	+ '",' +               
								'"' + orientationData.alpha    	+ '",' +
								'"' + orientationData.beta     	+ '",' +
								'"' + orientationData.gamma    	+ '"';
		return formattedData;
	}
}
//************************************ END gyroscopeAPI ***********************************//