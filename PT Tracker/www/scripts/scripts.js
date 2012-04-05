/* scripts.js
 *
 * These are helper scripts
 * 
 */

//declare global variables
var showRealtimeData = true;

//clear a div on request
function clearDiv(divId) {
	document.getElementById(divId).innerHTML = '';
}

//console logging for alerts
var alertsConsoleLog = [];
var alertsConsoleCounter = 1;
function consoleLog(message) {
	console.log(message); //display alerts in console
	alertsConsoleLog[alertsConsoleCounter] = alertsConsoleCounter + ') ' + message + '<br />';
		
	//display latest alerts in window
	var buffer = ''
	for(i=5;i>0;i--) {
		if (alertsConsoleLog[alertsConsoleCounter-i]) {
			buffer = buffer + alertsConsoleLog[alertsConsoleCounter-i];
		}
	}
	
	document.getElementById('alertsConsole').innerHTML = buffer;
	
	alertsConsoleCounter++; //increment counter
}

//Data-collection
function initDataCollection() {
	storage_clear(); //clear database in preparation for data collection
	
	//clear dom
	clearDiv('alertsConsoleLog');
	clearDiv('geolocation');
	clearDiv('acceleration');
	clearDiv('compass');
	clearDiv('databases');
}

function startDataCollection() {
	document.getElementById('loader').style.visibility = 'visible';
	showRealtimeData = false;
	
	geoLocation_startWatching();
	accelerometer_startWatching();
	compass_startWatching();	
}

function stopDataCollection() {
	geoLocation_stopWatching();	
	accelerometer_stopWatching();
	compass_stopWatching();
	
	showRealtimeData = true;
	document.getElementById('loader').style.visibility = 'hidden';
}

//Debugging Access
function displayAlertsConsoleLog() {
	var buffer = '';

	for(i=1;i<alertsConsoleLog.length;i++) {
		buffer = buffer + alertsConsoleLog[i];
	}

	document.getElementById('alertsConsoleLog').innerHTML = buffer;
}
