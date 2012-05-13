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
	updateTable.consoleLog(message); //update SQL and console.log
	
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

//************************************* DATA COLLECTION SCRIPTS ************************************//
//Data-collection
var dataCollection = {
	init:function() {
		storage.reset(); //reset database in preparation for data collection
	
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
		document.getElementById('dbResetStatus').innerText = 'Data Collection Reset';	
	},
	
	start:function() {
		document.getElementById('loader').style.visibility = 'visible';
		showRealtimeData = false;
		clearDiv('dbResetStatus');
		
		//start watching sensors
		geoLocation.startWatching();
		accelerometer.startWatching();
		compass.startWatching();	
		gyroscope.startWatching();
	},
	
	stop:function() {
		//stop watching sensors
		geoLocation.stopWatching();	
		accelerometer.stopWatching();
		compass.stopWatching();
		gyroscope.stopWatching();
		
		showRealtimeData = true;
		document.getElementById('loader').style.visibility = 'hidden';
	}
}