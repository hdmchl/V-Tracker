/* accelerometer.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

function calculate(acceleration,orientation) {
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
}

var accelX = 0;
var accelY = 0;
var accelZ = 10.15;

function highPassFilter(acceleration) {
	var kFilteringFactor = 0.96;
	
	// Subtract the low-pass value from the current value to get a simplified high-pass filter
    accelX = acceleration.x - ( (acceleration.x * kFilteringFactor) + (accelX * (1.0 - kFilteringFactor)) );
    accelY = acceleration.y - ( (acceleration.y * kFilteringFactor) + (accelY * (1.0 - kFilteringFactor)) );
    accelZ = acceleration.z - ( (acceleration.z * kFilteringFactor) + (accelZ * (1.0 - kFilteringFactor)) );
	
	var ret = accelX + ' || ' + accelY + ' || ' + accelZ; 
	
	return ret;
}

var accelerometer_watchID = null;

// Start watching the acceleration
function accelerometer_startWatching() {	
	var options = { frequency: 200 }; //Update acceleration every xxx milliseconds
	
	accelerometer_watchID = navigator.accelerometer.watchAcceleration(accelerometer_onSuccess, accelerometer_onError, options);
	
	consoleLog("accelerometer_watch started");
}

// Stop watching the acceleration
function accelerometer_stopWatching() {
	if (accelerometer_watchID) {
		navigator.accelerometer.clearWatch(accelerometer_watchID);
		accelerometer_watchID = null;
		consoleLog("accelerometer_watchID stopped");	
	}
}


// onSuccess: Get a snapshot of the current acceleration
function accelerometer_onSuccess(acceleration) {
	updateAccelerometerTable(acceleration); //update SQL
		
	//display results in real-time
	if (showRealtimeData) {
		var element = document.getElementById('acceleration');
		
		element.innerHTML = 'Acceleration X: ' + Math.round(10000*parseFloat(acceleration.x))/10000 + '<br />' +
							'Acceleration Y: ' + Math.round(10000*parseFloat(acceleration.y))/10000 + '<br />' +
							'Acceleration Z: ' + Math.round(10000*parseFloat(acceleration.z))/10000 + '<br />' +
							'Timestamp: '      + new Date(acceleration.timestamp) + '<br />' +
							'Roll: '           + calculate(acceleration,'roll') + '<br />' +
							'Pitch: '          + calculate(acceleration,'pitch') + '<br />' +
		                    'filtered: '       + highPassFilter(acceleration) + '<br />';
	}
}

// onError: Failed to get the acceleration
function accelerometer_onError() {
	consoleLog('Error: Could not get accelerometer data!');
}