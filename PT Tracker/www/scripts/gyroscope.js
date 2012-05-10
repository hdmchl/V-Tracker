/* gyroscope.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

function gyroscope_startWatching() {
	window.addEventListener("deviceorientation", updateOrientation);
}

function updateOrientation(orientation) {
	document.getElementById('gyroscope').innerHTML = 	'<p>Alpha: ' + orientation.alpha +
														'<br>Beta: ' + orientation.beta +
														'<br>Gamma: ' + orientation.gamma + '</p>'
}

function gyroscope_stopWatching() {
	window.removeEventListener("deviceorientation",updateOrientation);
}
