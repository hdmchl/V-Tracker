//helper scripts

function clearDiv(divId) {
	document.getElementById(divId).innerHTML = '';
}

var alertsConsoleLog = [];
var alertsConsoleCounter = 1;
function consoleLog(message) {
	console.log(message);
	
	alertsConsoleLog[alertsConsoleCounter] = alertsConsoleCounter + ") " + message + "<br />";
	
	var buffer = alertsConsoleLog[alertsConsoleCounter-5] + alertsConsoleLog[alertsConsoleCounter-4] + alertsConsoleLog[alertsConsoleCounter-3] + alertsConsoleLog[alertsConsoleCounter-2] + alertsConsoleLog[alertsConsoleCounter-1] + alertsConsoleLog[alertsConsoleCounter];
	
	document.getElementById('alertsConsole').innerHTML = buffer;
	
	alertsConsoleCounter++;
}

function deleteAlertsConsoleLog() {
	alertsConsoleLog.length = 0;
	alertsConsoleCounter = 1;
	
	document.getElementById('alertsConsoleLog').innerHTML = '';
}

function displayAlertsConsoleLog() {
	var buffer = '';

	for(i=1;i<alertsConsoleLog.length;i++) {
		buffer = buffer + alertsConsoleLog[i];
	}

	document.getElementById('alertsConsoleLog').innerHTML = buffer;
}

function startDataCollection() {
	document.getElementById('loader').style.visibility = 'visible';
	
	accelerometer_startWatching();
	compass_startWatching();
}

function stopDataCollection() {
	accelerometer_stopWatching();
	compass_stopWatching();

	document.getElementById('loader').style.visibility = 'hidden';
}

function analyse() {
	
}
