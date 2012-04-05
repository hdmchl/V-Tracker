//helper scripts

function clearDiv(divId) {
	document.getElementById(divId).innerHTML = '';
}

var buffer1 = '';
var buffer2 = '';
var buffer3 = '';
var buffer4 = '';
var buffer5 = '';
var alertsConsoleCounter = 1;
function consoleLog(message) {
	console.log(message);
	
	buffer1 = buffer2;
	buffer2 = buffer3;
	buffer3 = buffer4;
	buffer4 = buffer5;
	buffer5 = alertsConsoleCounter + ") " + message + "<br />";

	document.getElementById('alertsConsole').innerHTML = buffer1 + buffer2 + buffer3 + buffer4 + buffer5;
		
	alertsConsoleCounter++;
}

function startDataCollection() {
	document.getElementById('loader').style.visibility = 'visible';
	
	accelerometer_startWatching();
	compass_startWatching()
	
}

function analyse() {
	var x = parseFloat(acceleration.x);
	var y = parseFloat(acceleration.y);
	var z = parseFloat(acceleration.z);
	
	var r1 = Math.atan2(z,x);
	var r2 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(x,2)+Math.pow(z,2)), -1) );
	var roll = (r1 - r2) * 180/Math.PI;
	
	var p1 = Math.asin( Math.max(gravity / Math.sqrt(Math.pow(y,2)+Math.pow(z,2)), -1) );
	var p2 = Math.atan2(z,y); 
	var pitch = (p1 - p2) * 180/Math.PI;
	
	console.log('Roll: ' + roll);
	console.log('Pich: ' + pitch);
	
}
