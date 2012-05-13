/* storage.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */
var db = null; //declare database object
var storage = {
	//********************************** INITIALISE STORAGE ***********************************//
	init:function() {
		document.getElementById('databases').innerHTML = '';
		
		db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
		
		//create tables
		db.transaction(function (tx) {
					   tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Timestamp, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS ACCELEROMETER (id unique, Timestamp, AccelerationX, AccelerationY, AccelerationZ);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS COMPASS (id unique, Timestamp, Heading);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS GYROSCOPE (id unique, Timestamp, Alpha, Beta, Gamma);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS CONSOLELOG (id, Timestamp, Message);');
					   }, this.errorCB, this.successCB);
		
		consoleLog("Database opened! Storage Initiated.");
	},
	//******************************** END INITIALISE STORAGE *********************************//
	
	//************************************ RESET DATABASES ************************************//
	reset:function() {
		document.getElementById('databases').innerHTML = '';
		
		db.transaction(function (tx) {
					   //drop existing tables
					   tx.executeSql('DROP TABLE IF EXISTS GEOLOCATION;');
					   tx.executeSql('DROP TABLE IF EXISTS ACCELEROMETER;');
					   tx.executeSql('DROP TABLE IF EXISTS COMPASS;');
					   tx.executeSql('DROP TABLE IF EXISTS GYROSCOPE;');
					   tx.executeSql('DROP TABLE IF EXISTS CONSOLELOG;');
					   
					   //create new ones
					   tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Timestamp, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS ACCELEROMETER (id unique, Timestamp, AccelerationX, AccelerationY, AccelerationZ);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS COMPASS (id unique, Timestamp, Heading);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS GYROSCOPE (id unique, Timestamp, Alpha, Beta, Gamma);');
					   tx.executeSql('CREATE TABLE IF NOT EXISTS CONSOLELOG (id, Timestamp, Message);');
					   }, this.errorCB, this.successCB);
		
		consoleLog("Database tables reset!");
	},
	//********************************** END RESET DATABASES **********************************//
	
	//************************************ ERROR HANDLING *************************************//
	errorCB:function(error) {
	    consoleLog("Error processing SQL: " + error.code + ", " + error.message);
	},
	
	successCB:function() {
	    //consoleLog("SQL processed successfully!");
	},
	//********************************** END ERROR HANDLING ***********************************//
	
	//****************************** RETRIEVING ALL DATA FROM DB ******************************//	
	queryCounter: 0,
	dbTables: [], //declare array of database tables
	
	getDBTables:function() {
		document.getElementById('databases').innerHTML = 'loading...';
		
		document.getElementById('loader').style.visibility = 'visible';
		
		db.transaction(function (tx) {
					   tx.executeSql('SELECT * FROM sqlite_master WHERE type=\'table\'', [], function (tx, results) {
									 for (var i=1; i<results.rows.length; i++) {storage.dbTables[i] = results.rows.item(i).name;}
									 }, this.errorCB);
					   }, this.errorCB, this.getTableLengths);
	},
	
	getTableLengths:function() {
		if (storage.queryCounter == 0) {document.getElementById('databases').innerHTML = '';}
		
		storage.queryCounter++;
		
		if (storage.queryCounter < storage.dbTables.length) {
			//console.log(storage.queryCounter + "/" + storage.dbTables.length + ": " + storage.dbTables[storage.queryCounter]);
			
			if (storage.dbTables[storage.queryCounter] == "__WebKitDatabaseInfoTable__") {
				storage.getTableLengths();
				return;
			}
			
			var tableQuery = 'SELECT * FROM ' + storage.dbTables[storage.queryCounter];
			storage.getTableLengthsQuery(storage.dbTables[storage.queryCounter], tableQuery);
		}
		else {
			document.getElementById('databases').innerHTML = document.getElementById('databases').innerHTML + '<p>finished...</p>';
			document.getElementById('loader').style.visibility = 'hidden';
			storage.queryCounter = 0;
		}
	},
	
	getTableLengthsQuery:function(tableName, tableQuery) {
		db.transaction(function (tx){
						   tx.executeSql(tableQuery, [], function (tx, results) {
									 	var buffer = '<p>' + tableName + ' length: ' + results.rows.length + '</p>';
										document.getElementById('databases').innerHTML = document.getElementById('databases').innerHTML + buffer;
									 }, this.errorCB);
						   }, this.errorCB, this.getTableLengths);	
		return contents;	
	}
	//**************************** END RETRIEVING ALL DATA FROM DB ******************************//
}
	
