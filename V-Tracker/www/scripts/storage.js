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

		storage.createTable(consoleLogObj,'CONSOLELOG');
		
		storage.ready = true;
		console.log("Database opened. Storage initiated. Storage ready: " + storage.ready);
	},
	//******************************** END INITIALISE STORAGE *********************************//
	
	//************************************ RESET DATABASES ************************************//
	reset:function() {
		storage.ready = false;
		storage.dropTable(storage.dbTables); //drop all tables we know about at this stage
		console.log("Database tables reset! Storage ready: " + storage.ready);
	},
	//********************************** END RESET DATABASES **********************************//
	
	//************************************* CREATE TABLE **************************************//
	createTable:function(parentObject, tableName) {
		//Specify schema for table based on the object's 'data' properties
		var dbFields = "id integer primary key autoincrement";
		for (var i in parentObject["data"]) {
			dbFields = dbFields + "," + i;
		}
		
		//create table
		db.transaction(function (tx) {
					   tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + dbFields + ');');
					   }, storage.errorCB, storage.successCB);
		
		storage.getDBTables();   		   
	},
	
	//*********************************** END CREATE TABLE ************************************//
	
	//************************************** DROP TABLE ***************************************//
	dropTable:function(tableNames) {
		db.transaction(function (tx) { for (var i=0;i<tableNames.length;i++) {
											if(tableNames[i] == "sqlite_sequence") {continue;}
											tx.executeSql('DROP TABLE IF EXISTS ' + tableNames[i] + ';');
											}
									  }, storage.errorCB, storage.init);
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
	insertInTable:function(tableName, dataType, data) {
		switch(dataType) {
			//console data
			case "consoleData":
				var message = data;
				var toStore = '"' + new Date(new Date().getTime()) + '",' +
				              '"' + message + '"';
				
				db.transaction(function (tx) {tx.executeSql('INSERT INTO CONSOLELOG VALUES (null,' + toStore + ');');
											 }, function (error) { //onError
										   			console.log("Error logging: " + message + " | Details: " + error.code + ", " + error.message);
							   				  					}, storage.successCB);
				return;
			
			//accelerometer data
			case "accelerationData":
				var accelerationData = data;
				var toStore =	'"' + new Date(accelerationData.timestamp) + '",' +
								'"' + accelerationData.x          + '",' +
								'"' + accelerationData.y          + '",' +
								'"' + accelerationData.z          + '"';
				break;

			//compass data
			case "compassData":
				var compassHeading = data;
				var toStore = 	'"' + new Date(compassHeading.timestamp)  + '",' +               
								'"' + compassHeading.magneticHeading      + '",' + 
								'"' + compassHeading.trueHeading    	  + '",' + 
								'"' + compassHeading.headingAccuracy      + '"';
				break;

			//gyroscope data
			case "gyroData":
				var gyroData = data;
				var toStore = 	'"' + new Date(gyroData.timestamp) 	+ '",' +               
								'"' + gyroData.alpha    	+ '",' +
								'"' + gyroData.beta     	+ '",' +
								'"' + gyroData.gamma    	+ '"';
				break;
							
			//geolocation data
			case "geolocationData":
				var position = data;
				var toStore =	'"' + new Date(position.timestamp)      + '",' +
								'"' + position.coords.latitude          + '",' +
								'"' + position.coords.longitude         + '",' +
								'"' + position.coords.altitude          + '",' +
								'"' + position.coords.accuracy          + '",' +
								'"' + position.coords.altitudeAccuracy  + '",' +
								'"' + position.coords.heading           + '",' +
								'"' + position.coords.speed             + '"';
				break;
			
			default: console.log("Error: Could not format data for storage!");
		}
							
		db.transaction(function (tx){
	  					 tx.executeSql('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "' + tableName + '";', [], function (tx, results) {
							  var columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');
							  //console.log(columnParts);
							  
							  //----- INSERT data into table, if we have the correct number of measurements
							  if (data.length == columnParts.length-1) {
							  	db.transaction(function (tx) {
										tx.executeSql('INSERT INTO ' + tableName + ' VALUES (null,' + toStore + ');');
								}, storage.errorCB, storage.successCB);
							  }
							  //----- END
							  
						}, storage.errorCB);
		}, storage.errorCB, storage.successCB);
	},
	//****************************** END INSERT DATA INTO TABLES ******************************//
	
	//************************ RETRIEVING TABLES AND LENGTHS FROM DB **************************//	
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
	
	queryCounter: 0,
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
									 }, storage.errorCB);
						   }, storage.errorCB, storage.getDBTableLengths);	
	}
	//********************** END RETRIEVING TABLES AND LENGTHS FROM DB ************************//		
}