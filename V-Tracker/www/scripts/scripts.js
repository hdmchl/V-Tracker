/* scripts.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************* HELPER SCRIPTS ************************************//
function onPause() {
	console.log("Device paused!");
	//tell the user if GPS is still ON when the application is paused
	if (geolocationAPI.watchID) {
		var geoNotification = new notificationObj();
		geoNotification.pushNot(notificationsAPI.getTimeAfter(7000),"The GPS radio is still on!","",false,"GPSON");
	}
}

function onResume() {
	console.log("Device resumed!");
	notificationsAPI.clearAll();
}

function formatDate(timestamp) {
	//console.log(timestamp);
	var date = new Date(timestamp);
	var month = parseFloat(date.getMonth()) + 1;
	return date.getDate() + "/" + month + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
}

function validObjName(name) {
	if (name == null || name == "") {
		console.log("Invalid object name at declaration!");
		return false;
	} else {
		return true;
	}
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