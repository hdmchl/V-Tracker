/* constructors.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

function alertsObj(name) {
	if (name == null) {return false;} //make sure they name the object
	
	this.name = name;
	this.data = {	timestamp: [],
					message: [] };
					
	this.displayInDiv = false;
	this.displayDiv = null;
	
	this.add = function(message) {
		this.data.timestamp.push(new Date(new Date().getTime()));
		this.data.message.push(message);
		
		//store message
		var toStore = '"' + new Date(new Date().getTime()) 	+ '",' +
				      '"' + message 						+ '"';
		storage.insertIntoTable(this.name,toStore); //update SQL
		
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
		storage.dropTable([this.name]);
	}
	
	storage.createTable(this.data,this.name);
}