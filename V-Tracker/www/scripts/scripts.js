/* scripts.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************* HELPER SCRIPTS ************************************//
function formatDate(timestamp) {
	//console.log(timestamp);
	var date = new Date(timestamp);
	
	var month = parseFloat(date.getMonth()) + 1;
	
	return	date.getDate() + "/" + month + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
}

//use modernizr to test the browser compatibility
function checkBrowserCompatibilities() {
	var incompatibilities = '';
	
	//check local storage
	if (Modernizr.localstorage) {
		// window.localStorage is available!
	} else {
		// no native support for local storage :(
		incompatibilities = incompatibilities + 'localstorage, ';
	}
	
	if (Modernizr.geolocation) {
		// let's find out where you are!
	} else {
		// no native geolocation support available :(
		incompatibilities = incompatibilities + 'geolocation, ';
	}
	
	// display an alert if there are any incompatibilities
	if (incompatibilities != '') {
		alert('Your browser is not fully compatible with PT Tracker.' + '\n' + 'The services lacking are: ' + incompatibilities);
	}
}
//*********************************** END HELPER SCRIPTS *********************************//

//************************************* DATA COLLECTION SCRIPTS ************************************//
//Data-collection
var dataCollection = {
	init:function() {
		storage.reset(); //reset database in preparation for data collection
	
		//clear alerts console
		consoleLog.alertsConsoleLog.length = 0;
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
		//document.getElementById('loader').style.visibility = 'visible';
		$.mobile.changePage('#loaderdialog', {transition: 'none'});
		
		showRealtimeData = false;
		clearDiv('dbResetStatus');
		
		//start watching sensors
		geolocationObj.startWatching();
		accelerometerObj.startWatching();
		compassObj.startWatching();	
		gyroscopeObj.startWatching();
	},
	
	stop:function() {
		//stop watching sensors
		geolocationObj.stopWatching();	
		accelerometerObj.stopWatching();
		compassObj.stopWatching();
		gyroscopeObj.stopWatching();
		
		showRealtimeData = true;
	}
}
//************************************* DATA COLLECTION SCRIPTS ************************************//