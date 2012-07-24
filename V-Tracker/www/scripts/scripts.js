/* scripts.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************** APP SCRIPTS **************************************//
//START LEARNING A NEW ROUTE
var currentRoute; //TO DO: don't use a global variable
function startLearningNow() {
	var routeName = $('#newRouteName').val(); //get route name
	
	//TO DO: check if route name is free, if not, then prompt! PS. this could happen in validObjName
	
	//create new route object
	currentRoute = new route(routeName); //create a new route object
	currentRoute.alertOps.displayInDiv(true);
	currentRoute.alertOps.divId("#loaderDialog-alertsConsole");
	currentRoute.learn(); //start updating the object
	
	//prepare loading dialog
	$("#loaderDialog-header").replaceWith("Learning...");
	$("#loaderDialog-top").html("<a href=\"javascript:destinationReached();\" data-role=\"button\" data-theme=\"b\" data-transition=\"none\">Destination reached</a></div>");
	$("#loaderDialog").trigger('create');			
	
	//open the loader dialog
	$.mobile.changePage('#loaderDialog', 'none', true, true);
}

function destinationReached() {
	currentRoute.end(); //end route
	
	//clean up loader dialog
	$('#loaderDialog-top').empty();
	$('#loaderDialog-alertsConsole').empty();
	$('#loaderDialog-bottom').empty();
	$('#loaderDialog').dialog('close');
	
	//go back to startpage
	$.mobile.changePage('#startpage', 'none', true, true);
}

//FIND ROUTES NEARBY
//TO DO....
function findNearbyRoutes() {
	loadAllRoutes("#findRoutesDialog-routesNearby");
	
	$.mobile.changePage('#findRoutesDialog', 'none', true, true);
}

function update() {
	//retrieve route
	var routeName = $('input[name=manage-route-choice]:checked').val(); //get route name
	
	var rr = storageAPI.localStore.getObject(routeName);
	
	//setup route object
	currentRoute = new route(rr.name)
	currentRoute.loadFromStored(rr);
	currentRoute.alertOps.displayInDiv(true);
	currentRoute.alertOps.divId("#loaderDialog-alertsConsole");
	
	currentRoute.learn(); //start updating the object

	//prepare loading dialog
	$("#loaderDialog-header").replaceWith("Updating...");
	$("#loaderDialog-top").html("<a href=\"javascript:destinationReached();\" data-role=\"button\" data-theme=\"b\" data-transition=\"none\">Destination reached</a></div>");
	$("#loaderDialog").trigger('create');
	
	//open the loader dialog
	$.mobile.changePage('#loaderDialog', 'none', true, true);
}

//MANAGE ROUTES
function manageRoutes() {
	loadAllRoutes("#manageRoutesDialog-allRoutes");
	
	$.mobile.changePage('#manageRoutesDialog', 'none', true, true);
}

function loadAllRoutes(divId) {
	$(divId).empty();
	
	for (var i=0;i<window.localStorage.length;i++) {
		var route = storageAPI.localStore.getObject(window.localStorage.key(i));
		$(divId).append("<input type=\"radio\" name=\"manage-route-choice\" id=\"manage-route-choice-" + i + 
					"\" value=\"" + route.name + "\" /><label for=\"manage-route-choice-" + i + "\">" + route.name + "</label>");
	}
	
	$("#findRoutesDialog").trigger('create');
	$("#manageRoutesDialog").trigger('create');
}

function exportRoute() {
	var routeName = $('input[name=manage-route-choice]:checked').val(); //get route name
	//TO DO: export to SQL
	loadAllRoutes();
}

function removeRoute() {
	var routeName = $('input[name=manage-route-choice]:checked').val(); //get route name
	storageAPI.localStore.remove(routeName);
	loadAllRoutes();	
}
//************************************ END APP SCRIPTS ************************************/

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