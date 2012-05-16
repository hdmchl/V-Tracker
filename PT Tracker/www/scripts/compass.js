/* compass.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var compassObj = {
	watchID: null,
	
	options: { frequency: 1000 }, //Set update interval in milliseconds
	
	data: {magneticHeading: null, trueHeading: null, headingAccuracy: null, timestamp:null},

	// Start watching the compass
	startWatching:function() {	
		this.watchID = navigator.compass.watchHeading(this.onSuccess, this.onError, this.options);
		consoleLog("compass.watch started, ID: " + this.watchID);
	},
	
	// Stop watching the compass
	stopWatching:function() {
		if (this.watchID) {
			navigator.compass.clearWatch(this.watchID);
			consoleLog("compass.watch stopped");	
		}
	},
	
	// onSuccess: take a snapshot of the current heading - can't use "this." in here...
	onSuccess:function(compassHeading) {
		updateTable.compass(compassHeading); //update SQL
		
		compassObj.data.magneticHeading = compassHeading.magneticHeading;
		compassObj.data.trueHeading = compassHeading.trueHeading;
		compassObj.data.headingAccuracy = compassHeading.headingAccuracy;
		compassObj.data.timestamp = compassHeading.timestamp;

		if (showRealtimeData) {compassObj.updateDisplay();}
	},
	
	// onError: Failed to get the compass heading
	onError:function(compassError) {
		consoleLog('Could not get compass data! Error: ' + compassError.code);
	},

	//display results in real-time
	updateDisplay:function() {
		var element = document.getElementById('compass');
		
			element.innerHTML = 'Magnetic heading: ' + Math.round(100000*parseFloat(this.data.magneticHeading))/100000 + '<br />' +
								'True heading: ' + Math.round(100000*parseFloat(this.data.trueHeading))/100000 + '<br />' +
								'Heading accuracy: ' + this.data.headingAccuracy + '<br />' +
								'Timestamp: ' + new Date(this.data.timestamp);
	}
}