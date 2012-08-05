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
		var noiseThreshold = $('#newRouteDialog-noiseSlider').val(); //get noise threshold
		var minAccuracy = $('#newRouteDialog-minAccuracy').val(); //get min accuracy
		
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
		
		//set options
		vtracker.workingRoute.noiseThreshold = noiseThreshold; //set noise threshold
		vtracker.workingRoute.minAccuracy = minAccuracy; //set min accuracy
		
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
	trackOrUpdateRoutes:function() {
		var allRoutes = vtracker.getAllRoutes(); //get all routes
		
		//create the radio buttons
		vtracker.createRouteChoices(allRoutes, "#findRoutesDialog-routesNearby", "routesNearby");
		$("#findRoutesDialog").trigger('create'); //update the styles on the UI
		
		//show the dialog
		$.mobile.changePage('#findRoutesDialog', 'none', true, true);
	},
	
	trackMeOnRoute:function() {
		//TODO: implement tracking, probably by plotting the route, and adding a method that puts a cursor on the plot...
		//would be good to calculate "distance travelled/route distance"
		
		var success = new notificationObj();
		success.alert("Under Construction","Not yet bra!","Okay")
		
		$.mobile.changePage('#trackingpage', 'none', true, true);
	},
	
	updateRoute:function() {
		var routeName = $('input[name=routesNearby-choice]:checked').val(); //get route name from routesNearby selection
		var noiseThreshold = $('#newRouteDialog-noiseSlider').val(); //get noise threshold
		var minAccuracy = $('#newRouteDialog-minAccuracy').val(); //get min accuracy
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		vtracker.workingRoute.alertOps.displayInDiv(true);
		vtracker.workingRoute.alertOps.divId("#loaderDialog-alertsConsole");
		
		//set options
		vtracker.workingRoute.noiseThreshold = noiseThreshold; //set noise threshold
		vtracker.workingRoute.minAccuracy = minAccuracy; //set min accuracy
		
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
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		
		vtracker.workingRoute.exportRouteToDB();
		
		//tell the user all went well
		var success = new notificationObj();
		success.alert("Route exported","Route has been exported.","Okay")
	},
	
	exportModel:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		
		vtracker.workingRoute.exportModelToDB();
		
		//tell the user all went well
		var success = new notificationObj();
		success.alert("Model exported","Model has been exported.","Okay")
	},
	
	plotRoute:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		
		//plot the model
		vtracker.workingRoute.plotModelInDiv("#plotpage-plotPlaceholder");
		
		//prepare the page
		$("#plotpage-routeName").html(vtracker.workingRoute.name);
		$("#plotpage-dataLength").html(vtracker.workingRoute.geoData.longitude.length);
		$("#plotpage-learnCounter").html(vtracker.workingRoute.learnCounter);
		$("#plotpage-modelLength").html(vtracker.workingRoute.model.lon.length);
		$("#plotpage-noise").html(vtracker.workingRoute.noiseThreshold);
		
		//display the page
		$.mobile.changePage('#plotpage', 'none', true, true);
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
		$('#loaderDialog').trigger('create'); //update the styles on the UI
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
			$(divId).append("<input type=\"radio\" checked=\"checked\" name=\"" + prefix  + "-choice\" id=\"" + prefix  + "-choice-" + i + 
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
	this.geoData = {timestamp: [],
					latitude: [],
					longitude: [],
					altitude: [],
					accuracy: [],
					altitudeAccuracy: [],
					heading: [],
					speed: [] },
	this.model = {lon: [], lat: []};
	this.noiseThreshold = 2; //the threshold radius (in metres) between what is considered to be natural noise fluctuation and what is considered to be a route change
	this.learnCounter = 0;
	this.timeoutLimit = 10;
	this.minAccuracy = 50;
	
	//handle route methods
	this.loadFromStored = function(storedRoute) {
		//when recovering a route from storage, the methods are all the same for any route
		//the only difference is the route's properties, so load those in here:
		me.name = storedRoute.name;
		me.geoData = storedRoute.geoData;
		me.model = storedRoute.model;
		me.noiseThreshold = storedRoute.noiseThreshold;
		me.learnCounter = storedRoute.learnCounter;
		me.timeoutLimit = storedRoute.timeoutLimit;
	}
	
	var accuracyTimout = 0;
	this.onGeoMeasurement = function(measurement) {
		if (measurement.coords.accuracy < me.minAccuracy) {
			if (accuracyTimout > 0) {
				me.routeAlerts.add("Accuracy improved. Learning...");
			}
			//if all good, add measurement to "data" array
			//TODO: USE EUCLIDEAN DISTANCE find the nearest two points, and add the measurement between them
			me.geoData.timestamp.push(measurement.timestamp);
			me.geoData.latitude.push(measurement.coords.latitude);
			me.geoData.longitude.push(measurement.coords.longitude);
			me.geoData.accuracy.push(measurement.coords.accuracy);
			me.geoData.altitude.push(measurement.coords.altitude);
			me.geoData.altitudeAccuracy.push(measurement.coords.altitudeAccuracy);
			me.geoData.heading.push(measurement.coords.heading);
			me.geoData.speed.push(measurement.coords.heading);
			//me.routeAlerts.add("measurement added"); //useful for debugging
			
			accuracyTimout = 0; //reset accuracy timeout
		} else {
			if (accuracyTimout >= me.timeoutLimit) {
				geolocationAPI.successCBs = []; //clear callbacks on API
				//stop collecting measurements, other sensors can be turned off here
				geolocationAPI.stopWatching();
				me.routeAlerts.add("Learning stopped because measurement accuracy has been consistently poor.");
			} else {
				me.routeAlerts.add("Accuracy is poor (" + accuracyTimout + ").");
				accuracyTimout++;
			}
			return;
		}

		//get the relevant data and update the model
		var relevantData = {lon: me.geoData.longitude, lat: me.geoData.latitude}
		me.model = me.updateModel(relevantData); //overwrite model - for optimisation, this method call can be done in a webworker
	}
	
	this.updateModel = function(data) {
		//this function takes in "data" and returns the model as "output"
		
		//at this point, the assumption is that the data variable has: {lon:[...],lat:[...]} properties...
		//we make sure it's actually good data
		if (data.lon.length != data.lat.length || !(data.lon.length > 1)) {console.log("Data array is not suitable for modeling");return;}
		
		//get data length
		var dataLength = data.lon.length;
		
		//set the parameters
		var start = 0;
		var end = dataLength-1;
		var borderRadius = me.noiseThreshold; //pull this from the route's properties
		
		//declare our output object
		var output = {lon: [], lat: []};
		
		//push on the start point
		//console.log("Modelling started from point: " + start)
		output.lon.push(data.lon[start]);
		output.lat.push(data.lat[start]);

		//get the first breakpoint after the start point
		var breakPoint = me.createModel(data, start, end, borderRadius);
		//console.log("Loop broke, segment created from: " + start + " to " + breakPoint)
		
		//if it's less than the end, then get the other breakpoints until you reach the end
		while(breakPoint < end) {
			//push on the breakpoint, because it's before the end
			output.lon.push(data.lon[breakPoint]);
			output.lat.push(data.lat[breakPoint]);
			
			start = breakPoint; //change the starting point to the previous breakpoint
			breakPoint = me.createModel(data, start, end, borderRadius); //find new breakPoint
			//console.log("Loop broke, segment created from: " + start + " to " + breakPoint)
		}
		
		//at this stage, "breakPoint" must equal "end"
		if (breakPoint!=end) {console.log("Error: 'breakPoint' was not the 'end'");return;}
		
		//push on the last data point
		output.lon.push(data.lon[end]);
		output.lat.push(data.lat[end]);
		//console.log("Modelling ended at point: " + breakPoint);
		
		return output;
	}
	
	this.createModel = function(data, start, end, limit) {
		//uses "data" from "start" to "end" and return the point where a straight line fit is still acceptable, under "limit" condition for RMSD
		//we are creating a piecewise model, using multivariate orinary linear regression, where the minimum residuals is already specified 
		//  and acts as the "splitter"
		
		//housekeeping: set up our variables
		var lat = data.lat;
		var lon = data.lon;
		var x = [];
		var y = [];
		
		//set the start at the origin
		x[start] = 0;
		y[start] = 0;
		
		for (var i=start+1 ; i<end ; i++) {
			//console.log("trying to model from: " + start + " to " + i)
			
			//**** STEP 1: get distances between the points in metres
			//we are essentially creating the (x,y) equivalent for point i, where lon[start],lat[start] is the origin
			//for this we use the Haversine formula
			var R = 6371000; // radius of the earth in metres
	
			var lat1 = lat[start] * Math.PI/180;
			var lat2 = lat[i] * Math.PI/180;
			
			//find difference when dLat = 0
			var dLat = 0;
			var dLon = (lon[i]-lon[start]) * Math.PI/180;
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			x[i] = (R * c);
			
			//find difference when dLon = 0
			var dLat = (lat[i]-lat[start]) * Math.PI/180;
			var dLon = 0;
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			y[i] = (R * c);
			
			//**** STEP 2: create a straight line model from "start" to the current point of interest: i
			//create the line using the general standard model for a straight line: ax + by + c = 0
			var a = y[start] - y[i]; // (y1-y2)
			var b = x[i] - x[start]; // (x2-x1)
			var c = x[start]*y[i] - x[i]*y[start]; // (x1y2-x2y1)
			
			// if the line is vertical or horizontal, then just include that point and break
			if((-b/a) == Number.POSITIVE_INFINITY || (-a/b) == Number.POSITIVE_INFINITY || (-b/a) == Number.NEGATIVE_INFINITY || (-a/b) == Number.NEGATIVE_INFINITY) {return i;}
			
			//**** STEP 3: apply that model from the start point, to the point of interest and find the squared deviations
			var deviations = [];//reset deviations
			for (var j = start+1; j < i; j++) {
				//console.log("testing midpoint: " + j)

				var x_predicted = (-b/a) * y[j] + (-c/a);
				var y_predicted = (-a/b) * x[j] + (-c/b);

				//get errors on x and y axes
				var x_error = (x_predicted - x[j]);
				var y_error = (y_predicted - y[j]);

				//get right-angle error from the straight line model
				var errorBufferOnSegment = Math.sqrt(y_error*y_error + x_error*x_error); //the hypotenuse
				var deviation = y_error * Math.sin(Math.acos(y_error/errorBufferOnSegment));
				deviations.push(deviation*deviation);
			}
			//get the square root of the mean of the squared deviations (Root Mean Squared Deviations = RMSD)
			var RMSD = Math.sqrt(vtrackerAPI.retAvg(deviations));
			//if it's larger than the limit, then return
			//console.log("RMSD: " + RMSD)
			if (RMSD >= limit) {return i;}
		}
		
		//if the RMSD never exceeded the limit, just return the end point		
		return end;
	}
	
	this.plotModelInDiv = function(divId) {
		//prepare the options
		var options = {
			series: {
				lines: { show: true },
				points: { show: true }
			},
			yaxis: {
				//min: 0,
				//max: 10,
			},
			xaxis: {
				//min: 0,
				//max: 0,
			}
		};
		
		//plot
		$.plot($(divId), [ numeric.transpose([me.model.lon,me.model.lat]) ], options);
	}
	
	this.learn = function() {
		//housekeeping
		me.learnCounter++;
		me.routeAlerts.add("Please stand by while I learn the route <b>" + me.name + "</b>");
		me.routeAlerts.add("This is update #" + me.learnCounter + ", for route: " + me.name);
		
		// tell the user what's happening
		if (me.model.lat.length > 0 && me.model.lon.length > 0) {
			geolocationAPI.options.enableHighAccuracy = false;
			me.routeAlerts.add("A model exists for this route - only route changes will be recorded.");
		} else {
			geolocationAPI.options.enableHighAccuracy = true;
			me.routeAlerts.add("Insufficient route data. A new route will be created.");		
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
	
	this.exportRouteToDB = function() {
		//export to a database. 
		var routeDBname = "route_" + me.name.split(' ').join('_'); //replace spaces with underscores for dbname
		var table = []; table.push(routeDBname);
		storageAPI.dropTable(table);
		storageAPI.createTable(me.geoData,routeDBname);
		
		//make sql entries
		var toSQL = null;
		for (var i=0;i<me.geoData.latitude.length;i++) {
			toSQL =  	'"' + new Date(me.geoData.timestamp) + '",' +
						'"' + me.geoData.latitude          + '",' +
						'"' + me.geoData.longitude         + '",' +
						'"' + me.geoData.altitude          + '",' +
						'"' + me.geoData.accuracy          + '",' +
						'"' + me.geoData.altitudeAccuracy  + '",' +
						'"' + me.geoData.heading           + '",' +
						'"' + me.geoData.speed             + '"';
			storageAPI.insertIntoTable(routeDBname,toSQL);
		}	 
	}
	
	this.exportModelToDB = function() {
		//export to a database.
		var modelDBname = "model_" + me.name.split(' ').join('_'); //replace spaces with underscores for dbname
		var table = []; table.push(modelDBname);
		storageAPI.dropTable(table);
		storageAPI.createTable(me.model,modelDBname);
		
		//make sql entries
		var toSQL = null;
		for (var i=0;i<me.model.lon.length;i++) {
			toSQL =  '"' + me.model.lon[i]     + '",' +
					 '"' + me.model.lat[i]     + '"';
			storageAPI.insertIntoTable(modelDBname,toSQL);
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
	
	retAvg:function(ary) {
		var av = 0;
		var cnt = 0;
		var len = ary.length;
		if (len == 0) {return 0;}
		for (var i = 0; i < len; i++) {
			var e = +ary[i];
			if(!e && ary[i] !== 0 && ary[i] !== '0') e--;
			if (ary[i] == e) {av += e; cnt++;}
		}
		return av/cnt;
	},
	
	//make sure the browser engine can do what we need
	checkBrowserCompatibility:function(divId) {
		//this is a rough compatibility check
		var incompatibilities = [];
		var coreReqs = ['geolocation', 'localstorage'];
		
		//check if the tests fail
		if (!geolocationAPI.test() || !Modernizr.geolocation) {incompatibilities.push('geolocation');}
		if (!compassAPI.test()) {incompatibilities.push('compass');}
		if (!accelerometerAPI.test()) {incompatibilities.push('accelerometer');}
		if (!gyroscopeAPI.test()) {incompatibilities.push('gyroscope');}
		
		if (!notificationsAPI.test()) {incompatibilities.push('notifications');}
		
		if (!storageAPI.test() || !Modernizr.websqldatabase) {incompatibilities.push('web sql databases');}	
		if (!storageAPI.localStorageAPI.test() || !Modernizr.localstorage) {incompatibilities.push('localstorage');}
		
		if (!Modernizr.webworkers) {incompatibilities.push('webworkers');}	
		
		// display an alert if there are any incompatibilities
		if (incompatibilities.length > 0) {
			var message = "<p>Your browser is not fully compatible with Vehicle Tracker! Complete support is lacking for: ";
			for (var i = 0;i < incompatibilities.length-1;i++) {
				message+=("<b>" + incompatibilities[i] + "</b>" + ", ");
			};
			message+=("and <b>" +  incompatibilities[incompatibilities.length-1] + "</b>.</p>");
			$(divId).html(message);
		}
		
		//make sure we have the CORE requirements
		for(i in incompatibilities) {
			for(j in coreReqs) {
				if (incompatibilities[i] == coreReqs[j]) {
					alert("Your browser is lacking critical core services. \n This app requires: " + coreReqs);
				}
			}
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