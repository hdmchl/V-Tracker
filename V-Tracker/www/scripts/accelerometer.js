/* accelerometer.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var accelerometerObj = {
	watchID: null,
	
	options: { frequency: 200 }, //Set update interval in milliseconds - check wiki if you're unsure of values
	
	data: {x: null, y: null, z: null, timestamp: null},
	
	// Start watching the acceleration
	startWatching:function() {
		this.watchID = navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, this.options);
		consoleLog.add("accelerometer.watch started, ID: " + this.watchID);
	},
	
	// Stop watching the acceleration
	stopWatching:function() {
		if (this.watchID) {
			navigator.accelerometer.clearWatch(this.watchID);
			consoleLog.add("accelerometer.watch stopped");	
		}
	},
	
	// onSuccess: take a snapshot of the current acceleration - can't use "this." in here...
	onSuccess:function(accelerationData) {
		storage.updateSQLTable.accelerometer(accelerationData); //update SQL
		
		accelerometerObj.data.x = accelerationData.x;
		accelerometerObj.data.y = accelerationData.y;
		accelerometerObj.data.z = accelerationData.z;
		accelerometerObj.data.timestamp = accelerationData.timestamp;
		
		if (showRealtimeData) {accelerometerObj.updateDisplay();}
	},
	
	// onError: Failed to get the acceleration
	onError:function() {
		consoleLog.add('Error: Could not get accelerometer data!');
	},
	
	//display results in real-time
	updateDisplay:function() {
		var element = document.getElementById('acceleration');
		
		element.innerHTML = 'Acceleration X: ' + Math.round(100000*parseFloat(this.data.x))/100000 + '<br />' +
							'Acceleration Y: ' + Math.round(100000*parseFloat(this.data.y))/100000 + '<br />' +
							'Acceleration Z: ' + Math.round(100000*parseFloat(this.data.z))/100000 + '<br />' +
							'Timestamp: '      + formatDate(this.data.timestamp) + '<br />' +
															
							this.calculateRP();
	},
	
	calculateRP:function() {
		var gravity = -10.05;
		
		var x = -parseFloat(this.data.x);
		var y = -parseFloat(this.data.y);
		var z = -parseFloat(this.data.z);
		
		var r1 = Math.atan2(z,x);
		var r2 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(x,2)+Math.pow(z,2)), -1) );
		var roll = (r1 - r2) * 180/Math.PI;
		
		var p1 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(y,2)+Math.pow(z,2)), -1) );
		var p2 = Math.atan2(z,y); 
		var pitch = (p1 - p2) * 180/Math.PI;
		
		var ret =   'Roll: '  + Math.round(100*roll)/100 + '<br />' +
					'Pitch: ' + Math.round(100*pitch)/100 + '<br />';
		
		return ret;
	},

	/*highPassFilter:function() {
		var kFilteringFactor = 0.96;
		
		// Subtract the low-pass value from the current value to get a simplified high-pass filter
	    this.accelX = acceleration.x - ( (acceleration.x * kFilteringFactor) + (this.accelX * (1.0 - kFilteringFactor)) );
	    this.accelY = acceleration.y - ( (acceleration.y * kFilteringFactor) + (this.accelY * (1.0 - kFilteringFactor)) );
	    this.accelZ = acceleration.z - ( (acceleration.z * kFilteringFactor) + (this.accelZ * (1.0 - kFilteringFactor)) );
		
		var filtered = 'Filtered: ' + this.accelX + ' || ' + this.accelY + ' || ' + this.accelZ; 
		
		return filtered;
	}*/
}
