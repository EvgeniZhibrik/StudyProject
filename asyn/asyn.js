require('es6-shim');

function print(txt) {
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			console.log(txt);
			resolve();
		}, Math.round(1000*Math.random()));
});
};


var x = [1,2,3,4,5,6,7,8,9,0];

var f = x.reduce(function(prev,curr,ind,arr){
	return prev.then(function(){return print(curr)});
}, Promise.resolve());
