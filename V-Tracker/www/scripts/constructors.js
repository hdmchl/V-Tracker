/* constructors.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//*************************************** alertsObj ***************************************//
function alertsObj(name) {
	if (name == null) {throw "you must give the object a name";} //make sure they name the object
	
	//declare the object's properties
	this.name = name;
	this.data = {	timestamp: [],
					message: [] };
					
	this.displayInDiv = false;
	this.displayDiv = null;
	
	//declare the object's methods
	this.add = function(message) {
		this.data.timestamp.push(new Date(new Date().getTime()));
		this.data.message.push(message);
		
		//store message
		var toStore = '"' + new Date(new Date().getTime()) 	+ '",' +
				      '"' + message 						+ '"';
		storageAPI.insertIntoTable(this.name,toStore); //update SQL
		
		//if progress window is open, then display latest alerts in window
		if(this.displayInDiv) {
			$(this.displayDiv).empty();
			for(i=10;i>0;i--) {
				if (i > this.data.message.length) {continue;}
				$(this.displayDiv).append(this.data.message.length-i + ") " + this.data.message[this.data.message.length-i] + "<br />");
			}
		}
		
		console.log(message); //display message in output console
	};
	
	this.drop = function() {
		storageAPI.dropTable([this.name]);
	};
	
	//execute object's initialisation actions
	storageAPI.createTable(this.data,this.name);
}
//************************************* END alertsObj *************************************//

//*********************************** dataCollectionObj ***********************************//
function dataCollectionObj(name) {
	if (name == null) {throw "you must give the object a name";} //make sure they name the object

	//declare the object's properties
	this.name = name;
	
	var geolocationDBname = this.name + "_GEO";
	var compassDBname = this.name + "_COM";
	var accelerometerDBname = this.name + "_ACC";
	var gyroscopeDBname = this.name + "_GYR";
	
	//declare the object's methods
	this.geolocationSuccess = function(data) {
		var toStore = geolocationAPI.formatDataForSQL(data);
		storageAPI.insertIntoTable(geolocationDBname,toStore);
	};
	
	this.compassSuccess = function(data) {
		var toStore = compassAPI.formatDataForSQL(data);
		storageAPI.insertIntoTable(compassDBname,toStore);
	};
	
	this.accelerometerSuccess = function(data) {
		var toStore = accelerometerAPI.formatDataForSQL(data);
		storageAPI.insertIntoTable(accelerometerDBname,toStore);
	};
	
	this.gyroSuccess = function(data) {
		var toStore = gyroscopeAPI.formatDataForSQL(data);
		storageAPI.insertIntoTable(gyroscopeDBname,toStore);
	};
	
	this.get = function(){
		geolocationAPI.get();
		compassAPI.startWatching();
		accelerometerAPI.startWatching();
		gyroscopeAPI.startWatching();
	}
	
	//execute object's initialisation actions
	geolocationAPI.successCBs.push(this.geolocationSuccess);
	storageAPI.createTable(geolocationAPI.data,geolocationDBname)
	
	compassAPI.successCBs.push(this.compassSuccess);
	storageAPI.createTable(compassAPI.data,compassDBname);
	
	accelerometerAPI.successCBs.push(this.accelerometerSuccess);
	storageAPI.createTable(accelerometerAPI.data,accelerometerDBname);
	
	gyroscopeAPI.successCBs.push(this.gyroSuccess);
	storageAPI.createTable(gyroscopeAPI.data,gyroscopeDBname);
}
//********************************* END dataCollectionObj *********************************//

//***************************************** route *****************************************//
function route(name) {
	if (name == null) {throw "you must give the object a name";} //make sure they name the object
	
	//declare the object's properties
	this.name = name;
}
//*************************************** END route ***************************************//