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

function formatDate(timestamp) {
	//console.log(timestamp);
	var date = new Date(timestamp);
	
	var month = parseFloat(date.getMonth()) + 1;
	
	return	date.getDate() + "/" + month + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
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
		
		storage.createTable('geolocation','GEOLOCATION');
		storage.createTable('compass','COMPASS');
		storage.createTable('accelerometer','ACCELEROMETER');
		storage.createTable('gyroscope','GYROSCOPE');
		
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