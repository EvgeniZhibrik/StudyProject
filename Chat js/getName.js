

function getName(){
	require('es6-shim');
	var readline = require('readline');
	return new Promise(function(resolve, reject){ 
			var rl = readline.createInterface({
  				input: process.stdin,
  				output: process.stdout
			});

			rl.question('Enter your name: ', function(answer) {
  				rl.close();
  				resolve(answer);
			});
		});
}

module.exports = getName;