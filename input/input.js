//'use strict';

require('es6-shim');
var readline = require('readline');

function inputVar(x){
	return new Promise(function(resolve, reject){ 
			var rl = readline.createInterface({
  				input: process.stdin,
  				output: process.stdout
			});

			rl.question('Enter ' + x + ': ', function(answer) {
  				rl.close();
  				resolve(parseFloat(answer));
			});
		});
}

function print(txt) {
	return Promise.resolve(txt).then(function(value){
		console.log(JSON.stringify(value));
	});
}


inputVar('a').then(function(value){
	return {a:value};
}).then(function(value){
	return inputVar('b').then(function(valueB) {
		value['b'] = valueB;

		return value;
	});
}).then(function(value){
	return inputVar('c').then(function(valueC) {
		value['c'] = valueC;

		return value;
	});
}).then(function(value){
	return print(value);
});
