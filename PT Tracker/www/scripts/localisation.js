/* localisation.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */
var localisation = {
	readyFlag: false,
	
	stationNames: [],
	stationLongitudes: [],
	stationLatitudes: [],
	
	currentNearestStation: null,
	
	//******************************** RETRIEVING DATA FROM DB ********************************//
	init:function() {
		//load localisation database into arrays
		db.transaction(function (tx) {tx.executeSql('SELECT * FROM train_locations', [], localisation.stationsSQLSelected, storage.errorCB)},storage.errorCB);
	},

	stationsSQLSelected:function(tx, results) {	
		var len = results.rows.length;
		
		for (var i=0; i<len; i++) {
			localisation.stationNames[i] = results.rows.item(i).location_name;
			localisation.stationLongitudes[i] = results.rows.item(i).longitude;
			localisation.stationLatitudes[i] = results.rows.item(i).latitude;
		}
		
		consoleLog("Number of train stations loaded: " + len);
		localisation.readyFlag = true;
		
		document.getElementById('localisation').innerHTML = 'ready...';
		
	},				   
	//****************************** END RETRIEVING DATA FROM DB ********************************//
	
	findNearestStation:function() {
		if(!this.readyFlag) {
			document.getElementById('localisation').innerHTML = 'must initialise first';
			//could include code here to automatically initialise: this.init();
		} else {
			if (geolocationObj.data.longitude == null || geolocationObj.data.latitude == null){
				document.getElementById('localisation').innerHTML = 'must start watching geolocation';
			} else {
				var userDist = -1;
			
				for (i=0;i<this.stationNames.length;i++) {
					var a = geolocationObj.data.longitude - this.stationLongitudes[i];
					var b = geolocationObj.data.latitude - this.stationLatitudes[i];
					
					var distanceToStation = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
					
					if (distanceToStation <= userDist || userDist == -1){
						userDist = distanceToStation;
						this.userStation = this.stationNames[i];
					}
				}
				
				document.getElementById('localisation').innerHTML = "Your nearest station is: " + this.userStation;
			}
		}	
	}
}