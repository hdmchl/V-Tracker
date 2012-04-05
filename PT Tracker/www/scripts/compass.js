/* compass.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

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
		consoleLog("compass_watchID stopped");	
	}
}

// onSuccess: Get a snapshot of the current heading
function compass_onSuccess(heading) {
	updateCompassTable(heading); //update SQL
	
	//display results in real-time
	if (showRealtimeData) {
		var element = document.getElementById('compass');
	
		element.innerHTML = 'Heading: ' + heading.magneticHeading;
	}
}

// onError: Failed to get the acceleration
function compass_onError(compassError) {
	consoleLog('Could not get compass data! Error: ' + compassError.code);
}