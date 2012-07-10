/* pathfit.js
 * 
 * Written by Hadi Michael in 2012
 * Faculty of Engineering, Monash University (Australia)
 *
 */

function pathFit() {
	
	//var y1 = [0, -3, -5, -2, -8, -40];
	//var x1 = [0, 25, 50, 75, 100, 125];
	//var s1 = numeric.spline(x1,y1);
	
	var x1 = [0, 1, 3, 5, 6, 9, 8.7, 9.2, 9, 8.9, 9.1, 10, 11, 13, 14, 16];
	var y1 = [1, 1.1, 0.9, 1.3, 1, 0.8, 1.3, 2, 3, 4, 5, 5.1, 4.9, 5.3, 5, 4.8];
	
	
	var xM = []; 
	var yM = [];
	var M = [];
	var error = [];
	var RMSE = [];
	var cutoff = null;
	
	for (var i=0; i < x1.length ; i++) {
		var xD = x1.slice(0,i+1);
		var yD = y1.slice(0,i+1);
		//console.log("xD = " + xD);
		//console.log("yD = " + yD);
		
		if (xD.length == 1) {continue;}
		M[i] = findLineByLeastSquares(xD,yD)
		//console.log("NEW MODEL: " + M[i]);
		
		for (var j=0;j<xD.length;j++) {
			yM[j] = M[i][0]*xD[j] + M[i][1]; //get y
			//console.log("yM = " + yM[j]);
			//console.log("yD = " + yD[j]);
			
			error[j] = Math.pow(yD[j] - yM[j], 2); //check model error
		}
		
		RMSE[i] = Math.sqrt(error.avg()); //check RMSE at that stage
		console.log("RMSE at model " + i + " is " + RMSE[i]);
		
		//if change in RMSE is > xx, break
		var maxChange = 0.2;
		if (Math.abs(RMSE[i]-RMSE[i-1]) > maxChange)
		{
			cutoff = i;
			break;
		}
	}
	console.log(cutoff)
	
	x2 = x1.slice(0,cutoff);
	y2 = y1.slice(0,cutoff);
	
	M2 = findLineByLeastSquares(x2,y2);
	console.log(M2);

	var maxX = Math.round(x2[x2.length-1]);
	var x3 = numeric.linspace(0, maxX, 2*maxX);
	var y3 = [];
	
	for (var i=0;i<x3.length;i++) {
		y3[i] = M2[0]*x3[i] + M2[1];
	}
	
	var options = {
		series: {
			lines: { show: true },
			points: { show: true }
		},
		yaxis: {
			//min: 0,
			//max: 10
		}
	};
	
	$.plot($("#graphPlaceholder"), [ numeric.transpose([x1,y1]), numeric.transpose([x3,y3]) ], options);
	//$.plot($("#graphPlaceholder"), [ numeric.transpose([x3,y3]) ], options);
	
	document.getElementById('graphPlaceholder').style.display = 'block';
}

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;
    
    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;
    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }
    
    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }
    
    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }
    
    /*
     * Calculate m and b for the formula:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;
    
    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];
    
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }
    
    //return [result_values_x, result_values_y];
	return [m, b];
}

Array.prototype.avg = function() {
	var av = 0;
	var cnt = 0;
	var len = this.length;
	for (var i = 0; i < len; i++) {
	var e = +this[i];
	if(!e && this[i] !== 0 && this[i] !== '0') e--;
	if (this[i] == e) {av += e; cnt++;}
	}
	return av/cnt;
}