/* storage.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//********************************** INITIALISE STORAGE ***********************************//
var db = null; //declare the database

function storage_init() {
	document.getElementById('databases').innerHTML = '';
	db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
	consoleLog("Database opened! Storage Initiated.");
	
	//create tables
	db.transaction(function (tx) {
				   tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Timestamp, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed);');
				   tx.executeSql('CREATE TABLE IF NOT EXISTS ACCELEROMETER (id unique, Timestamp, AccelerationX, AccelerationY, AccelerationZ);');
				   tx.executeSql('CREATE TABLE IF NOT EXISTS COMPASS (id unique, Timestamp, Heading);');
				   tx.executeSql('CREATE TABLE IF NOT EXISTS CONSOLELOG (id, Timestamp, Message);');
				   }, storage_errorCB, storage_successCB);
}
//******************************** END INITIALISE STORAGE *********************************//

//************************************ RESET DATABASES ************************************//
function storage_clear() {
	document.getElementById('databases').innerHTML = '';
	db.transaction(function (tx) {
				   //drop existing tables
				   tx.executeSql('DROP TABLE IF EXISTS GEOLOCATION;');
				   tx.executeSql('DROP TABLE IF EXISTS ACCELEROMETER;');
				   tx.executeSql('DROP TABLE IF EXISTS COMPASS;');
				   tx.executeSql('DROP TABLE IF EXISTS CONSOLELOG;');
				   
				   //create new ones
				   tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Timestamp, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed);');
				   tx.executeSql('CREATE TABLE IF NOT EXISTS ACCELEROMETER (id unique, Timestamp, AccelerationX, AccelerationY, AccelerationZ);');
				   tx.executeSql('CREATE TABLE IF NOT EXISTS COMPASS (id unique, Timestamp, Heading);');
				   tx.executeSql('CREATE TABLE IF NOT EXISTS CONSOLELOG (id, Timestamp, Message);');
				   }, storage_errorCB, storage_successCB);
	
	consoleLog("Database tables reset!");
}
//********************************** END RESET DATABASES **********************************//

//******************************** INSERT DATA INTO TABLES ********************************//
//ConsoleLog Table
var consoleLog_message = '';
function updateConsoleLogTable(message) {
	consoleLog_message = '"' + Date(new Date().getTime()) + '",' + '"' + message + '"';
	
	db.transaction(populateConsoleLogTable, function (error) {
				   console.log("Log Error for: " + message + " | Details: " + error.code + ", " + error.message);
				   }, function () {
				   console.log(message);
				   });
}

var consoleLogTable_rowIdCounter = 0;
function populateConsoleLogTable(tx) {
	tx.executeSql('INSERT INTO CONSOLELOG VALUES (' + consoleLogTable_rowIdCounter + ',' + consoleLog_message + ');');
	consoleLogTable_rowIdCounter++;
}

//Accelerometer Table
var accelerometer_acceleration = '';
function updateAccelerometerTable(acceleration) {
	accelerometer_acceleration =
	'"' + new Date(acceleration.timestamp) + '",' +
	'"' + acceleration.x          + '",' +
	'"' + acceleration.y          + '",' +
	'"' + acceleration.z          + '"';
	
	db.transaction(populateAccelerometerTable, storage_errorCB, storage_successCB);
}

var accelerometerTable_rowIdCounter = 0;
function populateAccelerometerTable(tx) {
	tx.executeSql('INSERT INTO ACCELEROMETER VALUES (' + accelerometerTable_rowIdCounter + ',' + accelerometer_acceleration + ');');
	accelerometerTable_rowIdCounter++;
}

//Compass Table
var compass_heading = '';
function updateCompassTable(heading) {
	compass_heading = 
	'"' + Date(new Date().getTime())  + '",' +               
	'"' + heading.magneticHeading     + '"';
	
	db.transaction(populateCompassTable, storage_errorCB, storage_successCB);
}

var compassTable_rowIdCounter = 0;
function populateCompassTable(tx) {
	tx.executeSql('INSERT INTO COMPASS VALUES (' + compassTable_rowIdCounter + ',' + compass_heading + ');');
	compassTable_rowIdCounter++;
}

//GeoLocation Table
var geoLocation_position = '';
function updateGeoLocationTable(position) {	
	geoLocation_position =
	                '"' + new Date(position.timestamp)       + '",' +
					'"' + position.coords.latitude          + '",' +
					'"' + position.coords.longitude         + '",' +
					'"' + position.coords.altitude          + '",' +
					'"' + position.coords.accuracy          + '",' +
					'"' + position.coords.altitudeAccuracy  + '",' +
					'"' + position.coords.heading           + '",' +
					'"' + position.coords.speed             + '"';

	db.transaction(populateGeoLocationTable, storage_errorCB, storage_successCB);
}

var geoLocationTable_rowIdCounter = 0;
function populateGeoLocationTable(tx) {
	tx.executeSql('INSERT INTO GEOLOCATION VALUES (' + geoLocationTable_rowIdCounter + ',' + geoLocation_position + ');');
	geoLocationTable_rowIdCounter++;
}
//****************************** END INSERT DATA INTO TABLES ******************************//

//************************************ ERROR HANDLING *************************************//
function storage_errorCB(error) {
    consoleLog("Error processing SQL: " + error.code + ", " + error.message);
}

function storage_successCB() {
    //consoleLog("SQL processed successfully!");
}
//********************************** END ERROR HANDLING ***********************************//

//******************************** RETRIEVING DATA FROM DB ********************************//
var dbTables = [];
function storage_show() {
	document.getElementById('databases').innerHTML = '';
	
	db.transaction(function (tx) {
				   tx.executeSql('SELECT * FROM sqlite_master WHERE type=\'table\'', [], function (tx, results) {
								 for (var i=1; i<results.rows.length; i++) {dbTables[i] = results.rows.item(i).name;}
								 }, storage_errorCB);
				   }, storage_errorCB, queryDB);
}

var qc = 0;
function queryDB() {
	qc++;
	
	if (qc < dbTables.length) {
		var tableQuery = 'SELECT * FROM ' + dbTables[qc];
		
		//consoleLog(tableQuery);
		
		db.transaction(function (tx){
					   tx.executeSql(tableQuery, [], displayQueryResults, storage_errorCB);
					   }, storage_errorCB, queryDB);		
	}
	else {
		qc = 0;
	}
}

function displayQueryResults(tx, results) {	
	var buffer = '<p>' + dbTables[qc] + ' length: ' + results.rows.length + '</p>';
	
	document.getElementById('databases').innerHTML = document.getElementById('databases').innerHTML + buffer;
}
//****************************** END RETRIEVING DATA FROM DB ********************************//
