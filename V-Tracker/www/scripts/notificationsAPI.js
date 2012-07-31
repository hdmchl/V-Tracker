/* notifications.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//************************************* notification **************************************//
//constructor for notification objects
function notificationObj() {
	this.alert = function(title,message,buttonText) {
		navigator.notification.alert(message,notificationsAPI.alertDismissed(),title,buttonText);
	}
	
	this.confirm = function(message, confirmCallback, title, buttonLabels) {
		navigator.notification.confirm(message, confirmCallback, title, buttonLabels)
	}
	
	this.beep = function(duration) {
		navigator.notification.beep(duration); //iOS will ignore the beep number/duration
	}
	
	this.vibrate = function(duration) {
		navigator.notification.vibrate(duration); //iOS will ignore duration value
	}
	
	// This will fire based on the time provided
	// Something to note is that the iPhone goes off of 24hr time it defaults to no timezone adjustment so +0000 !IMPORTANT
	this.pushNot = function(d,message,repeat,hasAction,id) {
		notificationsAPI.badgeCount++;
		
		//make the notification
		plugins.localNotification.add({
			date: d,
			repeat: repeat,
			message: message,
			hasAction: hasAction,
			badge: notificationsAPI.badgeCount,
			id: id,
			sound:'horn.caf',
			background:'app.background()',
			foreground:'app.running()'
		});
	}	
}
//*********************************** END notification ************************************//

//********************************** notificationsAPI *************************************//
var notificationsAPI = {	
	badgeCount: 0,
	
	// alert dialog dismissed
 	alertDismissed:function() {
		//do something
	},
	
	getTime:function(hh,mm,ss) {
		var d = new Date();
			d = d.setSeconds(ss);
			d = new Date(d);
			d = d.setMinutes(mm);
			d = new Date(d);
			d = d.setHours(hh);
			d = new Date(d);
		return d;
	},
	
	getTimeAfter:function(ms) {
		var d = new Date();
		d = d.getTime() + ms; //milliseconds from now
		d = new Date(d);
		return d;
	},
	
	clearAll:function() {
		plugins.localNotification.cancelAll();
		console.log('All notifications cancelled')
	}
}
//******************************** END notificationsAPI ***********************************//