/* storage.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var db = null; //declare a global database object

var storage = {
	ready: false, //status flag
	
	//********************************** INITIALISE STORAGE ***********************************//
	init:function() {
		document.getElementById('databases').innerHTML = '';
		
		db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //open a 2MBs database
		
		//create tables
		db.transaction(function (tx) {
					   tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Timestamp, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS ACCELEROMETER (id unique, Timestamp, AccelerationX, AccelerationY, AccelerationZ);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS COMPASS (id unique, Timestamp, MagneticNorth, TrueHeading, HeadingAccuracy);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS GYROSCOPE (id unique, Timestamp, Alpha, Beta, Gamma);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS CONSOLELOG (id, Timestamp, Message);');
					   }, this.errorCB, this.successCB);
		
		this.ready = true;
		consoleLog.add("Database opened. Storage initiated. Storage ready: " + this.ready);
	},
	//******************************** END INITIALISE STORAGE *********************************//
	
	//************************************ RESET DATABASES ************************************//
	reset:function() {
		this.ready = false;
		document.getElementById('databases').innerHTML = '';
		
		db.transaction(function (tx) {
					   //drop existing tables
					   tx.executeSql('DROP TABLE IF EXISTS GEOLOCATION;');
					   tx.executeSql('DROP TABLE IF EXISTS ACCELEROMETER;');
					   tx.executeSql('DROP TABLE IF EXISTS COMPASS;');
					   tx.executeSql('DROP TABLE IF EXISTS GYROSCOPE;');
					   tx.executeSql('DROP TABLE IF EXISTS CONSOLELOG;');
					   }, this.errorCB, this.init);
		
		console.log("Database tables reset! Storage ready: " + this.ready);
	},
	//********************************** END RESET DATABASES **********************************//
	
	//************************************ ERROR HANDLING *************************************//
	errorCB:function(error) {
	    consoleLog.add("Error processing SQL: " + error.code + " | " + error.message);
	},
	
	successCB:function(toStore) {
		/*do not call the consoleLog object in here, because you'll get an infinite loop on success*/
	    
		//console.log("SQL processed successfully!");
		//if (toStore) {console.log("stored: " + toStore)};
	},
	//********************************** END ERROR HANDLING ***********************************//
	
	//******************************** INSERT DATA INTO TABLES ********************************//
	rowIdCounter: {
		consoleLogTable: 0,
		accelerometerTable: 0,
		compassTable: 0,
		gyroscopeTable: 0,
		geolocationTable: 0
	},
	
	//can't use this. in here...
	updateSQLTable: {
		//console log table
		consoleLog:function(message) {
			var toStore = '"' + new Date(new Date().getTime()) + '",' + 
			              '"' + message + '"';
			
			db.transaction(function (tx) {
										tx.executeSql('INSERT INTO CONSOLELOG VALUES (' + storage.rowIdCounter.consoleLogTable + ',' + toStore + ');');
										storage.rowIdCounter.consoleLogTable++;
										}, function (error) { //onError
									   			console.log("Error logging: " + message + " | Details: " + error.code + ", " + error.message);
						   				  					}, storage.successCB(toStore));
		},
		
		//accelerometer table
		accelerometer:function(accelerationData) {
			var toStore =	'"' + new Date(accelerationData.timestamp) + '",' +
							'"' + accelerationData.x          + '",' +
							'"' + accelerationData.y          + '",' +
							'"' + accelerationData.z          + '"';
			
			db.transaction(function (tx) {
										tx.executeSql('INSERT INTO ACCELEROMETER VALUES (' + storage.rowIdCounter.accelerometerTable + ',' + toStore + ');');
										storage.rowIdCounter.accelerometerTable++;
										}, storage.errorCB, storage.successCB(toStore));
		},
		
		//compass table
		compass:function(compassHeading) {
			var toStore = 	'"' + new Date(compassHeading.timestamp)  + '",' +               
							'"' + compassHeading.magneticHeading      + '",' + 
							'"' + compassHeading.trueHeading    	  + '",' + 
							'"' + compassHeading.headingAccuracy      + '"';
			
			db.transaction(function (tx) {
										tx.executeSql('INSERT INTO COMPASS VALUES (' + storage.rowIdCounter.compassTable + ',' + toStore + ');');
										storage.rowIdCounter.compassTable++;
										}, storage.errorCB, storage.successCB(toStore));
		},
		
		//gyroscope table
		gyroscope:function(gyroData) {
			var toStore = 	'"' + new Date(gyroData.timestamp) 	+ '",' +               
							'"' + gyroData.alpha    	+ '",' +
							'"' + gyroData.beta     	+ '",' +
							'"' + gyroData.gamma    	+ '"';
							
			
			db.transaction(function (tx) {
										tx.executeSql('INSERT INTO GYROSCOPE VALUES (' + storage.rowIdCounter.gyroscopeTable + ',' + toStore + ');');
										storage.rowIdCounter.gyroscopeTable++;
										}, storage.errorCB, storage.successCB(toStore));
		},
		
		//geolocation table
		geolocation:function(position) {	
			var toStore =	'"' + new Date(position.timestamp)      + '",' +
							'"' + position.coords.latitude          + '",' +
							'"' + position.coords.longitude         + '",' +
							'"' + position.coords.altitude          + '",' +
							'"' + position.coords.accuracy          + '",' +
							'"' + position.coords.altitudeAccuracy  + '",' +
							'"' + position.coords.heading           + '",' +
							'"' + position.coords.speed             + '"';
		
			db.transaction(function (tx) {
										tx.executeSql('INSERT INTO GEOLOCATION VALUES (' + storage.rowIdCounter.geolocationTable + ',' + toStore + ');');
										storage.rowIdCounter.geolocationTable++;
										}, storage.errorCB, storage.successCB(toStore));
		}
	},
	//****************************** END INSERT DATA INTO TABLES ******************************//
	
	//*************************** RETRIEVING TABLE LENGTHS FROM DB ****************************//	
	queryCounter: 0,
	dbTables: [], //declare array of database tables
	
	getDBTables:function() {
		document.getElementById('databases').innerHTML = 'loading...';
		
		document.getElementById('loader').style.visibility = 'visible';
		
		// get a list of all the available tables and load into the dbTables array - when completed, getTableLengths
		db.transaction(function (tx) {
					   tx.executeSql('SELECT * FROM sqlite_master WHERE type=\'table\'', [], function (tx, results) {
									 for (var i=1; i<results.rows.length; i++) {storage.dbTables[i] = results.rows.item(i).name;}
									 }, this.errorCB);
					   }, this.errorCB, this.getTableLengths);
	},
	
	//this is a callback, can't use this.
	getTableLengths:function() {
		//if this is a clean run, then empty the output window
		if (storage.queryCounter == 0) {document.getElementById('databases').innerHTML = '';}
		
		storage.queryCounter++;
		
		if (storage.queryCounter < storage.dbTables.length) {
			//if the next table to be queried is the infoTable, then skip
			if (storage.dbTables[storage.queryCounter] == "__WebKitDatabaseInfoTable__") {
				storage.getTableLengths();
				return;
			}
			
			//otherwise, select everything in that table and put in a query for its length...
			var tableQuery = 'SELECT * FROM ' + storage.dbTables[storage.queryCounter];
			storage.getTableLengthsQuery(storage.dbTables[storage.queryCounter], tableQuery);
		}
		else {
			//if we're done, then post 'finished...' and hide the progress window
			document.getElementById('databases').innerHTML = document.getElementById('databases').innerHTML + '<p>finished...</p>';
			document.getElementById('loader').style.visibility = 'hidden';
			storage.queryCounter = 0;
		}
	},
	
	getTableLengthsQuery:function(tableName, tableQuery) {
		//display the table's length, then call getTableLengths when done
		db.transaction(function (tx){
						   tx.executeSql(tableQuery, [], function (tx, results) {
									 	var buffer = '<p>' + tableName + ' length: ' + results.rows.length + '</p>';
										document.getElementById('databases').innerHTML = document.getElementById('databases').innerHTML + buffer;
									 }, this.errorCB);
						   }, this.errorCB, this.getTableLengths);	
	}
	//************************* END RETRIEVING TABLE LENGTHS FROM DB **************************//	
}