/* notifications.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//********************************** DEMO NOTIFICATIONS ***********************************//
var notifications = {
	init:function(){
		//do something
	},
	
	// alert dialog dismissed
 	alertDismissed:function() {
		//do something
	},
	
	// Show a custom alert
	showAlert:function(title, message, buttonName) {
		navigator.notification.alert(message,notifications.alertDismissed(),title,buttonName);
	},
	
	// Beep 
	playBeep:function() {
		navigator.notification.beep(1); //iOS will ignore the beep number
	},

	// Vibrate
	vibrate:function(duration) {
		navigator.notification.vibrate(duration); //iOS will ignore duration value
	},
	
	// This will fire based on the time provided
	// Something to note is that the iPhone goes off of 24hr time it defaults to no timezone adjustment so +0000 !IMPORTANT
	localScheduledAlert:function(hh,mm,ss){
		var d = new Date();
			d = d.setSeconds(ss);
			d = new Date(d);
			d = d.setMinutes(mm);
			d = new Date(d);
			d = d.setHours(hh);
			d = new Date(d);
		
		//make the notification
		plugins.localNotification.add({
			date: d,
			repeat:'daily',
			message: 'This went off just as expected!',
			hasAction: true,
			badge: 1,
			id: '1',
			sound:'horn.caf',
			background:'app.background()',
			foreground:'app.running()'
		});
	},
	
	localTimedAlert:function(ms){
		// Now lets make a new date
		var d = new Date();
		d = d.getTime() + ms; //milliseconds from now
		d = new Date(d);
		
		//make the notification
		plugins.localNotification.add({
			date: d,
			repeat:'daily',
			message: 'This went off just as expected!',
			hasAction: true,
			badge: 1,
			id: '1',
			sound:'horn.caf',
			background:'app.background()',
			foreground:'app.running()'
		});
	},
	
	clear:function(){
		plugins.localNotification.cancelAll();
	},
}
//******************************** END DEMO NOTIFICATIONS *********************************//