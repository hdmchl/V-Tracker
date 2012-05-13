/* notifications.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

//********************************** DEMO NOTIFICATIONS ***********************************//
// alert dialog dismissed
function notifications_alertDismissed() {
	//do something
}

// Show a custom alert
function notifications_showAlert() {
	navigator.notification.alert(
								 'You are the winner!',  // message
								 notifications_alertDismissed,         // callback
								 'Game Over',            // title
								 'Done'                  // buttonName
								 );
}

function notifications_test() {
	var d = new Date();
	d = d.getTime() + 3*1000; //60 seconds from now
	d = new Date(d);
	plugins.localNotification.add({
								  date: d,
								  repeat:'daily',
								  message: 'This just fired after a minute!',
								  hasAction: true,
								  badge: 1,
								  id: '123',
								  sound:'horn.caf',
								  background:'app.background()',
								  foreground:'app.running()'
								  });
}

// Beep 
function notifications_playBeep() {
	navigator.notification.beep(1); //iOS will ignore the beep number
}

// Vibrate
function notifications_vibrate() {
	navigator.notification.vibrate(3000); //3 seconds vibration
}
//******************************** END DEMO NOTIFICATIONS *********************************//