//helper scripts

function clearDiv(divId) {
	document.getElementById(divId).innerHTML = '';
}

function consoleLog(message) {
	console.log(message);
	document.getElementById('alertsConsole').innerHTML = document.getElementById('alertsConsole').innerHTML + message + "<br />";
}