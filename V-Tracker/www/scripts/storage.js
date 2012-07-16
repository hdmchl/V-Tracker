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
		db = window.openDatabase("VTracker_db", "1.00", "V-Tracker DB", 2 * 1024*1024); //open a 2MBs database

		storage.createTable('consolelog','CONSOLELOG');
		
		storage.ready = true;
		consoleLog.add("Database opened. Storage initiated. Storage ready: " + storage.ready);
	},
	//******************************** END INITIALISE STORAGE *********************************//
	
	//************************************ RESET DATABASES ************************************//
	reset:function() {
		storage.ready = false;
		storage.dropTable(storage.dbTables)	
		
		console.log("Database tables reset! Storage ready: " + storage.ready);
		
		storage.init();
	},
	//********************************** END RESET DATABASES **********************************//
	
	//************************************* CREATE TABLE **************************************//
	createTable:function(type, tableName) {
		var dbFields = "id unique";
		
		switch(type) {
			case "geolocation":
				for (var i in geolocationObj.data) {
				  	dbFields = dbFields + "," + i;
				}
				break;
				
			case "compass":
				for (var i in compassObj.data) {
				  	dbFields = dbFields + "," + i;
				}
				break;	
			
			case "accelerometer":
				for (var i in accelerometer.data) {
				  	dbFields = dbFields + "," + i;
				}
				break;
				
			case "gyroscope":
				for (var i in gyroscopeObj.data) {
				  	dbFields = dbFields + "," + i;
				}
				break;
				
			case "consolelog":
				dbFields = "id, Timestamp, Message";
				break;
			
			default:
				console.log("db table: \'" + tableName + "\' could not be created");
				return
		}
		
		db.transaction(function (tx) {
					   tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + dbFields + ');');
					   }, storage.errorCB, storage.successCB);
		
		storage.getDBTables();				   		   
	},
	
	//*********************************** END CREATE TABLE ************************************//
	
	//************************************** DROP TABLE ***************************************//
	dropTable:function(tableNames) {
		db.transaction(function (tx) {for (var i=0;i<tableNames.length;i++) {
											tx.executeSql('DROP TABLE IF EXISTS ' + tableNames[i] + ';');
											}
									  }, [], storage.errorCB, storage.init);
		storage.getDBTables();
	},
	//************************************ END DROP TABLE *************************************//
	
	//************************************ ERROR HANDLING *************************************//
	errorCB:function(error) {
	    consoleLog.add("Error processing SQL: " + error.code + " | " + error.message);
	},
	
	successCB:function(toStore) {
		//=== do not call the consoleLog object in here, because you'll get an infinite loop on success ===//
	    
		//console.log("SQL processed successfully!");
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
	
	updateTable:function(tableName, data) {
		db.transaction(function (tx){
	  					 tx.executeSql('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "' + tableName + '";', [], function (tx, results) {
							  var columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');
							  console.log(columnParts);
									 }, storage.errorCB);
					   }, storage.errorCB, storage.successCB);
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
	
	//************************ RETRIEVING TABLES AND LENGTHS FROM DB **************************//	
	queryCounter: 0,
	dbTables: [], //declare array of database tables
	
	getDBTables:function() {
		storage.dbTables = []; //clear arry

		// get a list of all the available tables and load into the dbTables array - when completed, getTableLengths
		db.transaction(function (tx) {
					   tx.executeSql('SELECT * FROM sqlite_master WHERE type=\'table\'', [], function (tx, results) {
							   				 if (results.rows.length != 0) {
							   				 	for (var i=1; i<results.rows.length; i++) {storage.dbTables[i-1] = results.rows.item(i).name;}
							   				 }
									 }, storage.errorCB);
					   }, storage.errorCB, function() {console.log("dbTables updated: " + storage.dbTables)});
	},
	
	getDBTableLengths:function() {
		//if this is the first run, then set the output window
		if (storage.queryCounter == 0) {$('#databases').append('<p>started...</p>');}
		
		if (storage.queryCounter < storage.dbTables.length) {
			//if the next table to be queried is the infoTable, then skip
			if (storage.dbTables[storage.queryCounter] == "__WebKitDatabaseInfoTable__") {
				storage.getDBTableLengths();
				return;
			}
			
			//otherwise, select everything in that table and put in a query for its length...
			var tableQuery = 'SELECT * FROM ' + storage.dbTables[storage.queryCounter];
			storage.getTableLengthsQuery(storage.dbTables[storage.queryCounter], tableQuery);
			storage.queryCounter++;
		}
		else {
			//if we're done, then post 'finished...' and hide the progress window
			storage.queryCounter = 0;
			$('#databases').append('<p>finished!</p>');
		}
	},
	
	getTableLengthsQuery:function(tableName, tableQuery) {
		//display the table's length, then call getTableLengths when done
		db.transaction(function (tx){
						   tx.executeSql(tableQuery, [], function (tx, results) {
									 	$('#databases').append('<p>' + tableName + ' length: ' + results.rows.length + '</p>');
									 }, this.errorCB);
						   }, this.errorCB, this.getDBTableLengths);	
	}
	//********************** END RETRIEVING TABLES AND LENGTHS FROM DB ************************//		
}