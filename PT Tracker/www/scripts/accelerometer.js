// The watch id references the current `watchAcceleration`
var watchID = null;

// Start watching the acceleration
//
function startWatch() {
	
	// Update acceleration every 500 milliseconds
	var options = { frequency: 500 };
	
	watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}

// Stop watching the acceleration
//
function stopWatch() {
	if (watchID) {
		navigator.accelerometer.clearWatch(watchID);
		watchID = null;
	}
}

// onSuccess: Get a snapshot of the current acceleration
//
function onSuccess(acceleration) {
	var element = document.getElementById('acceleration');
	element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
						'Acceleration Y: ' + acceleration.y + '<br />' +
						'Acceleration Z: ' + acceleration.z + '<br />' +
						'Timestamp: '      + acceleration.timestamp + '<br />';
}

// onError: Failed to get the acceleration
//
function onError() {
	alert('onError!');
}