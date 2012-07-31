/* debug.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************* debug methods *************************************//
// these are all the methods used in the debug tab (ie. this is the view controller for debug)
// these methods can be used to collect data accross all sensors, as well as test and debug individual sensors

var debug = {
	liveMonitor: true,
	
	//DATA COLLECTION
	DCinit:function() {
		//select storage for all
		$('#debug-geoStoreFlag').prop("checked", true);
		$('#debug-compassStoreFlag').prop("checked", true);
		$('#debug-accelerometerStoreFlag').prop("checked", true);
		$('#debug-gyroscopeStoreFlag').prop("checked", true);
		$("input[type='checkbox']").prop("checked",true).checkboxradio("refresh"); //refresh visual state
		
		storageAPI.reset();
		
		$('#debug-DC').html("<p>Initialised. Will store all selected data.</p>");
	},
	
	DCcollect:function() {
		debug.liveMonitor = false;
		
		debug.geolocationWatch();
		debug.geolocationClear();
		
		debug.compassWatch();
		debug.compassClear();
		
		debug.accelerometerWatch();
		debug.accelerometerClear();
		
		debug.gyroscopeWatch();
		debug.gyroscopeClear();
		
		$('#debug-DC').html("<p>Started</p>");
	},
	
	DCstop:function() {
		debug.geolocationStop();
		debug.compassStop();
		debug.accelerometerStop();
		debug.gyroscopeStop();
		
		debug.liveMonitor = true;
		$('#debug-DC').html("<p>Stopped</p>");
	},
	//END DATA COLLECTION
	
	//GEOLOCATION
	geolocationWatch:function() {
		var geolocationDBname = "debug" + "_GEO";
		
		//is selected, store the measurements
		if ($('#debug-geoStoreFlag').is(':checked')) {
			storageAPI.createTable(geolocationAPI.data,geolocationDBname);
			
			storeMeasurements = function(data) {
				var toSQL = geolocationAPI.formatDataForSQL(data);
				storageAPI.insertIntoTable(geolocationDBname,toSQL);		
			};
			geolocationAPI.successCBs.push(storeMeasurements);
		}
		
		if (debug.liveMonitor) {
			displayMeasurements = function(data) {
				var toHTML = geolocationAPI.formatDataForHTML(data);		
				$('#debug-geolocation').html(toHTML);
			};
			geolocationAPI.successCBs.push(displayMeasurements);
		}

		geolocationAPI.startWatching();

		$('#debug-geoWatch').addClass("ui-disabled"); //don't allow the user to add more functions to the API
	},
	
	geolocationStop:function() {
		geolocationAPI.successCBs = []; //clear call backs on API
		geolocationAPI.stopWatching();
		$('#debug-geoWatch').removeClass("ui-disabled");
	},
	
	geolocationClear:function() {
		$('#debug-geolocation').empty();
	},
	//END GEOLOCATION
	
	//COMPASS
	compassWatch:function() {
		var compassDBname = "debug" + "_COM";
		
		//is selected, store the measurements
		if ($('#debug-compassStoreFlag').is(':checked')) {
			storageAPI.createTable(compassAPI.data,compassDBname);
			
			storeMeasurements = function(data) {
				var toSQL = compassAPI.formatDataForSQL(data);
				storageAPI.insertIntoTable(compassDBname,toSQL);		
			};
			compassAPI.successCBs.push(storeMeasurements);
		}
		
		if (debug.liveMonitor) {
			displayMeasurements = function(data) {
				var toHTML = compassAPI.formatDataForHTML(data);		
				$('#debug-compass').html(toHTML);
			};
			compassAPI.successCBs.push(displayMeasurements);
		}
		
		compassAPI.startWatching();

		$('#debug-compassWatch').addClass("ui-disabled"); //don't allow the user to add more functions to the API
	},
	
	compassStop:function() {
		compassAPI.successCBs = []; //clear call backs on API
		compassAPI.stopWatching();
		$('#debug-compassWatch').removeClass("ui-disabled");
	},
	
	compassClear:function() {
		$('#debug-compass').empty();
	},
	//END COMPASS
	
	//ACCELEROMETER
	accelerometerWatch:function() {
		var accelerometerDBname = "debug" + "_ACC";
		
		//is selected, store the measurements
		if ($('#debug-accelerometerStoreFlag').is(':checked')) {
			storageAPI.createTable(accelerometerAPI.data,accelerometerDBname);
			
			storeMeasurements = function(data) {
				var toSQL = accelerometerAPI.formatDataForSQL(data);
				storageAPI.insertIntoTable(accelerometerDBname,toSQL);		
			};
			accelerometerAPI.successCBs.push(storeMeasurements);
		}
		
		if (debug.liveMonitor) {
			displayMeasurements = function(data) {
				var toHTML = accelerometerAPI.formatDataForHTML(data);		
				$('#debug-accelerometer').html(toHTML);
			};
			accelerometerAPI.successCBs.push(displayMeasurements);
		}
		
		accelerometerAPI.startWatching();

		$('#debug-accelerometerWatch').addClass("ui-disabled"); //don't allow the user to add more functions to the API
	},
	
	accelerometerStop:function() {
		accelerometerAPI.successCBs = []; //clear call backs on API
		accelerometerAPI.stopWatching();
		$('#debug-accelerometerWatch').removeClass("ui-disabled");
	},
	
	accelerometerClear:function() {
		$('#debug-accelerometer').empty();
	},
	//END ACCELEROMETER	
	
	//GYROSCOPE
	gyroscopeWatch:function() {
		var gyroscopeDBname = "debug" + "_GYR";
		
		//is selected, store the measurements
		if ($('#debug-gyroscopeStoreFlag').is(':checked')) {
			storageAPI.createTable(gyroscopeAPI.data,gyroscopeDBname);
			
			storeMeasurements = function(data) {
				var toSQL = gyroscopeAPI.formatDataForSQL(data);
				storageAPI.insertIntoTable(gyroscopeDBname,toSQL);		
			};
			gyroscopeAPI.successCBs.push(storeMeasurements);
		}
		
		if (debug.liveMonitor) {
			displayMeasurements = function(data) {
				var toHTML = gyroscopeAPI.formatDataForHTML(data);		
				$('#debug-gyroscope').html(toHTML);
			};
			gyroscopeAPI.successCBs.push(displayMeasurements);
		}
		
		gyroscopeAPI.startWatching();

		$('#debug-gyroscopeWatch').addClass("ui-disabled"); //don't allow the user to add more functions to the API
	},
	
	gyroscopeStop:function() {
		gyroscopeAPI.successCBs = []; //clear call backs on API
		gyroscopeAPI.stopWatching();
		$('#debug-gyroscopeWatch').removeClass("ui-disabled");
	},
	
	gyroscopeClear:function() {
		$('#debug-gyroscope').empty();
	},
	//END GYROSCOPE	

	//DB STORAGE
	DBstorageReset:function() {
		storageAPI.reset();
		$('#debug-databases').empty();
		$('#debug-databases').append("<p>DB storage was Reset</p>");
	},
	
	DBstorageQueryCounter: 0,
	DBstorageGetDBTableLengths:function() {
		//if this is the first run, then set the output window
		if (debug.DBstorageQueryCounter == 0) {$('#debug-databases').empty();$('#debug-databases').append('<p>started...</p>');}
		
		if (debug.DBstorageQueryCounter < storageAPI.dbTables.length) {
			//if the next table to be queried is the infoTable, then skip
			if (storageAPI.dbTables[debug.DBstorageQueryCounter] == "__WebKitDatabaseInfoTable__") {
				storageAPI.getDBTableLengths();
				return;
			}
			
			//otherwise, select everything in that table and put in a query for its length...
			var tableQuery = 'SELECT * FROM ' + storageAPI.dbTables[debug.DBstorageQueryCounter];
			debug.DBstorageGetTableLengthsQuery(storageAPI.dbTables[debug.DBstorageQueryCounter], tableQuery);
			debug.DBstorageQueryCounter++;
		}
		else {
			//if we're done, then post 'finished...'
			debug.DBstorageQueryCounter = 0;
			$('#debug-databases').append('<p>finished!</p>');
		}
	},
		
	DBstorageGetTableLengthsQuery:function(tableName, tableQuery) {
		//display the table's length, then call getTableLengths when done
		db.transaction(function (tx){
						   tx.executeSql(tableQuery, [], function (tx, results) {
									 	$('#debug-databases').append('<p>' + tableName + ' length: ' + results.rows.length + '</p>');
									 }, storageAPI.errorCB);
						   }, storageAPI.errorCB, debug.DBstorageGetDBTableLengths);	
	},
	
	DBstorageClear:function() {
		$('#debug-databases').empty();
	},
	//END DB STORAGE
	
	//LOCALSTORAGE
	localStorageReset:function() {
		storageAPI.localStorageAPI.clear();
		$('#debug-localStorage').empty();
		$('#debug-localStorage').append("<p>localStorage was Reset</p>");
	},
	
	localStorageAddItem:function() {
		storageAPI.localStorageAPI.setItem("dummyKey", "dummyValue");
	},
	
	localStorageGetItemKeys:function() {
		$('#debug-localStorage').empty();
		$('#debug-localStorage').append("<p>started...</p>");
		$('#debug-localStorage').append("<p>" + storageAPI.localStorageAPI.getAllItemKeys() + "</p>");
		$('#debug-localStorage').append("<p>finished!</p>");
	},
	
	localStorageClear:function() {
		$('#debug-localStorage').empty();
	},
	//END LOCALSTORAGE
	
	//NOTIFICATIONS
	notificationsShowAlert:function() {
		var noti = new notificationObj();
		noti.alert("title","message","button");
	},
	
	notificationsPlayBeep:function() {
		var noti = new notificationObj();
		noti.beep(1);
	},
	
	notificationsVibrate:function() {
		var noti = new notificationObj();
		noti.vibrate(1);
	},
	
	notificationsNotifyIn5:function() {
		var noti = new notificationObj();
		noti.pushNot(notificationsAPI.getTimeAfter(5000),"Look ma! A Notification","",false,"demo");
	},
	
	notificationsClearAll:function() {
		notificationsAPI.clearAll();
	},
	//END NOTIFICATIONS
}
//*********************************** END debug methods ***********************************//
