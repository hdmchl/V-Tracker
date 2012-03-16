var db = null;

function storage_init() {
	db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
	consoleLog("Database opened!");
}

function storage_clear() {
	db.transaction(clear, storage_errorCB, storage_successCB);
	consoleLog("Database tables cleared!");
}

function clear(tx) {
	//drop existing tables
	tx.executeSql('DROP TABLE IF EXISTS GEOLOCATION;');
	tx.executeSql('DROP TABLE IF EXISTS ACCELEROMETER;');
	
	//create new ones
	tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed, Timestamp);');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ACCELEROMETER (id unique, AccelerationX, AccelerationY, AccelerationZ, Timestamp);');
}

//Accelerometer Table
var accelerometer_acceleration = '';
function updateAccelerometerTable(acceleration) {
	
	accelerometer_acceleration =
	'"' + acceleration.x          + '",' +
	'"' + acceleration.y          + '",' +
	'"' + acceleration.z          + '",' +
	'"' + new Date(acceleration.timestamp)      + '"';
	
	db.transaction(populateAccelerometerTable, storage_errorCB, storage_successCB);
}

var accelerometerTable_rowIdCounter = 0;
function populateAccelerometerTable(tx) {
	tx.executeSql('INSERT INTO ACCELEROMETER VALUES (' + accelerometerTable_rowIdCounter + ',' + accelerometer_acceleration + ');');
	accelerometerTable_rowIdCounter++;
}

//GeoLocation Table
var geoLocation_position = '';
function updateGeoLocationTable(position) {
	
	geoLocation_position =
					'"' + position.coords.latitude          + '",' +
					'"' + position.coords.longitude         + '",' +
					'"' + position.coords.altitude          + '",' +
					'"' + position.coords.accuracy          + '",' +
					'"' + position.coords.altitudeAccuracy  + '",' +
					'"' + position.coords.heading           + '",' +
					'"' + position.coords.speed             + '",' +
					'"' + new Date(position.timestamp)      + '"';

	db.transaction(populateGeoLocationTable, storage_errorCB, storage_successCB);
}

var geoLocationTable_rowIdCounter = 0;
function populateGeoLocationTable(tx) {
	tx.executeSql('INSERT INTO GEOLOCATION VALUES (' + geoLocationTable_rowIdCounter + ',' + geoLocation_position + ');');
	geoLocationTable_rowIdCounter++;
}

//******** ERROR HANDLING ********
function storage_errorCB(error) {
    consoleLog("Error processing SQL: " + error.code + ", " + error.message);
}

function storage_successCB() {
    consoleLog("SQL processed successfully!");
}

//******** RETRIEVING DATA FROM DB ********
function storage_show() {
	db.transaction(queryDB, storage_errorCB);
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM GEOLOCATION', [], querySuccess, storage_errorCB);
	tx.executeSql('SELECT * FROM ACCELEROMETER', [], querySuccess, storage_errorCB);
}

function querySuccess(tx, results) {
	document.getElementById('databases').innerHTML = '';
	
	var len = results.rows.length;
	
	var table = '<p>Table length: ' + len + ' rows found.</p>';
	
	for (var i=0; i<len; i++){
		table = table + '<p>' +     "Row Id = "    + results.rows.item(i).id + '<br />' +
									"Acceleration X = "  + results.rows.item(i).AccelerationX + '<br />' +
								    "Longitude = " + results.rows.item(i).Longitude + '</p>';
	}
	 
	document.getElementById('databases').innerHTML = table;
}
