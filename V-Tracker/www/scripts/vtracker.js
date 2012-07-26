/* scripts.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************** APP SCRIPTS **************************************//
// these are all the methods used in the start tab (ie. this is the view controller for vtracker)

var vtracker = {
	workingRoute: null, //users can only work with one route at a time - if necessary, this can be converted into an array in the future
	
	//***** LEARN NEW ROUTE *****//
	startLearningNow:function() {
		var routeName = $('#newRouteDialog-newRouteName').val(); //get route name
		
		//TO DO: validate Object name: check if route name is free, if not, then prompt! PS. this could happen in validObjName
		//if all good, then let the user through
		
		//create new route object
		vtracker.workingRoute = new route(routeName); //create a new route object
		vtracker.workingRoute.alertOps.displayInDiv(true);
		vtracker.workingRoute.alertOps.divId("#loaderDialog-alertsConsole");

		vtracker.workingRoute.learn(); //start machine learning algorithm
		
		//prepare loading dialog
		$("#loaderDialog-header").replaceWith("Learning...");
		$("#loaderDialog-top").html("<a href=\"javascript:vtracker.destinationReached();\" data-role=\"button\" " + 
									"data-theme=\"b\" data-transition=\"none\">Destination Reached</a></div>");
		$("#loaderDialog").trigger('create'); //update the styles on the UI		
		
		//open the loader dialog
		$.mobile.changePage('#loaderDialog', 'none', true, true);
	},
	
	//***** END LEARN NEW ROUTE *****//
	
	//***** UPDATE/TRACK ROUTES *****//
	findNearbyRoutes:function() {
		//TO DO: 1. pull all routes out of storage 2. get user's location 3. find nearest routes 4. create nearestRoutes var
		var nearestRoutes = storageAPI.localStore.getAllItemKeys(); //for now, use all routes
		
		//create the radio buttons
		vtracker.createRouteChoices(nearestRoutes, "#findRoutesDialog-routesNearby", "routesNearby");
		$("#findRoutesDialog").trigger('create'); //update the styles on the UI
		
		//show the dialog
		$.mobile.changePage('#findRoutesDialog', 'none', true, true);
	},
	
	trackMeOnRoute:function() {
		//TO DO: implement tracking
		
		var success = new notificationObj();
		success.alert("Under Construction","Not yet bra!","Okay")
		
		$.mobile.changePage('#trackingpage', 'none', true, true);
	},
	
	updateRoute:function() {
		//retrieve route
		var routeName = $('input[name=routesNearby-choice]:checked').val(); //get route name from routesNearby

		var rr = storageAPI.localStore.getObject(routeName); //get route from storage
		
		//setup route object
		vtracker.workingRoute = new route(rr.name) //probably don't need to do this, but it's cleaner
		vtracker.workingRoute.loadFromStored(rr);
		vtracker.workingRoute.alertOps.displayInDiv(true);
		vtracker.workingRoute.alertOps.divId("#loaderDialog-alertsConsole");
		
		vtracker.workingRoute.learn(); //start machine learning algorithm
		
		//prepare loading dialog
		$("#loaderDialog-header").replaceWith("Updating...");
		$("#loaderDialog-top").html("<a href=\"javascript:vtracker.destinationReached();\" data-role=\"button\" " + 
									"data-theme=\"b\" data-transition=\"none\">Destination Reached</a></div>");
		$("#loaderDialog").trigger('create'); //update the styles on the UI		
		
		//open the loader dialog
		$.mobile.changePage('#loaderDialog', 'none', true, true);
	},
	//***** END UPDATE/TRACK ROUTES *****//
	
	//***** MANAGE ROUTES *****//
	manageRoutes:function() {
		var allRoutes = storageAPI.localStore.getAllItemKeys(); //for now, use all routes
		
		//create the radio buttons
		vtracker.createRouteChoices(allRoutes, "#manageRoutesDialog-allRoutes", "allRoutes");
		$("#manageRoutesDialog").trigger('create'); //update the styles on the UI
		
		$.mobile.changePage('#manageRoutesDialog', 'none', true, true);
	},
	
	exportRoute:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		
		var rr = storageAPI.localStore.getObject(routeName); //get route from storage
		
		//setup route object
		vtracker.workingRoute = new route(rr.name) //probably don't need to do this, but it's cleaner
		vtracker.workingRoute.loadFromStored(rr);
		
		vtracker.workingRoute.exportToDB();
		
		//tell the user all went well
		var success = new notificationObj();
		success.alert("Route exported","Route has been exported successfully.","Okay")
	},
	
	removeRoute:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		storageAPI.localStore.removeItem(routeName);
		
		vtracker.manageRoutes();	
	},
	//***** END MANAGE ROUTES *****//
	
	//GENERAL scripts
	destinationReached:function() {
		vtracker.workingRoute.stopLearning(); //end machine learning, and save object
		
		//tell the user that all went well
		var success = new notificationObj();
		success.alert("Route updated","Route has been recorded successfully.","Okay")
		
		//clean up loader dialog
		$('#loaderDialog-top').empty();
		$('#loaderDialog-alertsConsole').empty();
		$('#loaderDialog-bottom').empty();
		$("#loaderDialog").trigger('create'); //update the styles on the UI
		$('#loaderDialog').dialog('close');
		
		//go back to startpage
		$.mobile.changePage('#startpage', 'none', true, true);
	},
	
	createRouteChoices:function(routesAry, divId, prefix) {
		$(divId).empty(); //empty the div
		
		if (routesAry.length == 0) {
			$(divId).append("<p>... no routes found ...</p>");
			return;
		}
		
		for (var i=0;i<routesAry.length;i++) {
			$(divId).append("<input type=\"radio\" name=\"" + prefix  + "-choice\" id=\"" + prefix  + "-choice-" + i + 
						"\" value=\"" + routesAry[i] + "\" /><label for=\"" + prefix  + "-choice-" + i + "\">" + routesAry[i] + "</label>");
		}
	},
	//END GENERAL scripts
}
//************************************ END APP SCRIPTS ************************************//

