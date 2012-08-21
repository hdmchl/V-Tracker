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
					//if overwrite
					storageAPI.localStorageAPI.removeItem("route_" + routeName);
					vtracker.startLearningNow(); //rerun this method
				}
			}, "Name exists", "Cancel,Overwrite")
			return;
		}
		
		//not that all is good, proceed through

		//create new route object
		vtracker.workingRoute = new route(routeName);
		
		//set options
		vtracker.workingRoute.alertOps.displayInDiv(true);
		vtracker.workingRoute.alertOps.divId("#loaderDialog-alertsConsole");
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
		var allRoutes = vtracker.getAllRoutes(); //get all routes - in the future, you can only load the routes that are nearby
		
		//create the radio buttons
		vtracker.createRouteChoices(allRoutes, "#findRoutesDialog-routesNearby", "routesNearby");
		$("#findRoutesDialog").trigger('create'); //update the styles on the UI
		
		//show the dialog
		$.mobile.changePage('#findRoutesDialog', 'none', true, true);
	},
	
	trackMeOnRoute:function() {
		var routeName = $('input[name=routesNearby-choice]:checked').val(); //get route name from routesNearby selection
		if (routeName == null) {return;} //stop "no selection" case
		
		var rr = storageAPI.localStorageAPI.getObject("route_" + routeName); //get route from storage
		if (rr == null) {console.log("Error retrieving route from storage");return;}
		
		//setup route object
		vtracker.workingRoute = new route(rr.name);
		vtracker.workingRoute.loadFromStored(rr);
		vtracker.workingRoute.alertOps.displayInDiv(true);
		vtracker.workingRoute.alertOps.divId("#trackingpage-alertsConsole");
		vtracker.workingRoute.liveTrackingDivId = "#trackingpage-liveInfo";
		
		//prepare the page
		$("#trackingpage-alertsConsole").empty();
		$("#trackingpage-routeName").html(vtracker.workingRoute.name);
		vtracker.trackModelOnSatelliteMap(); //use Satellite map by default
		
		//start tracking
		vtracker.workingRoute.startTracking();
		
		//show the page
		$.mobile.changePage('#trackingpage', 'none', true, true);
	},
	
	restartTracking:function () {
		vtracker.workingRoute.resetTracking();
	},
	
	stopTracking:function() {
		vtracker.workingRoute.stopTracking();
	},
	
	trackModelOnSatelliteMap:function() {
		//show the model on Google Maps
		vtracker.workingRoute.showModelOnMap("#trackingpage-placeholder", "SATELLITE");
	},
	
	trackModelOnHybridMap:function() {
		//show the model on Google Maps
		vtracker.workingRoute.showModelOnMap("#trackingpage-placeholder", "HYBRID");
	},
	
	trackModelOnRoadMap:function() {
		//show the model on Google Maps
		vtracker.workingRoute.showModelOnMap("#trackingpage-placeholder", "ROADMAP");
	},
	
	updateRoute:function() {
		var routeName = $('input[name=routesNearby-choice]:checked').val(); //get route name from routesNearby selection
		if (routeName == null) {return;} //stop "no selection" case
		
		//get latest set of options
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
	
	recreateModel:function() {
		var routeName = $('input[name=allRoutes-choice]:checked').val(); //get route name
		if (routeName == null) {return;} //stop "no selection" case

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
	
		$("#loader").show(); //show loading panel
		
		//tell the user that it may take a while... confirm before proceeding
		var noti = new notificationObj();
		noti.confirm("Recreating the model for: \"" + routeName + "\" may take a while. Are you sure you want to do that?", function onConfirm(buttonIndex) {
			if (buttonIndex == 2) {
						//if user agrees, wait a second and then start
						setTimeout(function() {
							var startTIME = new Date().getTime(); //get start time
							
							vtracker.workingRoute.recreateModel(function () {
									$("#loader").slideToggle();
									var endTime = new Date().getTime();
									var time = endTime - startTIME;
									noti.alert("Model Created","It took: " + time + "ms to recreate the model.","Okay");
								});
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
		
		//run export methods
		vtracker.workingRoute.exportRouteToDB();
		vtracker.workingRoute.exportModelToDB();
		
		//tell the user all went well
		var success = new notificationObj();
		success.alert("Done","The route and its model have been exported.","Okay")
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
		
		//show the model on a plot by default
		vtracker.showModelOnPlot();
		
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
		vtracker.workingRoute.replayModel(20); //with 20ms intervals
	},
	
	replayRoute:function() {
		vtracker.workingRoute.replayRoute(60); // at a rate of x60
	},
	
	stopReplay:function() {
		vtracker.workingRoute.stopReplay(); //stop the replay
	},
	
	placeholderGrow:function() {
		//adjust the height on both placeholders
		var currentHeight1 = $("#previewpage-placeholder").height();
		$("#previewpage-placeholder").height(currentHeight1*1.5);
		var currentHeight2 = $("#trackingpage-placeholder").height();
		$("#trackingpage-placeholder").height(currentHeight2*1.5);
	},
	
	placeholderShrink:function() {
		//adjust the height on both placeholders
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
		noti.confirm("Are you sure you want to delete: \"" + routeName + "\"\n This cannot be undone.", function onConfirm(buttonIndex) {
			if (buttonIndex == 2) {
					 //if confirmed delete
					 storageAPI.localStorageAPI.removeItem("route_" + routeName);
					 vtracker.manageRoutes(); //reload dialog
					 }
		}, "Confirm","Cancel,Delete");
	},
	//***** END MANAGE ROUTES *****//
	
	//***** GENERAL helper scripts *****//
	getAllRoutes:function() {
		//return all route names
		var allRoutes = [];
		var allItemKeys = storageAPI.localStorageAPI.getAllItemKeys();

		for (i in allItemKeys) {	
			if(allItemKeys[i].substring(0,6) == "route_") {
				//for each item, if it's a route, add it to the array of routes
				allRoutes.push(allItemKeys[i].substr(6));
			}
		}
		
		return allRoutes; //return the array of routes
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
		//create radio buttons for the all the routes passed in routesAry and put it in divId, and use "prefix" to identify the radio buttons
		
		$(divId).empty(); //empty the div
		
		if (routesAry.length == 0) {
			$(divId).append("<p>... <i>no routes found</i> ...</p>");
			return;
		}
		
		//if there are routes, create radios and pre-check the last one
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
	
	//handle alerts and their options
	this.routeAlerts = new alertsObj(name);
	this.alertOps = {
		displayInDiv:function(state) {me.routeAlerts.displayInDiv = state},
		divId:function(divId) {me.routeAlerts.divId = divId},	
	}
	this.liveTrackingDivId; //the divID for live feedback during tracking
	
	//handle route properties
	this.name = name; //route name
	this.geoData = {timestamp: [],
					latitude: [],
					longitude: [],
					altitude: [],
					accuracy: [],
					altitudeAccuracy: [],
					heading: [],
					speed: [] }, //route raw geolocation data
	this.model = {lon: [], lat: []}; //model coordinates
	this.noiseThreshold = 2; 	//the threshold radius (in metres) between what is considered to be natural noise fluctuation and what is considered to be a route change
	this.minAccuracy = 50; 		//minimum GPS accuracy tolerated
	this.learnCounter = 0; 		//the number of times this route has been learnt
	this.timeoutLimit = 10; 	//limit before we decide that the accuracy is not going to get better...
	
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
	
	var accuracyTimoutCounter = 0; //used for learning and tracking
	
	this.onLearningGeoMeasurement = function(measurement) {
		if (measurement.coords.accuracy <= me.minAccuracy) {
			//if accuracy is okay...
			
			//check timeout counter
			if (accuracyTimoutCounter > 0) {me.routeAlerts.add("Accuracy is adequate. Learning...");}
			
			//add measurement to "data" array
			me.geoData.timestamp.push(measurement.timestamp);
			me.geoData.latitude.push(measurement.coords.latitude);
			me.geoData.longitude.push(measurement.coords.longitude);
			me.geoData.accuracy.push(measurement.coords.accuracy);
			me.geoData.altitude.push(measurement.coords.altitude);
			me.geoData.altitudeAccuracy.push(measurement.coords.altitudeAccuracy);
			me.geoData.heading.push(measurement.coords.heading);
			me.geoData.speed.push(measurement.coords.heading);
			//me.routeAlerts.add("measurement added"); //useful for debugging
			
			accuracyTimoutCounter = 0; //reset accuracy timeout
		} else {
			//accuracy is poor, check to see how long it has been poor for
			if (accuracyTimoutCounter%me.timeoutLimit == 0 && accuracyTimoutCounter != 0) {
				if (vtrackerAPI.devicePaused) {
					var geoNotification = new notificationObj();
					geoNotification.pushNot(notificationsAPI.getTimeAfter(100),"Measurement accuracy has been consistently poor (" + accuracyTimoutCounter + ").","",false,"GPSON");
				}
				me.routeAlerts.add("Measurement accuracy has been consistently poor (" + accuracyTimoutCounter + ").");
			} else {
				//accuracy is poor, but it hasn't hit a multiple of the timeout limit...
				//me.routeAlerts.add("Accuracy is poor (" + accuracyTimoutCounter + ").");
			}
			accuracyTimoutCounter++;
			return;
		}
		
		//create a model - this method call can be done in a webworker for optimisation
		//currently we pass the method the actual route... I wonder if parsing less data would speed things up a little?
		me.model = modellingAPI.createModel(me);
	}
	
	var currentSegmentIndex = null; //keep track of our current segment's index
	this.onTrackingGeoMeasurement = function (measurement) {
		if (measurement.coords.accuracy >= me.minAccuracy) {
			//accuracy is poor, check to see how long it has been poor for
			if (accuracyTimoutCounter%me.timeoutLimit == 0 && accuracyTimoutCounter != 0) {
				if (vtrackerAPI.devicePaused) {
					var geoNotification = new notificationObj();
					geoNotification.pushNot(notificationsAPI.getTimeAfter(100),"Measurement accuracy has been consistently poor (" + accuracyTimoutCounter + ").","",false,"GPSON");
				}
				me.routeAlerts.add("Measurement accuracy has been consistently poor (" + accuracyTimoutCounter + ").");
			} else {
				//accuracy is poor, but it hasn't hit a multiple of the timeout limit...
				//me.routeAlerts.add("Accuracy is poor (" + accuracyTimoutCounter + ").");
			}
			accuracyTimoutCounter++;
			return;
		}
		
		accuracyTimoutCounter = 0;
		
		//set search boundaries
		if (currentSegmentIndex == null) {
			//if the current segment is not defined, then find the nearest segment by searching through the whole model
			var start = 0;
			var end = detailedModel.length-1 ;
		} else {
			//if we know the currentSegment, then only look at the previous, current and next segments
			var start = currentSegmentIndex-1;
			var end = currentSegmentIndex+1;
		}
		
		//find the nearest segment within the boundaries set above
		var shortestDistanceToSegment_Index = [];
		var shortestDistanceToSegment_Distance = [];
		for (var i=start;i<end+1;i++) {
			if (i<0 || i >= detailedModel.length) {continue;} //skip loop if i is out of bounds
			
			//for each segment...
			var shortestDistance = -1;
			var shortestDistance_index = 0;
			
			for (var j in detailedModel[i].lon) {
				//for each point on the segment...
				
				//find EUCLIDEAN distance to current measurement
				var a = measurement.coords.longitude - detailedModel[i].lon[j];
				var b = measurement.coords.latitude - detailedModel[i].lat[j];
				var distance = Math.sqrt((a*a)+(b*b)); 
				
				//if distance is shorter than available, then store
				if (distance < shortestDistance || shortestDistance == -1) {
					shortestDistance = distance;
					shortestDistance_index = j; //store the index of the point that is closest
				}
			}
			
			//push the segment's info to arrays
			shortestDistanceToSegment_Index.push(shortestDistance_index);
			shortestDistanceToSegment_Distance.push(shortestDistance);
		}
		
		//once we have the nearest point in each segment, find the nearest segment
		var nearestSegmentIndex = shortestDistanceToSegment_Distance.indexOf(Math.min.apply(Math, shortestDistanceToSegment_Distance));
		var nearestSegmentSubindex = shortestDistanceToSegment_Index[nearestSegmentIndex];
		
		//if this is the first run, set the current segment index
		if (currentSegmentIndex == null) {
			currentSegmentIndex = nearestSegmentIndex;
			me.routeAlerts.add("Tracking started at segment: " + currentSegmentIndex);
		} else {
			//need to make an adjustment, because we're not scanning all segments at this stage
			currentSegmentIndex = currentSegmentIndex-1 + nearestSegmentIndex;
		}
		
		//calculate distance travelled from start by adding
		var distanceTravelled = me.getModelLength(0,currentSegmentIndex);
		distanceTravelled += modellingAPI.haversineDistance(detailedModel[currentSegmentIndex].lat[0],
															detailedModel[currentSegmentIndex].lon[0],
															detailedModel[currentSegmentIndex].lat[nearestSegmentSubindex],
															detailedModel[currentSegmentIndex].lon[nearestSegmentSubindex]);
		var travelledPercentage = (distanceTravelled / me.getModelLength(0,me.model.lat.length-1))*100;

		//visualise
		$(me.liveTrackingDivId).html("<p>Travelled: " + Math.round(distanceTravelled) + "m (" + Math.round(travelledPercentage) + "%) from start point</p>")
		var icons = modelPath.get('icons');
		icons[0].offset = travelledPercentage  + '%';
		modelPath.set('icons', icons);	   	
		map.panTo(new google.maps.LatLng(measurement.coords.latitude,measurement.coords.longitude)); //pan map
	}
	
	this.onGeoMeasurementError = function(error) {
		me.routeAlerts.add("geolocation error: " + error.code + ". Message: " + error.message);
	}
	
	this.recreateModel = function(callback) {
		me.model = {lon: [], lat: []}; //clear the model
		me.model = modellingAPI.createModel(me); //recreate model
		me.save();
		
		callback(); //call callback function on finish
	}
	
	this.getModelLength = function(from, to) {
		var length = 0;
		for (var i=from+1;i<to+1;i++) { length += modellingAPI.haversineDistance(me.model.lat[i-1],me.model.lon[i-1],me.model.lat[i],me.model.lon[i]); }
		return length; //in metres
	}
	
	this.getRouteLength = function(from, to) {
		var length = 0;
		for (var i=from+1;i<to+1;i++) { length += modellingAPI.haversineDistance(me.geoData.latitude[i-1],me.geoData.longitude[i-1],me.geoData.latitude[i],me.geoData.longitude[i]); }
		return length; //in metres
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
	
	var map = null; //make map available to other route methods
	var modelPath = null; //make map available to other route methods
	this.showModelOnMap = function(divId, mapType) {
		$(divId).empty();
		
        var mapOptions = {
	          center: new google.maps.LatLng(me.model.lat[0], me.model.lon[0]), //center at the start
	          zoom: 14, //this can be made to be "smarter", and fill the tile with the route
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
	   	
	    map = new google.maps.Map(document.getElementById(divId.replace('#','')), mapOptions);
	   	
	   	//load model coordinates into an array of gmaps.latlng's
		var modelCoordinates = [];
		for (var i in me.model.lon) { modelCoordinates[i] = new google.maps.LatLng(me.model.lat[i],me.model.lon[i]); }
		
		//set options for symbol
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
		
		modelPath.setMap(map); //generate and render model on the map
	}
	
	var offsetId = null; //the ID for the interval timer that is used in playbacks
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
	
	this.replayRoute = function(rate) {
		clearInterval(offsetId);
		
		//get route total time
		var startTime = Date.parse(me.geoData.timestamp[0]);
		var endTime = Date.parse(me.geoData.timestamp[me.geoData.timestamp.length-1]);
		
		//calculate interval
		var interval = (Number(endTime)-Number(startTime)) / (me.geoData.latitude.length * rate);
		
		var totalRouteDistance = me.getRouteLength(0,me.geoData.latitude.length-1);
		var counter = 0;
	    offsetId = window.setInterval(function() {
	    	counter++;
	    	var distance = (me.getRouteLength(0,counter) / totalRouteDistance)*100;
	    	
	    	var icons = modelPath.get('icons');
	    	icons[0].offset = distance  + '%';
	    	
	    	if (distance == 100 || distance > 100) {clearInterval(me.offsetId);}
	   		modelPath.set('icons', icons);	   	
			map.panTo(new google.maps.LatLng(me.geoData.latitude[counter],me.geoData.longitude[counter])); //pan map
	 	}, interval);
	}
	
	this.stopReplay = function() {
		clearInterval(offsetId);
	}
	
	this.learn = function() {
		//housekeeping
		me.learnCounter++;
		me.routeAlerts.add("Please hang tight while I learn the route <b>" + me.name + "</b>");
		me.routeAlerts.add("This is update #" + me.learnCounter);
		
		// tell the user what's happening
		if (me.model.lat.length > 0 && me.model.lon.length > 0) {
			me.routeAlerts.add("A model exists for this route - only route changes will be recorded.");
			//TODO: ROUTE UPDATING
		} else {
			me.routeAlerts.add("No route data exists. A new route will be created.");
		}
		
		//add method to the geolocation's API callbacks stack
		geolocationAPI.successCBs.push(me.onLearningGeoMeasurement); 
		geolocationAPI.errorCBs.push(me.onGeoMeasurementError); 
	
		me.routeAlerts.add("Initialising geolocation. Please stand by.");
		
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
	
	var detailedModel = [];
	this.startTracking = function() {
		//expand the model so that it is extra specific, to be used for tracking
		var subsegmentSize = me.noiseThreshold; //distance between points in metres
		for (var i = 1;i<me.model.lon.length;i++) {
			detailedModel[i-1] = {lon:[],lat:[]};
			var subsegments = Math.round(modellingAPI.haversineDistance(me.model.lat[i-1],me.model.lon[i-1],me.model.lat[i],me.model.lon[i])/subsegmentSize); //number of subsegments
			if (subsegments < 2) {subsegments = 2};
			var additionalLats = numeric.linspace(me.model.lat[i-1],me.model.lat[i],subsegments);
			var additionalLons = numeric.linspace(me.model.lon[i-1],me.model.lon[i],subsegments);
			detailedModel[i-1].lat = detailedModel[i-1].lat.concat(additionalLats);
			detailedModel[i-1].lon = detailedModel[i-1].lon.concat(additionalLons);
		}
		
		//add method to the geolocation's API callbacks stack
		geolocationAPI.successCBs.push(me.onTrackingGeoMeasurement); 
		geolocationAPI.errorCBs.push(me.onGeoMeasurementError); 
		
		//start collecting measurements, other sensors can be turned on here
		geolocationAPI.startWatching();
		
		me.routeAlerts.add("Initialising geolocation. Please stand by.");
	}
	
	this.resetTracking = function() {
		currentSegmentIndex = null;
	}
	
	this.stopTracking = function() {
		//clear callbacks on API
		geolocationAPI.successCBs = []; 
		geolocationAPI.errorCBs = [];
		
		//stop collecting measurements, other sensors can be turned off here
		geolocationAPI.stopWatching();
		
		me.routeAlerts.add("Route tracking complete.");
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
	devicePaused: false, //global flag for methods to know if a device has been paused
	deviceOnline: false, //global flag for methods to know if a device has an internet connection
	
	onPauseCBs: [], //this is an array of functions that get called "onPause"
	onOfflineCBs: [], //this is an array of functions that get called "onOffline"
	
	//set callback for device pause
	onPause:function() {
		//console.log("Device paused!");
		vtrackerAPI.devicePaused = true;
		
		//tell the user if GPS is still ON when the application is paused
		if (geolocationAPI.watchID) {
			var geoNotification = new notificationObj();
			geoNotification.pushNot(notificationsAPI.getTimeAfter(5000),"The GPS radio is still on!","",false,"GPSON");
		}
		
		//execute onPause callback functions
		for(var i in vtrackerAPI.onPauseCBs) {
			vtrackerAPI.onPauseCBs[i]();
		}
	},
	
	//set callback for device resume
	onResume:function() {
		//console.log("Device resumed!");
		vtrackerAPI.devicePaused = false;
		notificationsAPI.clearAll();
	},
	
	//set callback for device online
	onOnline:function() {
		//console.log("Device online!");
		vtrackerAPI.deviceOnline = true;
	},
	
	//set callback for device offline
	onOffline:function() {
		//console.log("Device offline!");
		vtrackerAPI.deviceOnline = false;
		
		//tell the user that all went well
		var offline = new notificationObj();
		offline.alert("User Offline","Looks like you've lost your internet connection. \n Google maps will not work while you are offline.","Okay")
		
		//execute onOffline callback functions
		for(var i in vtrackerAPI.onOfflineCBs) {
			vtrackerAPI.onOfflineCBs[i]();
		}
	},
	
	//link google maps files to the application
	initGoogleMaps:function() {
		//initialise google maps by programatically including the script
		if (local == null) {alert("local.js is missing! \n Can't initialise Google Maps"); return;} //gmaps API key is in local.js
		
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
		if (name == null || name == "" || !(/^[0-9A-Za-z ]+$/.test(name))) {
			var noti = new notificationObj();
			noti.alert("Invalid name!","Please try again using an alphanumeric name.","Okay")
			return false;
		} else {
			return true;
		}
	},
	
	//make sure the browser engine can do what we need
	checkBrowserCompatibility:function(divId) {
		//this is a rough compatibility check for browsers, it runs the test method for each API, results are returned into divId
		var incompatibilities = [];
		var coreReqs = ['geolocation', 'localstorage']; //specify the app's absolutely core requirements
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
//constructor for a console alerts object, used by route objects
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
		
		//if flag is true, then display latest alerts in window
		if(me.displayInDiv) {
			$(me.divId).append(me.data.message.length + ") " + me.data.message[me.data.message.length-1] + "<br />");
		}
		
		console.log(message); //display message in output console as well
	};
}
//************************************* END alertsObj *************************************//