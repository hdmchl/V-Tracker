/* accelerometer.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var accelerometer_watchID = null;

// Start watching the acceleration
function accelerometer_startWatching() {	
	var options = { frequency: 300 }; //Update acceleration every xxx milliseconds
	
	accelerometer_watchID = navigator.accelerometer.watchAcceleration(accelerometer_onSuccess, accelerometer_onError, options);
	
	consoleLog("accelerometer_watch started");
}

// Stop watching the acceleration
function accelerometer_stopWatching() {
	if (accelerometer_watchID) {
		navigator.accelerometer.clearWatch(accelerometer_watchID);
		accelerometer_watchID = null;
		consoleLog("accelerometer_watchID stopped");	
	}
}

// onSuccess: Get a snapshot of the current acceleration
function accelerometer_onSuccess(acceleration) {
	updateAccelerometerTable(acceleration); //update SQL

	var gravity = -10.05;
	
	var x = -parseFloat(acceleration.x);
	var y = -parseFloat(acceleration.y);
	var z = -parseFloat(acceleration.z);
	
	var r1 = Math.atan2(z,x);
	var r2 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(x,2)+Math.pow(z,2)), -1) );
	var roll = (r1 - r2) * 180/Math.PI;
	
	var p1 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(y,2)+Math.pow(z,2)), -1) );
	var p2 = Math.atan2(z,y); 
	var pitch = (p1 - p2) * 180/Math.PI;
	
	//display results in real-time
	if (showRealtimeData) {
		var element = document.getElementById('acceleration');
		
		element.innerHTML = 'Acceleration X: ' + Math.round(100000*parseFloat(acceleration.x))/100000 + ' m/s^2<br />' +
							'Acceleration Y: ' + Math.round(100000*parseFloat(acceleration.y))/100000 + ' m/s^2<br />' +
							'Acceleration Z: ' + Math.round(100000*parseFloat(acceleration.z))/100000 + ' m/s^2<br />' +
							'Timestamp: '      + new Date(acceleration.timestamp) + '<br />' +
							'Roll: '           + Math.round(100*roll)/100 + '<br />' +
							'Pitch: '          + Math.round(100*pitch)/100 + '<br />';
	}
}

// onError: Failed to get the acceleration
function accelerometer_onError() {
	consoleLog('Error: Could not get accelerometer data!');
}