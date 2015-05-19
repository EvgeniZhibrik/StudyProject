var http = require('http');
var history = [{
				method: 'POST',
				text: 'Hi!',
				date: 'Wed, 08 Apr 2015 13:43:10 GMT',
				id: '111',
				name: 'Admin'
}];
var util = require('util');
var toBeResponded = [];
var assert = require('assert');
var url = require('url');
var getIp = require('..\\getIp');

var ip = getIp();
var port = 31337;

var getDate = function(){
	var date = new Date();
	return date.toUTCString();
}

var server = http.createServer(function (req, res) {
	if(req.method == 'GET'){
		getHandler(req, res);
		console.log('method: ' + req.method);
		return;
	}
	else if(req.method == 'POST'){
		postHandler(req, res);
		console.log('method: ' + req.method);
		return;
	}
	else if(req.method == 'PUT'){
		putHandler(req, res);
		console.log('method: ' + req.method);
		return;
	}
	else if(req.method == 'DELETE'){
		deleteHandler(req,res);
		console.log('method: ' + req.method);
		return;
	}
	else if(req.method == 'OPTIONS')
	{
		res.writeHeader(200, {'Access-Control-Allow-Origin':'*',
										"Access-Control-Allow-Methods":"PUT, DELETE, POST, GET, OPTIONS",
										'Access-Control-Allow-Headers': 'Content-Type'});
		res.end();
		console.log('method: ' + req.method);
		return;
	}
});

function getHandler(req, res) {
	console.log('gethandler started');
	var token = getToken(req.url);
	console.log('token: ' + token);
	console.log('history size: ' + history.length);
	if(token > history.length) {
		responseWith(res, 401, token, null);
		return;
	}
	if(token < history.length) {
		var clientMess = getMessages(token);
		var serverMess = getMessages(history.length);
		var respData = delta(clientMess, serverMess);
		responseWith(res, 200, history.length, respData);
		return;
	}

	console.log('waiter added.token: ' + token + ' history size: ' + history.length);
	toBeResponded.push({res: res, token: token});
}

function postHandler(req, res) {
	console.log('posthandler started');
	onDataComplete(req, function(message){
		history.push(message);
		console.log('history: ' + util.inspect(history, { showHidden: true, depth: null }));
		toBeResponded.forEach(function(waiter){
			var token = waiter.token;
			console.log('responding waiter. token: ' + token + ' history size: ' + history.length);
			var clientMess = getMessages(token);
			var serverMess = getMessages(history.length);
			var respData = delta(clientMess, serverMess);
			responseWith(waiter.res, 200, history.length, respData);
			console.log(respData);
			waiter.res.end();
		});
		toBeResponded = [];
		res.writeHeader(200, {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers': 'Content-Type, x-xsrf-token'});
		res.end();
	});
}

function putHandler(req, res){
	console.log('puthandler started');
	onDataComplete(req, function(message){
		history.push(message);
		console.log('history: ' + util.inspect(history, { showHidden: true, depth: null }));
		var serverMess = getMessages(history.length);
		toBeResponded.forEach(function(waiter){
			var token = waiter.token;
			console.log('responding waiter. token: ' + token + ' history size: ' + history.length);
			var clientMess = getMessages(token);
			var respData = delta(clientMess, serverMess);
			responseWith(waiter.res, 200, history.length, respData);
			console.log(respData);
			waiter.res.end();
		});
		toBeResponded = [];
		res.writeHeader(200, {'Access-Control-Allow-Origin':'*'});
		res.end();
	});
}

function deleteHandler(req,res){
	console.log('deletehandler started');
	var id = getId(req.url);
	console.log('id: ' + id);
	var i;
	history.push({
		method: 'DELETE',
		id: id,
		date: getDate()
	});
	var serverMess = getMessages(history.length);
	toBeResponded.forEach(function(waiter){
			var token = waiter.token;
			console.log('responding waiter. token: ' + token + ' history size: ' + history.length);
			var clientMess = getMessages(token);
			var respData = delta(clientMess, serverMess);
			responseWith(waiter.res, 200, history.length, respData);
			console.log(respData);
			waiter.res.end();
		});
	toBeResponded = [];
	res.writeHeader(200, {'Access-Control-Allow-Origin':'*'});
	res.end();
}

function responseWith(response, statusCode, token, messages){
	response.writeHeader(statusCode, {'Access-Control-Allow-Origin':'*'});
	if ( messages != null ) {
	
		response.write(JSON.stringify({
			token:token,
			messages:messages
			})
		);
		console.log(JSON.stringify({
			token:token,
			messages:messages
		}));
	}
	response.end();
}

function getToken(u) {
	var parts = url.parse(u, true);
	console.log(u);
	console.log(parts.query);
	console.log(parts.query.token);
	return parts.query.token;
}

function getId(u){
	var parts = url.parse(u, true);
	console.log(u);
	console.log(parts.query);
	console.log(parts.query.id);
	return parts.query.id;	
}

function onDataComplete(req, handler) {
	var message = '';
	req.on('data', function(data){
		message += data.toString();
	});

	req.on('end', function(){
		handler(JSON.parse(message));
	});
}

function delta(oldArr, newArr){
	var result = [];
	for(var i = 0; i < oldArr.length; i++){
		if(!check(oldArr[i],newArr[i]))
			result.push(newArr[i]);
	}
	for(var i = oldArr.length; i < newArr.length; i++)
		result.push(newArr[i]);
	return result;
}

function getMessages(token){
	var arr = [];
	for(var i = 0; i < token; i++){
		if(history[i].method == 'POST')
			post(arr,history[i]);
		else if(history[i].method == 'PUT')
			put(arr,history[i]);
		else if(history[i].method == 'DELETE')
			del(arr,history[i]);
	}
	return arr;
}

function post(arr, message){
	arr.push({
		name: message.name,
		text: message.text,
		date: message.date,
		id: message.id,
		status: 'sent'
	});
}

function put(arr, message){
	for(var i = 0; i < arr.length; i++){
		if(arr[i].id == message.id){
			arr[i].text = message.text;
			arr[i].date = message.date;
			arr[i].status = 'edited';
			return;
		}
	}
}

function del(arr, message){
	for(var i = 0; i < arr.length; i++){
		if(arr[i].id == message.id){
			arr[i].text = '';
			arr[i].date = message.date;
			arr[i].status = 'deleted';
			return;
		}
	}
}

function check(mess1, mess2){
	return ((mess1.id == mess2.id) && (mess1.text == mess2.text) && (mess1.date == mess2.date) && (mess1.name == mess2.name) && (mess1.status == mess2.status));
}

server.listen(port, ip);
server.setTimeout(10000000);
console.log('Server running at http://'+ ip + ':'+ port);