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

// Beep 
function notifications_playBeep() {
	navigator.notification.beep(1); //iOS will ignore the beep number
}

// Vibrate
function notifications_vibrate() {
	navigator.notification.vibrate(3000); //3 seconds vibration
}
//******************************** END DEMO NOTIFICATIONS *********************************//