var db = null;

function storage_init() {
	db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
	console.log("Database opened!");
	
	db.transaction(clear, storage_errorCB, storage_successCB);
}

function clear(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO;');
	tx.executeSql('DROP TABLE IF EXISTS GEOLOCATION;');
	
	tx.executeSql('CREATE TABLE IF NOT EXISTS GEOLOCATION (id unique, Latitude, Longitude, Altitude, Accuracy, AltitudeAccuracy, Heading, Speed, Timestamp);');
}

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

var rowIdCounter = 0;
function populateGeoLocationTable(tx) {
	//console.log(geoLocation_position);
	
	tx.executeSql('INSERT INTO GEOLOCATION VALUES (' + rowIdCounter + ',' + geoLocation_position + ');');
	rowIdCounter++;
}

function storage_errorCB(error) {
    console.log("Error processing SQL: " + error.code + ", " + error.message);
}

function storage_successCB() {
    //console.log("SQL processed successfully!");
}


//SHOW DATA
function storage_show() {
	db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
	db.transaction(queryDB, storage_errorCB);
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM GEOLOCATION', [], querySuccess, storage_errorCB);
}

function querySuccess(tx, results) {
	document.getElementById('databases').innerHTML = '';
	
	var len = results.rows.length;
	
	var table = '<p>GEOLOCATION table: ' + len + ' rows found.</p>';
	
	for (var i=0; i<len; i++){
		table = table + '<p>' +     "Row Id = "    + results.rows.item(i).id + '<br />' +
									"Latitude = "  + results.rows.item(i).Latitude + '<br />' +
								    "Longitude = " + results.rows.item(i).Longitude + '</p>';
	}
	 
	document.getElementById('databases').innerHTML = table;
}
