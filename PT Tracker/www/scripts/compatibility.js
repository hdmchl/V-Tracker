//use modernizr to test the browser

function checkBrowserCompatibilities() {
	var nonCompatibilities = '';
	
	//check local storage
	if (Modernizr.localstorage) {
		// window.localStorage is available!
	} else {
		// no native support for local storage :(
		nonCompatibilities = nonCompatibilities + 'localstorage, ';
	}
	
	if (Modernizr.geolocation) {
		// let's find out where you are!
	} else {
		// no native geolocation support available :(
		nonCompatibilities = nonCompatibilities + 'geolocation, ';
	}
	
	if (nonCompatibilities != '') {
		alert('Your browser is not fully compatible with PT Tracker.' + '\n' + 'The services lacking are: ' + nonCompatibilities);
	}
}