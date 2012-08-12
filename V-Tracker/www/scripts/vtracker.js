/* vtracker.js
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
		var noiseThreshold = $('#optionsDialog-noiseSlider').val(); //get noise threshold
		var minAccuracy = $('#optionsDialog-minAccuracy').val(); //get min accuracy
		
		var allRoutes = vtracker.getAllRoutes(); //get all routes
		if (allRoutes.indexOf(routeName) != -1) {
			//route name already exists
			var noti = new notificationObj();
			var overwrite = noti.confirm("The route name you selected is already in use. Would you like to overwrite it?", function onConfirm(buttonIndex) {
				if (buttonIndex == 2) {
					storageAPI.localStorageAPI.removeItem("route_" + routeName);
					vtracker.startLearningNow(); //rerun this method
				}
			}, "Name exists", "Cancel,Overwrite")
			return;
		}
		
		//if all good, then proceed through

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
									"data-theme=\"b\" data-icon=\"check\" data-transition=\"none\">Destination Reached</a></div>");
		$("#loaderDialog").trigger('create'); //update the styles on the UI		
		
		//open the loader dialog
		$.mobile.changePage('#loaderDialog', 'none', true, true);
	},
	//***** END LEARN NEW ROUTE *****//
	
	//***** UPDATE/TRACK ROUTES *****//
	trackOrUpdateRoutes:function() {
		var allRoutes = vtracker.getAllRoutes(); //get all routes - in the future, you would only load the routes that are nearby
		
		//create the radio buttons
		vtracker.createRouteChoices(allRoutes, "#findRoutesDialog-routesNearby", "routesNearby");
		$("#findRoutesDialog").trigger('create'); //update the styles on the UI
		
		//show the dialog
		$.mobile.changePage('#findRoutesDialog', 'none', true, true);
	},
	
	trackMeOnRoute:function() {
		//TODO: implement tracking, probably by plotting the route, and adding a method that puts a cursor on the plot...
		//would be good to also calculate "distance travelled/route distance" using haversine
		
		var noti = new notificationObj();
		noti.alert("Under Construction","Not yet bra!","Okay")
		
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
		
		//refresh options
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
	
	recreateModel:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		if (routeName == null) {return;} //stop "no selection" case
		
		$("#loader").show();
		
		var noiseThreshold = $('#optionsDialog-noiseSlider').val(); //get noise threshold
		var minAccuracy = $('#optionsDialog-minAccuracy').val(); //get min accuracy
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		
		//set options
		vtracker.workingRoute.noiseThreshold = noiseThreshold; //set noise threshold
		vtracker.workingRoute.minAccuracy = minAccuracy; //set min accuracy
	
		//tell the user that it may take a while...
		//confirm before deleting
		var noti = new notificationObj();
		noti.confirm("Recreating the model for: " + routeName + " may take a while. Are you sure you want to do that?", function onConfirm(buttonIndex) {
			if (buttonIndex == 2) {
					setTimeout(function(){
						vtracker.workingRoute.recreateModel($("#loader").slideToggle());
						},1000);
					 }
		}, "Continue?","Cancel,Yup");
	},
	
	
	exportRouteAndModel:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		if (routeName == null) {return;} //stop "no selection" case
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		
		vtracker.workingRoute.exportRouteToDB();
		vtracker.workingRoute.exportModelToDB();
		
		//tell the user all went well
		var success = new notificationObj();
		success.alert("Exported","The route and its model have been exported.","Okay")
	},
	
	viewModel:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		if (routeName == null) {return;} //stop "no selection" case
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		
		//prepare the page = show the route's properties
		$("#previewpage-routeName").html(vtracker.workingRoute.name);
		$("#previewpage-dataLength").html(vtracker.workingRoute.geoData.longitude.length);
		$("#previewpage-learnCounter").html(vtracker.workingRoute.learnCounter);
		$("#previewpage-modelLength").html(vtracker.workingRoute.model.lon.length);
		$("#previewpage-noise").html(vtracker.workingRoute.noiseThreshold);
		$("#previewpage-placeholder").empty(); //clear placeholder display
		
		//display the page
		$.mobile.changePage('#previewpage', 'none', true, true);
	},
	
	showModelOnPlot:function() {
		//plot the model
		vtracker.workingRoute.showModelOnPlot("#previewpage-placeholder");
	},
	
	showModelOnSatelliteMap:function() {
		//show the model on Google Maps
		vtracker.workingRoute.showModelOnMap("#previewpage-placeholder", "SATELLITE");
	},
	
	showModelOnHybridMap:function() {
		//show the model on Google Maps
		vtracker.workingRoute.showModelOnMap("#previewpage-placeholder", "HYBRID");
	},
	
	showModelOnRoadMap:function() {
		//show the model on Google Maps
		vtracker.workingRoute.showModelOnMap("#previewpage-placeholder", "ROADMAP");
	},

	replayModel:function() {
		vtracker.workingRoute.replayModel(20);
	},
	
	replayRoute:function() {
		// if desireable the interval can be set to be a proportional to the time diff b/w points...
		// currently I am assuming ~5sec between readings... therefore 5000ms/50 = 100ms (ie. factor of 50x)
		vtracker.workingRoute.replayRoute(100); 
	},
	
	placeholderGrow:function() {
		//if necessary, this method can be made to be "smarter"
		var currentHeight1 = $("#previewpage-placeholder").height();
		$("#previewpage-placeholder").height(currentHeight1*1.5);
		var currentHeight2 = $("#trackingpage-placeholder").height();
		$("#trackingpage-placeholder").height(currentHeight2*1.5);
	},
	
	placeholderShrink:function() {
		//if necessary, this method can be made to be "smarter"
		var currentHeight1 = $("#previewpage-placeholder").height();
		$("#previewpage-placeholder").height(currentHeight1*0.75);
		var currentHeight2 = $("#trackingpage-placeholder").height();
		$("#trackingpage-placeholder").height(currentHeight2*0.75);
	},
	
	removeRoute:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		if (routeName == null) {return;} //stop "no selection" case
		
		//confirm before deleting
		var noti = new notificationObj();
		noti.confirm("Are you sure you want to delete: " + routeName + "\n This cannot be undone.", function onConfirm(buttonIndex) {
			if (buttonIndex == 2) {
					 storageAPI.localStorageAPI.removeItem("route_" + routeName);
					 vtracker.manageRoutes(); //refresh dialog
					 }
		}, "Delete?","Cancel,Delete");
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
			$(divId).append("<p>... <i>no routes found</i> ...</p>");
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
//constructor for the route object
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
	this.minAccuracy = 50; //minimum GPS accuracy tolerated
	this.learnCounter = 0;
	this.timeoutLimit = 10; //limit before we decide that the accuracy is not getting better...
	
	//handle route methods
	this.loadFromStored = function(storedRoute) {
		//when recovering a route from storage, the methods are all the same for any route
		//the only difference is the route's properties, so we load those in here:
		me.name = storedRoute.name;
		me.geoData = storedRoute.geoData;
		me.model = storedRoute.model;
		me.noiseThreshold = storedRoute.noiseThreshold;
		me.minAccuracy = storedRoute.minAccuracy;
		me.learnCounter = storedRoute.learnCounter;
		me.timeoutLimit = storedRoute.timeoutLimit;
	}
	
	var accuracyTimout = 0;
	this.onGeoMeasurement = function(measurement) {
		if (measurement.coords.accuracy <= me.minAccuracy) {
			if (accuracyTimout > 0) {me.routeAlerts.add("Accuracy improved. Learning...");}
			
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
				geolocationAPI.stopWatching(); //stop collecting measurements, other sensors can be turned off here
				me.routeAlerts.add("Learning stopped because measurement accuracy has been consistently poor.");
			} else {
				me.routeAlerts.add("Accuracy is poor (" + accuracyTimout + ").");
				accuracyTimout++;
			}
			return;
		}
		
		//create a model - this method call can be done in a webworker for optimisation
		me.model = modellingAPI.createModel(me); //we pass the method the actual route...
	}
	
	this.onGeoMeasurementError = function(error) {
		me.routeAlerts.add("geolocation error: " + error.code + ". Message: " + error.message);
	}
	
	this.recreateModel = function(callback) {
		me.model = {lon: [], lat: []}; //clear the model
		
		me.model = modellingAPI.createModel(me);
		me.save();
		
		callback(); //call callback function
	}
	
	this.showModelOnPlot = function(divId) {
		$(divId).empty();
		
		//prepare the options
		var plotOptions = {
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
		
		//plot in div using jQuery.flot and numeric.js to transpose
		$.plot($(divId), [ numeric.transpose([me.model.lon,me.model.lat]) ], plotOptions);
	}
	
	var modelPath;
	this.showModelOnMap = function(divId, mapType) {
		$(divId).empty();
		
        var mapOptions = {
	          center: new google.maps.LatLng(me.model.lat[0], me.model.lon[0]),
	          zoom: 14,
	          disableDefaultUI: true,
	          panControl: false,
			  zoomControl: true,
			  mapTypeControl: false,
			  scaleControl: false,
			  streetViewControl: false,
			  overviewMapControl: true,
	        };
	   	
	   	switch (mapType) {
	   		case "SATELLITE":
	   		mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
	   		break;
	   		
	   		case "HYBRID":
	   		mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
	   		break;
	   		
	   		case "ROADMAP":
	   		mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
	   		break;
	   		
	   		case "TERRAIN":
	   		mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
	   		break;
	   		
	   		default: mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
	   	};
	   	
	    var map = new google.maps.Map(document.getElementById(divId.replace('#','')), mapOptions);
	   	
		var modelCoordinates = [];
		for (var i in me.model.lon) { modelCoordinates[i] = new google.maps.LatLng(me.model.lat[i],me.model.lon[i]); }
		
		var lineSymbol = {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 4,
			strokeColor: '#393'
		};

	 	modelPath = new google.maps.Polyline({
	    	path: modelCoordinates,
	   	 	strokeColor: "#FF0000",
	    	strokeOpacity: 1.0,
	    	strokeWeight: 2,
	    	icons: [{icon: lineSymbol, offset: '100%'}],
	  	});
		
		modelPath.setMap(map); //generate and render map
	}
	
	this.getModelLength = function(from, to) {
		var length = 0;
		for (var i=from+1;i<to;i++) { length += modellingAPI.haversineDistance(me.model.lat[i-1],me.model.lon[i-1],me.model.lat[i],me.model.lon[i]); }
		return length; //in metres
	}
	
	this.getRouteLength = function(from, to) {
		var length = 0;
		for (var i=from+1;i<to;i++) { length += modellingAPI.haversineDistance(me.geoData.latitude[i-1],me.geoData.longitude[i-1],me.geoData.latitude[i],me.geoData.longitude[i]); }
		return length; //in metres
	}
	
	var offsetId;
	this.replayModel = function(interval) {
		clearInterval(offsetId);
		var count = 0;
	    offsetId = window.setInterval(function() {
	    	count = (count + 1) % 200;
	    	
	    	var icons = modelPath.get('icons');
	    	icons[0].offset = (count / 2)  + '%';
	   		modelPath.set('icons', icons);
	 	}, interval);
	}
	
	this.replayRoute = function(interval) {
		clearInterval(offsetId);
		var counter = 0;
	    offsetId = window.setInterval(function() {
	    	counter++;
	    	var distance = (me.getRouteLength(0,counter) / me.getRouteLength(0,me.geoData.latitude.length))*100;
	    	
	    	var icons = modelPath.get('icons');
	    	icons[0].offset = distance  + '%';
	    	
	    	if (distance == 100 || distance > 100) {clearInterval(offsetId);}
	   		modelPath.set('icons', icons);
	 	}, interval);
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
			me.routeAlerts.add("No route data exists. A new route will be created.");		
		}
		
		//add method to the geolocation's API callbacks stack
		geolocationAPI.successCBs.push(me.onGeoMeasurement); 
		
		//start collecting measurements, other sensors can be turned on here
		geolocationAPI.startWatching();
	}
	
	this.stopLearning = function() {
		//clear callbacks on API
		geolocationAPI.successCBs = []; 
		geolocationAPI.errorCBs = [];
		
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

//************************************* MODELLINGAPI **************************************//
var modellingAPI = {
	createModel:function(route) {
		//this function takes in a "route" and returns a model as "output"
		var data = {lon: route.geoData.longitude, lat: route.geoData.latitude}
		
		//we need to make sure it's actually good data
		if (data.lon.length != data.lat.length || !(data.lon.length > 0)) {route.routeAlerts.add("Data array is not suitable for modelling.");return;}
		
		//housekeeping, set some parameters
		var dataLength = data.lon.length; //get data length
		var start = 0;
		var end = dataLength-1;
		var borderRadius = route.noiseThreshold; //pull this from the route's properties
		
		//declare our output object, which we start adding to
		var output = {lon: [], lat: []};
		
		//push the start point onto the output
		//console.log("Modelling started from point: " + start)
		output.lon.push(data.lon[start]);
		output.lat.push(data.lat[start]);

		//get the first breakpoint after the start point
		var breakPoint = modellingAPI.getBreakPoint(data, start, end, borderRadius);
		//console.log("Loop broke, segment created from: " + start + " to " + breakPoint)
		
		//if it's less than the end, then get the other breakpoints until you reach the end
		while(breakPoint < end) {
			//push on the breakpoint, because it's before the end
			output.lon.push(data.lon[breakPoint]);
			output.lat.push(data.lat[breakPoint]);
			
			start = breakPoint; //change the starting point to the previous breakpoint
			breakPoint = modellingAPI.getBreakPoint(data, start, end, borderRadius); //find new breakPoint
			//console.log("Loop broke, segment created from: " + start + " to " + breakPoint)
		}
		
		//at this stage, "breakPoint" must equal "end"
		if (breakPoint!=end) {route.routeAlerts.add("Error: 'breakPoint' was not the 'end'");return;}
		
		//push on the last data point
		output.lon.push(data.lon[end]);
		output.lat.push(data.lat[end]);
		//console.log("Modelling ended at point: " + breakPoint);
		
		return output;
	},
	
	getBreakPoint:function(data, start, end, limit) {
		//uses "data" from "start" to "end" and returns the point where a straight line fit is still acceptable, under "limit" condition for RMSD
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
			
			//**** STEP 1: creating the (x,y) equivalent for point i, where lon[start],lat[start] is the origin
			x[i] = modellingAPI.haversineDistance(lat[start],lon[start],lat[start],lon[i]);
			y[i] = modellingAPI.haversineDistance(lat[start],lon[start],lat[i],lon[start]);
			
			//**** STEP 2: get the angle for the straight line between "start" and the current point of interest: i
			//we have the x,y components of the vector, so now let's get the angle "alpha" between the vector and the x-axis
			var alpha = -Math.atan2(y[i], x[i]);
			
			//**** STEP 3: apply that model from the start point, to the point of interest and find the squared deviations
			var squaredDeviations = []; //reset squared deviations
			for (var j = start+1; j < i; j++) {
				//console.log("testing midpoint: " + j)
				
				//using the alpha as the rotation angle of the z axis, rotate the vector such that it is aligned with the x-axis
				//at this point, the right angle deviation will equal the y-component: y' = x*sin(-alpha) + y*cos(-alpha)
				
				var deviation = x[j]*Math.sin(alpha) + y[j]*Math.cos(alpha); // deviation = y'
				squaredDeviations.push(deviation*deviation);
				//console.log(deviation);
			}
			
			//**** STEP 4: get the square root of the mean of the squared deviations (Root Mean Squared Deviations = RMSD)
			var RMSD = Math.sqrt(modellingAPI.retAvg(squaredDeviations));

			//console.log("RMSD: " + RMSD)
			if (RMSD >= limit) {return i-1;}//if it's larger than the limit, then return the previous point (when it was still okay)
		}
		
		//if the RMSD never exceeded the limit, just return the end point		
		return end;
	},
	
	retAvg:function(ary) {
		//return an array's average - this can also be used to modify the Array prototype to add a "avg()" method
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
	
	haversineDistance:function(lat1,lon1,lat2,lon2) {
		//use the Haversine formula to return the distance between two geo points in metres
		var R = 6371000; // radius of the earth in metres
		var dLat = (lat2-lat1) * Math.PI/180;
		var dLon = (lon2-lon1) * Math.PI/180;
		var lat1 = lat1 * Math.PI/180;
		var lat2 = lat2 * Math.PI/180;
		
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		
		return d;
	},
}
//*********************************** END MODELLINGAPI ************************************//

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
	
	initApplication:function() {
		//ABSOLUTELY NO CORDOVA CALLS ARE ALLOWED IN HERE!!
		
		//insert any other initialisations here...
				
		//initialise google maps
		if (local == null) {alert("local.js is missing! \n Can't initialise Google Maps"); return;}
		var myMap = {
		    GMapScriptURL: "http://maps.googleapis.com/maps/api/js?key=",
		    Map: null,
		    Geocoder: null,
		    InitiazlizeMaps: function () {
		        if (GBrowserIsCompatible()) {
		            this.Map = new GMap2(document.getElementById("previewpage-placeholder"));
		        }
		    }
		}
		$.getScript(myMap.GMapScriptURL + local.gmapsKey + "&callback=myMap.InitializeMaps&sensor=false");
	},
	
	//make sure a potential object name is not null or blank
	validObjName:function(name) {
		if (name == null || name == "") {
			console.log("Error: Invalid object name at declaration!");
			return false;
		} else {
			return true;
		}
	},
	
	//make sure the browser engine can do what we need
	checkBrowserCompatibility:function(divId) {
		//this is a rough compatibility check
		var incompatibilities = [];
		var coreReqs = ['geolocation', 'localstorage'];
		$(divId).empty();
		
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
			message+=("and <b>" +  incompatibilities[incompatibilities.length-1] + "</b>. ");
			$(divId).html(message);
		} else {
			$(divId).html("");
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