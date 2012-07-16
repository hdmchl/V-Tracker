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
		storage.ready = true;
		console.log("Database opened. Storage initiated. Storage ready: " + storage.ready);
	},
	//******************************** END INITIALISE STORAGE *********************************//
	
	//************************************** RESET TABLES *************************************//
	reset:function() {
		storage.dropTable(storage.dbTables); //drop all tables we know about at this stage
		console.log("Database tables reset.");
	},
	//************************************ END RESET TABLES ***********************************//
	
	//************************************* CREATE TABLE **************************************//
	createTable:function(tableFieldsAry, tableName) {
		//Specify schema for table based on the fields array
		var tableFields = "id integer primary key autoincrement";
		
		for (var i in tableFieldsAry) {
			tableFields = tableFields + "," + i;
		}
		
		//create table
		db.transaction(function (tx) {
					   tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + tableFields + ');');
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
						   }, storage.errorCB, function(){storage.ready = true;});

		storage.getDBTables();
	},
	//************************************ END DROP TABLE *************************************//
	
	//******************************** INSERT DATA INTO TABLES ********************************//
	insertIntoTable:function(tableName, data) {	
		db.transaction(function (tx) {tx.executeSql('INSERT INTO ' + tableName + ' VALUES (null,' + data + ');');
									 }, storage.errorCB, storage.successCB);				
	},
	//****************************** END INSERT DATA INTO TABLES ******************************//
	
	//************************************ ERROR HANDLING *************************************//
	errorCB:function(error) {
	    console.log("Error processing SQL: " + error.code + " | " + error.message);
	},
	
	successCB:function(toStore) {
		//console.log("SQL processed successfully!");
	},
	//********************************** END ERROR HANDLING ***********************************//
	
	//*********************************** GET TABLE COLUMNS ***********************************//
	getTableColumns:function(tableName) {
		var columnParts = null;
		db.transaction(function (tx){
	  					 tx.executeSql('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "' + tableName + '";', [], function (tx, results) {
							  columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');
							  console.log(columnParts);
							  //if necessary, do more stuff here...
						}, storage.errorCB);
		}, storage.errorCB, storage.successCB);
	},
	//********************************* END GET TABLE COLUMNS *********************************//
	
	//******************************** GET LIST OF TABLES IN DB *******************************//	
	dbTables: [], //declare array of database tables

	getDBTables:function() {
		storage.dbTables = []; //clear array

		// get a list of all the available tables and load into the dbTables array - when completed, getTableLengths
		db.transaction(function (tx) {
					   tx.executeSql('SELECT * FROM sqlite_master WHERE type=\'table\'', [], function (tx, results) {
							   				 if (results.rows.length != 0) {
							   				 	for (var i=1; i<results.rows.length; i++) {storage.dbTables[i-1] = results.rows.item(i).name;}
							   				 }
									 }, storage.errorCB);
					   }, storage.errorCB, function() {console.log("dbTables was updated: " + storage.dbTables)});
	},
	//****************************** END GET LIST OF TABLES IN DB *****************************//
	
	//******************************* GET LENGTH OF TABLES IN DB ******************************//
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
	//***************************** END GET LENGTH OF TABLES IN DB ****************************//		
}