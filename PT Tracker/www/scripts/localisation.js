/* localisation.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */
var localisation = {
	readyFlag: false,
	
	userLongitude: null,
	userLatitude: null,
	
	stationNames: [],
	stationLongitudes: [],
	stationLatitudes: [],
	
	userStation: null,
	
	//******************************** RETRIEVING DATA FROM DB ********************************//
	init:function() {
		//load localisation data
		db.transaction(function (tx) {tx.executeSql('SELECT * FROM train_locations', [], localisation.stationsSQLSelected, storage.errorCB)},storage.errorCB);
		
		document.getElementById('localisation').innerHTML = 'ready...';
	},

	stationsSQLSelected:function(tx, results) {	
		var len = results.rows.length;
		
		for (var i=0; i<len; i++) {
			localisation.stationNames[i] = results.rows.item(i).location_name;
			localisation.stationLongitudes[i] = results.rows.item(i).longitude;
			localisation.stationLatitudes[i] = results.rows.item(i).latitude;
		}
		
		consoleLog("Number of stations loaded: " + len);
		localisation.readyFlag = true;
	},				   
	//****************************** END RETRIEVING DATA FROM DB ********************************//
	
	findNearestStation:function() {
		if(!localisation.readyFlag) {
			document.getElementById('localisation').innerHTML = 'must initialise';
			//could include code here to automatically initialise: localisation.init();
		} else {
			if (localisation.userLongitude == null || !localisation.userLatitude == null){
				document.getElementById('localisation').innerHTML = 'must watch geolocation';
			} else {
				var userDist = -1;
			
				for (i=0;i<localisation.stationNames.length;i++) {
					var a = localisation.userLongitude - localisation.stationLongitudes[i];
					var b = localisation.userLatitude - localisation.stationLatitudes[i];
					
					var distanceToStation = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
					
					if (distanceToStation <= userDist || userDist == -1){
						userDist = distanceToStation;
						localisation.userStation = localisation.stationNames[i];
					}
				}
				
				document.getElementById('localisation').innerHTML = "Your nearest station is: " + localisation.userStation;
			}
		}	
	}
}