/* storageAPI.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var db = null; //declare a global database object

var storageAPI = {
	ready: false, //status flag
	
	//********************************** INITIALISE STORAGE ***********************************//
	init:function(database_name, database_version, database_displayname, database_size) {
		//open a database, create it if it doesn't exist - don't need a constructor, because I 
		//   shouldn't be using more than one db
		db = window.openDatabase(database_name, database_version, database_displayname, database_size);
		
		storageAPI.getDBTables();
		storageAPI.ready = true;
		console.log("Database opened. Storage initiated. Storage ready: " + storageAPI.ready);
	},
	//******************************** END INITIALISE STORAGE *********************************//
	
	//************************************** LOCALSTORAGE *************************************//
	localStore: {
		setItem:function(key, value) {
			window.localStorage.setItem(key, value);
		},
		
		getItem:function(key) {
			return window.localStorage.getItem(key);
		},
		
		setObject:function(key, objToStore) {
			//we can only store the object's properties - not functions
			//to do that, we convert the properties into a JSON object
			window.localStorage.setItem(key, JSON.stringify(objToStore));
		},
		
		getObject:function(key) {
			//we can only restore the object's properties - not functions
			return JSON.parse(window.localStorage.getItem(key));
		},
		
		getAllKeys:function(){
			var allKeys = [];
			for (var i=0;i<window.localStorage.length;i++) {
				allKeys.push(window.localStorage.key(i));
			}
			return allKeys;
		},
		
		removeItem:function(key) {
			window.localStorage.removeItem(key);
		},
		
		clearAll:function() {
			window.localStorage.clear()
		},
	},
	//************************************ END LOCALSTORAGE ***********************************//
	
	//************************************** RESET TABLES *************************************//
	reset:function() {
		storageAPI.dropTable(storageAPI.dbTables); //drop all tables we know about at this stage
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
					   }, storageAPI.errorCB, storageAPI.successCB);
		
		storageAPI.getDBTables();
	},
	
	//*********************************** END CREATE TABLE ************************************//
	
	//************************************** DROP TABLE ***************************************//
	dropTable:function(tableNamesAry) {
		db.transaction(function (tx) { for (var i=0;i<tableNamesAry.length;i++) {
						   if(tableNamesAry[i] == "sqlite_sequence") {continue;}
						   tx.executeSql('DROP TABLE IF EXISTS ' + tableNamesAry[i] + ';');
						   }
						   }, storageAPI.errorCB, function(){storageAPI.ready = true;});

		storageAPI.getDBTables();
	},
	//************************************ END DROP TABLE *************************************//
	
	//******************************** INSERT DATA INTO TABLES ********************************//
	insertIntoTable:function(tableName, data) {
		db.transaction(function (tx) {tx.executeSql('INSERT INTO ' + tableName + ' VALUES (null,' + data + ');');
									 }, storageAPI.errorCB, storageAPI.successCB);				
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
						}, storageAPI.errorCB);
		}, storageAPI.errorCB, storageAPI.successCB);
	},
	//********************************* END GET TABLE COLUMNS *********************************//
	
	//******************************** GET LIST OF TABLES IN DB *******************************//	
	dbTables: [], //declare array of database tables

	getDBTables:function() {
		storageAPI.dbTables = []; //clear array

		// get a list of all the available tables and load into the dbTables array - when completed, getTableLengths
		db.transaction(function (tx) {
					   tx.executeSql('SELECT * FROM sqlite_master WHERE type=\'table\'', [], function (tx, results) {
							   				 if (results.rows.length != 0) {
							   				 	for (var i=1; i<results.rows.length; i++) {storageAPI.dbTables[i-1] = results.rows.item(i).name;}
							   				 }
									 }, storageAPI.errorCB);
					   }, storageAPI.errorCB, function() {console.log("detDBTables() returned: " + storageAPI.dbTables)});
	},
	//****************************** END GET LIST OF TABLES IN DB *****************************//		
}