//************************************** VTRACKERAPI **************************************//
//these are all my helper scripts

var vtrackerAPI = {
		
}
//************************************ END VTRACKERAPI ************************************//

//*************************************** routeObj ****************************************//
//constructor for the route objects
function route(name) {
	if (!validObjName(name)) {return;}
	
	//create a reference object that can be inherited
	var me = Object(this);
	
	//handle alerts
	this.routeAlerts = new alertsObj(name);
	this.alertOps = {
		displayInDiv:function(state) {me.routeAlerts.displayInDiv = state},
		divId:function(divId) {me.routeAlerts.divId = divId},	
	}

	//handle route properties
	this.name = name;
	this.geoData = [];
	this.learnCounter = 0;
	
	//handle route methods
	this.loadFromStored = function(storedRoute) {
		//when recovering a route from storage, the methods are all the same for any route
		//the only difference is the route's properties, so load those in here:
		me.name = storedRoute.name;
		me.geoData = storedRoute.geoData;
		me.learnCounter = storedRoute.learnCounter;
	}
	
	this.pushGeoMeasurement = function(measurements) {
		me.geoData.push(measurements);
		console.log("measurement added to: " + me.name);
		//me.routeAlerts.add("measurement added"); //useful for debugging
	};
	
	this.learn = function() {
		//housekeeping
		me.learnCounter++;
		me.routeAlerts.add("Please stand by while I learn the route <b>" + me.name + "</b>");
		me.routeAlerts.add("This is update #" + me.learnCounter + ", for route: " + me.name);
		
		// machine learning algorithm
		if (me.learnCounter > 3) {
			me.routeAlerts.add("Sufficient route data exists. Only changes will be recorded.")
			//if measurement is statiscally off, then pushMeasurement, else dismiss
			//if pushed a new measurement, delete an old one...
		} else {
			me.routeAlerts.add("Insufficient route data. Learning started.")
			//TO DO: check measurement accuracy before pushing
			geolocationAPI.successCBs.push(me.pushGeoMeasurement); //add the pushMeasurement method to the geolocation's API callbacks stack
		}
		
		//start collecting measurements, other sensors can be turned on here
		geolocationAPI.startWatching();
	}
	
	this.stopLearning = function() {
		geolocationAPI.successCBs = []; //clear callbacks on API
		
		//stop collecting measurements, other sensors can be turned off here
		geolocationAPI.stopWatching();
		
		me.save(); //save route
		
		me.routeAlerts.add("Route learning complete.");
	}
	
	this.save = function() {
		//store route in local storage
		storageAPI.localStore.setObject(me.name, me);
		console.log("Route " + me.name + " was saved.");
	}
	
	this.exportToDB = function() {
		//export to a database. At the moment we only care about geolocation data, so we use that data schema
		var routeDB = "route_" + me.name;
		storageAPI.createTable(geolocationAPI.data,routeDB);
		
		//make sql entries
		var toSQL = null;
		for (var i=0;i<me.geoData.length;i++) {
			 toSQL = geolocationAPI.formatDataForSQL(me.geoData[i]);
			 storageAPI.insertIntoTable(routeDB,toSQL);
		}	 
	}
}
//************************************* END routeObj **************************************//

//*************************************** alertsObj ***************************************//
//constructor for a console alerts object
function alertsObj(name) {
	if (!validObjName(name)) {return;}
	
	//create a reference object that can be inherited
	var me = Object(this);
	
	//declare the object's properties
	this.name = name;
	this.data = {	timestamp: [],
					message: [] };
					
	this.displayInDiv = false;
	this.divId = null;
	
	//declare the object's methods
	this.add = function(message) {
		me.data.timestamp.push(new Date(new Date().getTime()));
		me.data.message.push(message);
		
		//if progress window is open, then display latest alerts in window
		if(me.displayInDiv) {
			$(me.divId).append(me.data.message.length + ") " + me.data.message[me.data.message.length-1] + "<br />");
		}
		
		console.log(message); //display message in output console
	};
	
	this.drop = function() {
		storageAPI.dropTable([me.name]);
	};
	
	//execute object's initialisation actions
	$(me.divId).empty(); //empty the div
}
//************************************* END alertsObj *************************************//

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