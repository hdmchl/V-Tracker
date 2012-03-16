//helper scripts

function clearDiv(divId) {
	document.getElementById(divId).innerHTML = '';
}

var alertsConsoleCounter = 1;
function consoleLog(message) {
	console.log(message);
	document.getElementById('alertsConsole').innerHTML = document.getElementById('alertsConsole').innerHTML + alertsConsoleCounter + ") " + message + "<br />";
	alertsConsoleCounter++;
}