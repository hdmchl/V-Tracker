var accelerometer_watchID = null;

// Start watching the acceleration
function accelerometer_startWatching() {	
	
	var options = { frequency: 300 }; //Update acceleration every xxx milliseconds
	
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
var gravity = -1.025;

function accelerometer_onSuccess(acceleration) {
	updateAccelerometerTable(acceleration); //update SQL

	//display results in real-time
	var element = document.getElementById('acceleration');
	
	element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
						'Acceleration Y: ' + acceleration.y + '<br />' +
						'Acceleration Z: ' + acceleration.z + '<br />' +
						'Timestamp: '      + new Date(acceleration.timestamp) + '<br />' +
						'Roll: '           + Math.round(100*roll)/100 + '<br />' +
						'Pitch: '          + Math.round(100*pitch)/100 + '<br />';
}

// onError: Failed to get the acceleration
function accelerometer_onError() {
	consoleLog('Error: Could not watch accelerometer!');
}