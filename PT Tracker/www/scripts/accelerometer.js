var accelerometer_watchID = null;

// Start watching the acceleration
function accelerometer_startWatching() {	
	
	var options = { frequency: 500 }; //Update acceleration every 500 milliseconds
	
	accelerometer_watchID = navigator.accelerometer.watchAcceleration(accelerometer_onSuccess, accelerometer_onError, options);
}

// Stop watching the acceleration
function accelerometer_stopWatching() {
	if (accelerometer_watchID) {
		navigator.accelerometer.clearWatch(accelerometer_watchID);
		accelerometer_watchID = null;
	}
}

// onSuccess: Get a snapshot of the current acceleration
function accelerometer_onSuccess(acceleration) {
	updateAccelerometerTable(acceleration); //update SQL
	
	//display results in real-time
	var element = document.getElementById('acceleration');
	
	element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
						'Acceleration Y: ' + acceleration.y + '<br />' +
						'Acceleration Z: ' + acceleration.z + '<br />' +
						'Timestamp: '      + new Date(acceleration.timestamp) + '<br />';
}

// onError: Failed to get the acceleration
function accelerometer_onError() {
	consoleLog('Error: Could not watch accelerometer!');
}