/* localisation.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

var localisation_stationNames = [];
var localisation_stationLongitudes = [];
var localisation_stationLatitudes = [];
var localisation_readyFlag = false;

var localisation_userLongitude = 145.116403;
var localisation_userLatitude = -37.927142;
function localisation_setUserLocation(position) {
	localisation_userLongitude = position.coords.longitude;
	localisation_userLatitude = position.coords.latitude;
}

function localisation_findStation() {
	if(localisation_readyFlag) {
		var localisation_userDist = -1;
		var localisation_userStation;
		
		for (i=0;i<localisation_stationNames.length;i++) {
			var a = localisation_userLongitude - localisation_stationLongitudes[i];
			var b = localisation_userLatitude - localisation_stationLatitudes[i];
			
			var localisation_distanceToStation = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
			
			if (localisation_distanceToStation <= localisation_userDist || localisation_userDist == -1){
				localisation_userDist = localisation_distanceToStation;
				localisation_userStation = localisation_stationNames[i];
			}
		}
		
		document.getElementById('localisation').innerHTML = "Your nearest station is: " + localisation_userStation;
	}	
}
				   
//******************************** RETRIEVING DATA FROM DB ********************************//
function localisation_init() {
	//retieve localisation data
	db.transaction(function (tx) {tx.executeSql('SELECT * FROM train_locations', [], localisation_querySuccess, localisation_errorCB)},localisation_errorCB);
	
	document.getElementById('localisation').innerHTML = '';
}

function localisation_querySuccess(tx, results) {	
	var len = results.rows.length;
	
	for (var i=0; i<len; i++){
		localisation_stationNames[i] = results.rows.item(i).location_name;
		localisation_stationLongitudes[i] = results.rows.item(i).longitude;
		localisation_stationLatitudes[i] = results.rows.item(i).latitude;
	}
	
	consoleLog("Number of stations loaded: " + len);
	localisation_readyFlag = true;
}				   
//****************************** END RETRIEVING DATA FROM DB ********************************//

//************************************ ERROR HANDLING *************************************//
function localisation_errorCB(error) {
	console.log("Error processing SQL: " + error.code + ", " + error.message);
}
//********************************** END ERROR HANDLING ***********************************//