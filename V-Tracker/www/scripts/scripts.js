/* scripts.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var newRoute; //TO DO: don't use a global variable

function startLearningNow() {
	//new route
	var routeName = $('#newRouteName').val(); //get route name
	
	//TO DO: check if route name is free, if not, then prompt! PS. this could happen in validObjName
	
	newRoute = new route(routeName); //create a new route object
	newRoute.alertOps.displayInDiv(true);
	newRoute.alertOps.divId("#loaderDialog-alertsConsole");
	newRoute.learn(); //start updating the object
	
	//prepare learning dialog
	$("#loaderDialog-header").html("<h1>Learning...</h1>");
	$("#loaderDialog-top").html(
		"<a href=\"javascript:newRoute.endLearn()\" data-role=\"button\" " +
		"data-theme=\"b\" data-transition=\"none\">Destination reached</a>")

	$.mobile.changePage('#loaderDialog', 'none', true, true);
}

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