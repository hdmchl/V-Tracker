var compass_watchID = null;

// Start watching the acceleration
function compass_startWatching() {	
	
	var options = { frequency: 300 }; //Update acceleration every xxx milliseconds
	
	compass_watchID = navigator.compass.watchHeading(compass_onSuccess, compass_onError, options);
}

// Stop watching the acceleration
function compass_stopWatching() {
	if (compass_watchID) {
		navigator.compass.clearWatch(compass_watchID);
		compass_watchID = null;
	}
}

// onSuccess: Get a snapshot of the current heading
function compass_onSuccess(heading) {
	updateCompassTable(heading); //update SQL
	
	//display results in real-time
	var element = document.getElementById('compass');
	
	element.innerHTML = 'Heading: ' + heading.magneticHeading;
}

// onError: Failed to get the acceleration
function compass_onError(compassError) {
	consoleLog('Could not watch compass! Error: ' + compassError.code);
}