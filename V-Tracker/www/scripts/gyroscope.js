/* gyroscope.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */
var gyroscopeObj = {	
	watchID: null,
	
	options: { frequency: 500 }, //Set update interval in milliseconds
	
	data: {timestamp: null, alpha: null, beta: null, gamma: null},
	
	startWatching:function() {
		window.addEventListener("deviceorientation", this.onSuccess);
		this.watchID = setTimeout("gyroscopeObj.sample()", this.options.frequency);
		consoleLog.add("gyroscope.watch started");
	},
	
	stopWatching:function() {
		window.removeEventListener("deviceorientation", this.onSuccess);
		clearTimeout(this.watchID);
		consoleLog.add("gyroscope.watch stopped");
	},
	
	sample:function() {
		storage.updateSQLTable.gyroscope(this.data); //update SQL
		this.watchID = setTimeout("gyroscopeObj.sample()", this.options.frequency);
	},
	
	// onSuccess: take a snapshot of the orientation - can't use "this." in here...
	onSuccess:function(orientation) {
		gyroscopeObj.data.alpha = orientation.alpha;
		gyroscopeObj.data.beta = orientation.beta;
		gyroscopeObj.data.gamma = orientation.gamma;
		gyroscopeObj.data.timestamp = new Date().getTime();
		
		if (showRealtimeData) {gyroscopeObj.updateDisplay();}
	},
	
	//display results in real-time
	updateDisplay:function() {
		var element = document.getElementById('gyroscope');
			
			element.innerHTML = 	'Alpha (yaw): '  	+ this.data.alpha + '<br />' +
									'Beta (pitch): '  	+ this.data.beta  + '<br />' +
									'Gamma (roll): ' 	+ this.data.gamma + '<br />' +
									'Timestamp: '       + formatDate(this.data.timestamp);
	}
}