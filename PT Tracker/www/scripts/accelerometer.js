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

	var x = parseFloat(acceleration.x);
	var y = parseFloat(acceleration.y);
	var z = parseFloat(acceleration.z);
	
	var r1 = Math.atan2(z,x);
	var r2 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(x,2)+Math.pow(z,2)), -1) );
	var roll = (r1 - r2) * 180/Math.PI;
	
	var p1 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(y,2)+Math.pow(z,2)), -1) );
	var p2 = Math.atan2(z,y); 
	var pitch = (p1 - p2) * 180/Math.PI;
	
	console.log('Roll: ' + roll);
	console.log('Pich: ' + pitch);
	
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