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
		
		var allRoutes = vtracker.getAllRoutes(); //get all routes
		if (allRoutes.indexOf(routeName) != -1) {
			//route name already exists
			var x = new notificationObj();
			var overwrite = x.confirm("The route name you selected is already in use. Would you like to overwrite it?", function onConfirm(buttonIndex) {
				if (buttonIndex == 2) {
					storageAPI.localStorageAPI.removeItem("route_" + routeName);
					vtracker.startLearningNow();
				}
			}, "Name exists", "Cancel,Overwrite")
			return;
		}
		
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
		var nearestRoutes = vtracker.getAllRoutes(); //for now, use all routes
		
		//create the radio buttons
		vtracker.createRouteChoices(nearestRoutes, "#findRoutesDialog-routesNearby", "routesNearby");
		$("#findRoutesDialog").trigger('create'); //update the styles on the UI
		
		//show the dialog
		$.mobile.changePage('#findRoutesDialog', 'none', true, true);
	},
	
	trackMeOnRoute:function() {
		//TO DO: implement tracking, probably by plotting the route, and adding a method to the geolocationAPI that puts a cursor on the plot...
		//would be good to calculate "distance travelled/route distance"
		
		var success = new notificationObj();
		success.alert("Under Construction","Not yet bra!","Okay")
		
		$.mobile.changePage('#trackingpage', 'none', true, true);
	},
	
	updateRoute:function() {
		var routeName = $('input[name=routesNearby-choice]:checked').val(); //get route name from routesNearby selection

		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
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
		var allRoutes = vtracker.getAllRoutes(); //get all routes
		
		//create the radio buttons
		vtracker.createRouteChoices(allRoutes, "#manageRoutesDialog-allRoutes", "allRoutes");
		$("#manageRoutesDialog").trigger('create'); //update the styles on the UI
		
		$.mobile.changePage('#manageRoutesDialog', 'none', true, true);
	},
	
	exportRoute:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
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
		storageAPI.localStorageAPI.removeItem("route_" + routeName);
		
		vtracker.manageRoutes();	
	},
	//***** END MANAGE ROUTES *****//
	
	//GENERAL scripts
	getAllRoutes:function() {
		//return all route names
		var allRoutes = [];
		var allItemKeys = storageAPI.localStorageAPI.getAllItemKeys();

		for (i in allItemKeys) {	
			if(allItemKeys[i].substring(0,6) == "route_") {
				allRoutes.push(allItemKeys[i].substr(6))
			}
		}
		
		return allRoutes;	
	},
	
	destinationReached:function() {
		vtracker.workingRoute.stopLearning(); //end machine learning, and save object
		
		//tell the user that all went well
		var success = new notificationObj();
		success.alert("Route updated","Route has been recorded.","Okay")
		
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

//*************************************** routeObj ****************************************//
//constructor for the route objects
function route(name) {
	if (!vtrackerAPI.validObjName(name)) {return;}
	
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
	this.model = [];
	this.learnCounter = 0;
	
	//handle route methods
	this.loadFromStored = function(storedRoute) {
		//when recovering a route from storage, the methods are all the same for any route
		//the only difference is the route's properties, so load those in here:
		me.name = storedRoute.name;
		me.geoData = storedRoute.geoData;
		me.model = storedRoute.model;
		me.learnCounter = storedRoute.learnCounter;
	}
	
	this.onGeoMeasurement = function(measurements) {
		//TO DO: check accuracy, and do timeouts etc...
		
		//if all good, add measurement to "data" array
		//TO DO: USE EUCLIDEAN DISTANCE find the nearest two points, and add the measurement between them
		me.geoData.push(measurements);
		//me.routeAlerts.add("measurement added"); //useful for debugging
	
		//call modelling algorithm to update model
		me.updateModel();	
	}
	
	this.updateModel = function() {
		//TO DO: ADD ALGORITHM INTO HERE...
		//take in me.data
		
		//return me.model
	}
	
	this.plotModelInDiv = function(divId) {
		//TO DO: get x and y from me.model
		
		var options = {
			series: {
				lines: { show: true },
				points: { show: true }
			},
			yaxis: {
				//min: 0,
				//max: 10
			},
			xaxis: {
				//min: 144.982366,
				//max: 145.097081,
			}
		};
			
		$.plot($(divId), [ numeric.transpose([x,y]) ], options);
	}
	
	this.learn = function() {
		//housekeeping
		me.learnCounter++;
		me.routeAlerts.add("Please stand by while I learn the route <b>" + me.name + "</b>");
		me.routeAlerts.add("This is update #" + me.learnCounter + ", for route: " + me.name);
		// tell the user what's happening
		if (me.model) {
			me.routeAlerts.add("Model data exists for this route. Only route changes will be recorded.")
		} else {
			me.routeAlerts.add("Insufficient route data. Learning started.")		
		}
		
		//add method to the geolocation's API callbacks stack
		geolocationAPI.successCBs.push(me.onGeoMeasurement); 
		
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
		storageAPI.localStorageAPI.setObject("route_" + me.name, me);
		console.log("Route " + me.name + " was saved.");
	}
	
	this.exportToDB = function() {
		//export to a database. At the moment we only care about geolocation data, so we use that data schema
		var routeDB = "route_" + me.name.split(' ').join('_'); //replace spaces with underscores for dbname
		storageAPI.createTable(geolocationAPI.data,routeDB);
		
		//make sql entries - do I want geoData or the Model? hmm...
		var toSQL = null;
		for (var i=0;i<me.geoData.length;i++) {
			 toSQL = geolocationAPI.formatDataForSQL(me.geoData[i]);
			 storageAPI.insertIntoTable(routeDB,toSQL);
		}	 
	}
}
//************************************* END routeObj **************************************//

//************************************** VTRACKERAPI **************************************//
//these are all my helper scripts
var vtrackerAPI = {
	//set callback for device pause
	onPause:function() {
		console.log("Device paused!");
		//tell the user if GPS is still ON when the application is paused
		if (geolocationAPI.watchID) {
			var geoNotification = new notificationObj();
			geoNotification.pushNot(notificationsAPI.getTimeAfter(5000),"The GPS radio is still on!","",false,"GPSON");
		}
	},
	
	//set callback for device resume
	onResume:function() {
		console.log("Device resumed!");
		notificationsAPI.clearAll();
	},
	
	//make sure a potential object name is not null or blank
	validObjName:function(name) {
		if (name == null || name == "") {
			console.log("Invalid object name at declaration!");
			return false;
		} else {
			return true;
		}
	},
	
	//make sure the browser engine can do what we need
	checkBrowserCompatibilities:function() {
		//this is a rough compatibility check, needs to be expanded
		var incompatibilities = null;
		
		//check local storage
		if (!Modernizr.localstorage) {
			// no native support for local storage :(
			incompatibilities = incompatibilities + 'localstorage, ';
		}
		
		if (!Modernizr.geolocation) {
			// no native geolocation support available :(
			incompatibilities = incompatibilities + 'geolocation, ';
		}
		
		// display an alert if there are any incompatibilities
		if (incompatibilities) {
			alert('Your browser is not fully compatible with Vehicle Tracker.' + '\n' + 'The services lacking are: ' + incompatibilities);
		}
	}
}
//************************************ END VTRACKERAPI ************************************//

//*************************************** alertsObj ***************************************//
//constructor for a console alerts object
function alertsObj(name) {
	if (!vtrackerAPI.validObjName(name)) {return;}
	
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
}
//************************************* END alertsObj *************************************//