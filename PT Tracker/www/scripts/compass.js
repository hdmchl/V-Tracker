/* compass.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var compass = {
	watchID: null,
	options: { frequency: 1000 }, //Set frequency for compass in milliseconds

	// Start watching the compass
	startWatching:function() {	
		compass.watchID = navigator.compass.watchHeading(compass.onSuccess, compass.onError, compass.options);
		
		consoleLog("compass.watch started, ID: " + compass.watchID);
	},
	
	// Stop watching the compass
	stopWatching:function() {
		if (compass.watchID) {
			navigator.compass.clearWatch(compass.watchID);
			consoleLog("compass.watch stopped");	
		}
	},
	
	// onSuccess: display a snapshot of the current heading
	onSuccess:function(compassHeading) {
		updateCompassTable(compassHeading); //update SQL
		
		//display results in real-time
		if (showRealtimeData) {
			var element = document.getElementById('compass');
		
			element.innerHTML = 'Heading: ' + compassHeading.magneticHeading;
		}
	},
	
	// onError: Failed to get the compass heading
	onError:function(compassError) {
		consoleLog('Could not get compass data! Error: ' + compassError.code);
	}
}