/* gyroscope.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */
var gyroscopeObj = {	
	timer: null,
	
	options: { frequency: 500 }, //Set update interval in milliseconds
	
	data: {alpha: null, beta: null, gamma: null},
	
	startWatching:function() {
		window.addEventListener("deviceorientation", this.onSuccess);
		this.timer = setTimeout("gyroscopeObj.sample()", this.options.frequency);
		consoleLog("gyroscope.watch started");
	},
	
	stopWatching:function() {
		window.removeEventListener("deviceorientation", this.onSuccess);
		clearTimeout(this.timer);
		consoleLog("gyroscope.watch stopped");
	},
	
	sample:function() {
		updateTable.gyroscope(this.data); //update SQL
		this.timer = setTimeout("gyroscopeObj.sample()", this.options.frequency);
	},
	
	// onSuccess: take a snapshot of the orientation - can't use "this." in here...
	onSuccess:function(orientation) {
		gyroscopeObj.data.alpha = orientation.alpha;
		gyroscopeObj.data.beta = orientation.beta;
		gyroscopeObj.data.gamma = orientation.gamma;
		
		if (showRealtimeData) {gyroscopeObj.updateDisplay();}
	},
	
	//display results in real-time
	updateDisplay:function() {
		var element = document.getElementById('gyroscope');
			
			element.innerHTML = 	'Alpha (yaw): '  	+ this.data.alpha + '<br />' +
									'Beta (pitch): '  	+ this.data.beta  + '<br />' +
									'Gamma (roll): ' 	+ this.data.gamma;
	}
}