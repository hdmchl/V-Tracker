/* gyroscope.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */
var gyroscope = {
	timer: null,
	
	orientation: {alpha: null, beta: null, gamma: null},
	
	startWatching:function() {
		window.addEventListener("deviceorientation", gyroscope.updateOrientation);
		gyroscope.timer = setTimeout(gyroscope.sample(),1000);
		consoleLog("gyroscope.watch started");
	},
	
	stopWatching:function() {
		window.removeEventListener("deviceorientation", gyroscope.updateOrientation);
		clearTimeout(gyroscope.timer);
		consoleLog("gyroscope.watch stopped");
	},
	
	sample:function() {
		updateTable.gyroscope(this.orientation); //update SQL
		gyroscope.timer = setTimeout(function() {gyroscope.sample();}, 1000);
	},

	updateOrientation:function(orientation) {
		gyroscope.orientation.alpha = orientation.alpha;
		gyroscope.orientation.beta = orientation.beta;
		gyroscope.orientation.gamma = orientation.gamma;
		
		//display results in real-time
		if (showRealtimeData) {
			var element = document.getElementById('gyroscope');
			
			element.innerHTML = 	'Alpha: '  + orientation.alpha +
									'<br>Beta: '  + orientation.beta  +
									'<br>Gamma: ' + orientation.gamma;
		}
	}
}