/* accelerometer.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var accelerometer = {
	watchID: null,
	options: { frequency: 200 }, //Set frequency for acceleration in milliseconds
	
	accelX: 0,
	accelY: 0,
	accelZ: 9,
	
	calculateRPY:function(acceleration,orientation) {
		var gravity = -10.05;
		
		var x = -parseFloat(acceleration.x);
		var y = -parseFloat(acceleration.y);
		var z = -parseFloat(acceleration.z);
		
		var r1 = Math.atan2(z,x);
		var r2 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(x,2)+Math.pow(z,2)), -1) );
		var roll = (r1 - r2) * 180/Math.PI;
		
		var p1 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(y,2)+Math.pow(z,2)), -1) );
		var p2 = Math.atan2(z,y); 
		var pitch = (p1 - p2) * 180/Math.PI;
		
		if (orientation == 'roll') {
			return Math.round(100*roll)/100;
		} else if (orientation == 'pitch') {
			return Math.round(100*pitch)/100 ;
		}
	},

	highPassFilter:function(acceleration) {
		var kFilteringFactor = 0.96;
		
		// Subtract the low-pass value from the current value to get a simplified high-pass filter
	    accelerometer.accelX = acceleration.x - ( (acceleration.x * kFilteringFactor) + (accelerometer.accelX * (1.0 - kFilteringFactor)) );
	    accelerometer.accelY = acceleration.y - ( (acceleration.y * kFilteringFactor) + (accelerometer.accelY * (1.0 - kFilteringFactor)) );
	    accelerometer.accelZ = acceleration.z - ( (acceleration.z * kFilteringFactor) + (accelerometer.accelZ * (1.0 - kFilteringFactor)) );
		
		var filtered = accelerometer.accelX + ' || ' + accelerometer.accelY + ' || ' + accelerometer.accelZ; 
		
		return filtered;
	},
	
	// Start watching the acceleration
	startWatching:function() {	
		accelerometer.watchID = navigator.accelerometer.watchAcceleration(accelerometer.onSuccess, accelerometer.onError, accelerometer.options);
		
		consoleLog("accelerometer.watch started, ID: " + accelerometer.watchID);
	},
	
	// Stop watching the acceleration
	stopWatching:function() {
		if (accelerometer.watchID) {
			navigator.accelerometer.clearWatch(accelerometer.watchID);
			consoleLog("accelerometer.watch stopped");	
		}
	},
	
	// onSuccess: Get a snapshot of the current acceleration
	onSuccess:function(acceleration) {
		updateAccelerometerTable(acceleration); //update SQL
			
		//display results in real-time
		if (showRealtimeData) {
			var element = document.getElementById('acceleration');
			
			element.innerHTML = 'Acceleration X: ' + Math.round(10000*parseFloat(acceleration.x))/10000 + '<br />' +
								'Acceleration Y: ' + Math.round(10000*parseFloat(acceleration.y))/10000 + '<br />' +
								'Acceleration Z: ' + Math.round(10000*parseFloat(acceleration.z))/10000 + '<br />' +
								'Timestamp: '      + new Date(acceleration.timestamp) + '<br />' +
								'Roll: '           + accelerometer.calculateRPY(acceleration,'roll') + '<br />' +
								'Pitch: '          + accelerometer.calculateRPY(acceleration,'pitch') + '<br />' +
			                    'filtered: '       + accelerometer.highPassFilter(acceleration) + '<br />';
		}
	},
	
	// onError: Failed to get the acceleration
	onError:function() {
		consoleLog('Error: Could not get accelerometer data!');
	}
}
