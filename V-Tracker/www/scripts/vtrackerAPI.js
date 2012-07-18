/* vtracker.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//*************************************** routeObj ****************************************//
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
	this.pushMeasurement = function(measurements) {
		me.geoData.push(measurements);
		//routeAlerts.add("measurement added")
	};
	
	this.learn = function() {
		if (me.learnCounter > 3) {
			//if measurement is statiscally off, then pushMeasurement, else dismiss
			//if pushed a new measurement, delete old one...
		} else {
			//TO DO: check measurement accuracy before pushing
			geolocationAPI.successCBs.push(me.pushMeasurement);
		}

		geolocationAPI.startWatching();
		
		me.learnCounter++;
		me.routeAlerts.add("Please stand by while I learn the route <b> " + me.name + "</b>");
		me.routeAlerts.add("Update no. " + me.learnCounter + " started for route: " + me.name);
	}
	
	this.end = function() {
		geolocationAPI.successCBs = []; //clear callbacks on API
		geolocationAPI.stopWatching();
		
		me.routeAlerts.add("Route learning complete.");
	}
	
	this.save = function() {
		//TO DO: save to localstorage
		
		console.log("Route " + me.name + " was saved.");
	}
	
	this.exportToDB = function() {
		//get ready
		var routeDB = "route_" + me.name;
		storageAPI.createTable(me.data,routeDB);
		
		//create sql entries
		var toSQL = [];
		for (var i=0;i<me.geoData.timestamp.length;i++) {
			 //toSQL.push(geolocationAPI.formatDataForSQL(me.geoData[i])); //need to see if this will work...
		}	 
		
		//insert into db table
		for (var i=0;i<toSQL.length;i++) {
			storageAPI.insertIntoTable(routeDB,toSQL[i]);
		}
	}
}
//************************************* END routeObj **************************************//

//*************************************** alertsObj ***************************************//
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
		
		/*TO DO: store messages in db
		var toStore = '"' + new Date(new Date().getTime()) 	+ '",' +
				      '"' + message 						+ '"';
		storageAPI.insertIntoTable(me.name,toStore); //update SQL*/
		
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
	//storageAPI.createTable(this.data,this.name);
}
//************************************* END alertsObj *************************************//