//******************************** INSERT DATA INTO TABLES ********************************//
var rowIdCounter = {
	consoleLogTable: 0,
	accelerometerTable: 0,
	compassTable: 0,
	gyroscopeTable: 0,
	geolocationTable: 0
}

var updateTable = {
	//console log table
	consoleLog:function(message) {
		var toStore = '"' + Date(new Date().getTime()) + '",' + '"' + message + '"';
		
		db.transaction(function (tx) {
									tx.executeSql('INSERT INTO CONSOLELOG VALUES (' + rowIdCounter.consoleLogTable + ',' + toStore + ');');
									rowIdCounter.consoleLogTable++;
									}, function (error) {
								   			console.log("Log Error for: " + message + " | Details: " + error.code + ", " + error.message);
								   						}, function () {
																	   console.log(message);
																	   });
	},
	
	//accelerometer table
	accelerometer:function(acceleration) {
		var toStore =	'"' + new Date(acceleration.timestamp) + '",' +
						'"' + acceleration.x          + '",' +
						'"' + acceleration.y          + '",' +
						'"' + acceleration.z          + '"';
		
		db.transaction(function (tx) {
									tx.executeSql('INSERT INTO ACCELEROMETER VALUES (' + rowIdCounter.accelerometerTable + ',' + toStore + ');');
									rowIdCounter.accelerometerTable++;
									}, storage.errorCB, storage.successCB);
	},
	
	//compass table
	compass:function(heading) {
		var toStore = 	'"' + Date(new Date().getTime())  + '",' +               
						'"' + heading.magneticHeading     + '"';
		
		db.transaction(function (tx) {
									tx.executeSql('INSERT INTO COMPASS VALUES (' + rowIdCounter.compassTable + ',' + toStore + ');');
									rowIdCounter.compassTable++;
									}, storage.errorCB, storage.successCB);
	},
	
	//gyroscope table
	gyroscope:function(orientation) {
		var toStore = 	'"' + Date(new Date().getTime())  	+ '",' +               
						'"' + orientation.alpha    + '",' +
						'"' + orientation.beta     + '",' +
						'"' + orientation.gamma    + '"';
						
		
		db.transaction(function (tx) {
									tx.executeSql('INSERT INTO GYROSCOPE VALUES (' + rowIdCounter.gyroscopeTable + ',' + toStore + ');');
									rowIdCounter.gyroscopeTable++;
									}, storage.errorCB, storage.successCB);
	},
	
	//geolocation table
	geoLocation:function(position) {	
		var toStore =	'"' + new Date(position.timestamp)       + '",' +
						'"' + position.coords.latitude          + '",' +
						'"' + position.coords.longitude         + '",' +
						'"' + position.coords.altitude          + '",' +
						'"' + position.coords.accuracy          + '",' +
						'"' + position.coords.altitudeAccuracy  + '",' +
						'"' + position.coords.heading           + '",' +
						'"' + position.coords.speed             + '"';
	
		db.transaction(function (tx) {
									tx.executeSql('INSERT INTO GEOLOCATION VALUES (' + rowIdCounter.geolocationTable + ',' + toStore + ');');
									rowIdCounter.geolocationTable++;
									}, storage.errorCB, storage.successCB);
	}
}
//****************************** END INSERT DATA INTO TABLES ******************************//