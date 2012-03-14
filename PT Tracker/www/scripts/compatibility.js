//use modernizr to test the browser compatibility

function checkBrowserCompatibilities() {
	var incompatibilities = '';
	
	//check local storage
	if (Modernizr.localstorage) {
		// window.localStorage is available!
	} else {
		// no native support for local storage :(
		incompatibilities = incompatibilities + 'localstorage, ';
	}
	
	if (Modernizr.geolocation) {
		// let's find out where you are!
	} else {
		// no native geolocation support available :(
		incompatibilities = incompatibilities + 'geolocation, ';
	}
	
	// display an alert if there are any incompatibilities
	if (incompatibilities != '') {
		alert('Your browser is not fully compatible with PT Tracker.' + '\n' + 'The services lacking are: ' + incompatibilities);
	}
}