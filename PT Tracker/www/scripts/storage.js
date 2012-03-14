function storage_init() {
	var db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
	
	db.transaction(populateDB, errorCB, successCB);
	
	db.transaction(queryDB, errorCB);
}

function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    alert("success!");
}

function storage_show() {
	var db = window.openDatabase("PTTracker_db", "1.00", "PT Tracker DB", 2 * 1024*1024); //create a 2MBs database
	db.transaction(queryDB, errorCB);
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
	document.getElementById('databases').innerHTML = '';
	
	var len = results.rows.length;
	
	var table = '<p>DEMO table: ' + len + ' rows found.</p><p>';
	
	for (var i=0; i<len; i++){
		table = table + '<br>' + "Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data;
	}
	
	table = table + '</p>';
	 
	document.getElementById('databases').innerHTML = table;
	
	//alert(results.rows.item(0).id + "," + results.rows.item(0).data);
}
