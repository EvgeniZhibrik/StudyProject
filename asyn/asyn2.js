require('es6-shim');
t = new Promise(function(resolve,reject){
	resolve();
});

function delay(time){
	t = t.then(function(){
		return new Promise(function(resolve,reject){
			setTimeout(function(){
				resolve();
			},time);
		});
	});
}
function print(txt) {
	t = t.then(function(){
		return new Promise(function(resolve,reject){
			console.log(txt);
			resolve();
			});
	});
}


var x = '10';
delay(2000);
print(x);
delay(30);
print(456);