/* pathfit.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

function pathFit() {
	
	var y1 = [0, -7, -5, -2, -8, -40];
	var x1 = [0, 25, 50, 75, 100, 125];
	
	var s1 = numeric.spline(x1,y1);
	 
	var x2 = numeric.linspace(0,125,125);
	var y2 = s1.at(x2);
	 
	console.log(s1);
	
	$.plot($("#graphPlaceholder"), [ numeric.transpose([x2,y2]) ]);
	
	document.getElementById('graphPlaceholder').style.display = 'block';
}