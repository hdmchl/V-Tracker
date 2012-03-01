// alert dialog dismissed
function alertDismissed() {
	// do something
}

// Show a custom alert
//
function showAlert() {
	navigator.notification.alert(
								 'You are the winner!',  // message
								 alertDismissed,         // callback
								 'Game Over',            // title
								 'Done'                  // buttonName
								 );
}			
// Beep three times
//
function playBeep() {
	navigator.notification.beep(1);
}

// Vibrate for 2 seconds
//
function vibrate() {
	navigator.notification.vibrate(2000);
}