/* scripts.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//********************************** DECLARE GLOBAL VARS **********************************//
var showRealtimeData = true;
//******************************** END DECLARE GLOBAL VARS ********************************//

//************************************* HELPER SCRIPTS ************************************//
//clear a div on request
function clearDiv(divId) {
	document.getElementById(divId).innerHTML = '';
}

//console logging for alerts
var alertsConsoleLog = [];
function consoleLog(message) {
	updateConsoleLogTable(message); //update SQL and console.log
	
	alertsConsoleLog[alertsConsoleLog.length] = alertsConsoleLog.length + ') ' + message + '<br />'; //add message to the array
		
	//if we are collecting data, then display latest alerts in window
	if (!showRealtimeData) {
		var buffer = ''
		for(i=5;i>0;i--) {
			if (alertsConsoleLog[alertsConsoleLog.length-i]) {
				buffer = buffer + alertsConsoleLog[alertsConsoleLog.length-i];
			}
		}
		
		document.getElementById('alertsConsole').innerHTML = buffer;
	}
}

//Data-collection
function initDataCollection() {
	storage_clear(); //clear database in preparation for data collection
	
	//clear alerts console
	alertsConsoleLog.length = 0;
	clearDiv('alertsConsole');
	
	//clear dom
	clearDiv('alertsConsoleLog');
	clearDiv('geolocation');
	clearDiv('acceleration');
	clearDiv('compass');
	clearDiv('databases');
	
	//alert the user
	consoleLog('Data Collection Reset!');
	document.getElementById('dbResetStatus').innerText = 'Data Collection Reset';
}

function startDataCollection() {
	document.getElementById('loader').style.visibility = 'visible';
	showRealtimeData = false;
	clearDiv('dbResetStatus');
	
	//start watching sensors
	geoLocation_startWatching();
	accelerometer_startWatching();
	compass_startWatching();	
}

function stopDataCollection() {
	//stop watching sensors
	geoLocation_stopWatching();	
	accelerometer_stopWatching();
	compass_stopWatching();
	
	showRealtimeData = true;
	document.getElementById('loader').style.visibility = 'hidden';
}

//Debugging Access
function displayAlertsConsoleLog() {
	var buffer = '';
	
	//extract the log from the array
	for(i=0;i<alertsConsoleLog.length;i++) {
		if (alertsConsoleLog[i]) {
			buffer = buffer + alertsConsoleLog[i];
		}
	}

	document.getElementById('alertsConsoleLog').innerHTML = buffer;
}
//*********************************** END HELPER SCRIPTS **********************************//
