/* gyroscope.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var gyroscope = {
	startWatching:function() {
		window.addEventListener("deviceorientation", gyroscope.updateOrientation);
		
		consoleLog("gyroscope.watch started");
	},
	
	stopWatching:function() {
		window.removeEventListener("deviceorientation", gyroscope.updateOrientation);
		consoleLog("gyroscope.watch stopped");
	},

	updateOrientation:function(gyroscopeOrientation) {
		//display results in real-time
		if (showRealtimeData) {
			var element = document.getElementById('gyroscope');
			
			element.innerHTML = 	'Alpha: '  + gyroscopeOrientation.alpha +
									'<br>Beta: '  + gyroscopeOrientation.beta  +
									'<br>Gamma: ' + gyroscopeOrientation.gamma;
		}
	}
}