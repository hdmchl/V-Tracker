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

//************************************ CONSOLE SCRIPTS ************************************//
//console logging for alerts
var consoleLog = {
	alertsConsoleLog: [],
	
	add:function(message) {
		storage.updateSQLTable.consoleLog(message); //update SQL 
		
		console.log(message); //display message in output console
		
		this.alertsConsoleLog[this.alertsConsoleLog.length] = this.alertsConsoleLog.length + ') ' + message + '<br />'; //add message to the session array
			
		//if progress window is open, then display latest alerts in window
		if (document.getElementById('loader').style.visibility == 'visible') {
			var buffer = ''
			for(i=10;i>0;i--) {
				if (this.alertsConsoleLog[this.alertsConsoleLog.length-i]) {
					buffer = buffer + this.alertsConsoleLog[this.alertsConsoleLog.length-i];
				}
			}
			
			document.getElementById('alertsConsole').innerHTML = buffer;
		}
	},
	
	retrieve:function() {
		var buffer = ''; //clear buffer
		
		//extract the log from the array
		for(i=0;i<this.alertsConsoleLog.length;i++) {
			if (this.alertsConsoleLog[i]) {
				buffer = buffer + this.alertsConsoleLog[i];
			}
		}
		
		//display
		document.getElementById('alertsConsoleLog').innerHTML = buffer;
	}
}
//********************************** END CONSOLE SCRIPTS **********************************//

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
		document.getElementById('loader').style.visibility = 'visible';
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
		document.getElementById('loader').style.visibility = 'hidden';
	}
}
//************************************* DATA COLLECTION SCRIPTS ************************************//