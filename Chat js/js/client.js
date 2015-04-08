'use strict';

var AppState = {
	mainUrl: 'http://192.168.2.167:31337',
	token: 0,
	firstUse: true,
	messageList: [],
	editMode: false,
	editMess: '',
	name: ''
};

function run(){
	var inputMessForm = document.getElementById('inputMessForm');
	inputMessForm.addEventListener('click', delegateEvent);
	var inputForm = document.getElementById('inputForm');
	inputForm.addEventListener('click', delegateEvent);
	var messList = document.getElementsByClassName('messages')[0];
	messList.addEventListener('click', delegateEvent);
	restore();
}

function restore(){
	get(AppState.mainUrl + setUrl(AppState.token), function(response){
		var incomingObj = JSON.parse(response.responseText);
		incomingObj.messages.forEach(function(message) {
			for (var i = 0; i < AppState.messageList.length; i++){
				if(AppState.messageList[i].id == message.id){
					AppState.messageList[i] = message;
					return;
				}
			}
			AppState.messageList.push(message);
		});
		AppState.token = incomingObj.token;
		displayPage();
		restore();
	}); 
}

function get(url, callback) {
	ajax('GET', url, null, function(response){
		callback(response);
	});
}

function displayPage(){
	if(AppState.firstUse){
		hideForms();
	}
	else {
		showForms();
		changeTitle();
		createAllMessages();
		if(AppState.editMode){
			editModeOn();
		}
		else{
			editModeOff();
		}
	}
}

function hideForms(){
	document.getElementById('inputMessForm').setAttribute("style", "visibility:hidden;");
	document.getElementById('mainForms').style.display = "none";
}

function showForms(){
	document.getElementById('inputMessForm').setAttribute("style", "visibility:visible;");
	document.getElementById('mainForms').style.display = "block";
}

function changeTitle(){
	var s = document.getElementById('chatRoom').innerHTML;
	if(s != (AppState.name + ' in CHATTING ROOM #1'))
		document.getElementById('chatRoom').innerHTML = AppState.name + ' in ' + s;
}

function editModeOn(){
	document.getElementById('send button').style.display = 'none';
	document.getElementById('edit buttons').style.display = 'block';
	document.getElementById('button'+AppState.editMess).style.display = 'block';
}

function editModeOff(){
	document.getElementById('send button').style.display = 'block';
	document.getElementById('edit buttons').style.display = 'none';
	if(AppState.editMess != '')
		document.getElementById('button' + AppState.editMess).style.display = 'none';
}

function createAllMessages(){
	var messages = document.getElementsByClassName("messages")[0];
	var t = messages.children.length;
	for(var j = 0; j< t; j++){
		messages.removeChild(messages.children[0]);
	}
	for(var i = 0; i < AppState.messageList.length; i++)
	{
		addMessage(AppState.messageList[i]);
	}
	messages.scrollTop = 9999;
}

function addMessage(message) {
	var temp = document.createElement('div');
	var htmlAsText;
	if(message.status == 'deleted'){
		htmlAsText = '<div class="message" id="' + message.id + '">' + 
		'<div class="date">deleted: ' + message.date + '</div>' + 
		'</div>';
	}
	else if(message.status == 'sent'){
		htmlAsText = '<div class="message" id="' + message.id + '">' + 
		'<div class="userName">' + message.name + '</div>' +
		'<div>' + 
		'<div class="text" style = "float:left">' + message.text + '</div>' +
		'<button id = "button' + message.id +'" class = "btn btn-danger" type = "button" style = "float:right;display:none">Delete</button>' +
		'</div>' +
		'<div class="date">sent: ' + message.date + '</div>' + 
		'</div>';
	}
	else {
		htmlAsText = '<div class="message" id="' + message.id + '">' + 
		'<div class="userName">' + message.name + '</div>' +
		'<div>' + 
		'<div class="text" style = "float:left">' + message.text + '</div>' +
		'<button id = "button' + message.id +'" class = "btn btn-danger" type = "button" style = "float:right;display:none">Delete</button>' +
		'</div>' +
		'<div class="date">edited: ' + message.date + '</div>' + 
		'</div>';
	}
	temp.innerHTML = htmlAsText;
	document.getElementsByClassName("messages")[0].appendChild(temp);
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.id == 'button1')
		onSetNameButtonClick();
	else if(evtObj.type === 'click'
		&& evtObj.target.id == 'button2')
		onSendMessButtonClick();
	else if(evtObj.type === 'click'
		&& evtObj.target.id == 'button3')
		onEditMessButtonClick();
	else if(evtObj.type === 'click'
		&& evtObj.target.id == 'button4')
		onCancelEditButtonClick();
	else if(evtObj.type === 'click'
		&& (evtObj.target.parentNode.className == 'message' || evtObj.target.parentNode.parentNode.className == 'message')
		&& (evtObj.target.parentNode.getElementsByClassName('userName')[0].innerHTML == AppState.name || evtObj.target.parentNode.parentNode.getElementsByClassName('userName')[0].innerHTML == AppState.name))
		onEditModeButtonClick(evtObj.target.parentNode.id || evtObj.target.parentNode.parentNode.id);
	else if(evtObj.type === 'click'
		&& evtObj.target.className == "btn btn-danger")
		onDeleteMessButtonClick();
}

function onSetNameButtonClick(){
	var newName = document.getElementById('setName');
	if(newName.value == '')
		return;
	AppState.name = newName.value;
	AppState.firstUse =false;
	displayPage();
} 

function onSendMessButtonClick(){
	var newText = document.getElementById('redex');
	var newMess;
	if(newText.value == '')
		return;
	newMess = postMessage(newText.value, uniqueId());
	var data = JSON.stringify(newMess);
	ajax('POST', AppState.mainUrl, data,function(response){
		console.log('POST succeed');
	});
	
	
}

function onEditMessButtonClick(){
	var newText = document.getElementById('redex');
	var newMess;
	newMess = putMessage(newText.value, AppState.editMess);
	var data = JSON.stringify(newMess);
	AppState.editMode = false;
	ajax('PUT', AppState.mainUrl + '/?id=' + newMess.id, data, function(response){
		console.log('PUT succeed');
	});
}

function onCancelEditButtonClick(){
	AppState.editMode = false;
	displayPage();
}

function onEditModeButtonClick(messId){
	AppState.editMode = true;
	AppState.editMess = messId;
	displayPage();
}

function onDeleteMessButtonClick(){
	ajax('DELETE', AppState.mainUrl + '/?id=' + AppState.editMess, null, function(response){
		console.log('DELETE succeed');
	});
	AppState.editMode = false;
	displayPage();
}

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var getDate = function(){
	var date = new Date();
	return date.toUTCString();
}


var postMessage = function(text, id) {
	return {
		method: 'POST',
		name: AppState.name,
		text: text,
		date: getDate(),
		id: id
	};
};

var putMessage = function(text, id){
	return {
		method: 'PUT',
		text: text,
		id: id,
		date: getDate()
	};
};

function ajax(method, url, data, toReturn, toReturnError) {
	var xhr = new XMLHttpRequest();
	try{
		xhr.open(method, url, true);
		xhr.onload = function () {
			if (xhr.readyState !== 4) {
				return;
			}
			toReturn(xhr);
		};    
		xhr.ontimeout = function () {
			toReturnError && toReturnError(new Error('Server timed out !'));
		}
		xhr.onerror = function (e) {
			var errMsg = 'Server connection error !\n'+
			'\n' +
			'Check if \n'+
			'- server is active\n'+
			'- server sends header "Access-Control-Allow-Origin:*"';
			toReturnError && toReturnError(new Error(errMsg));
		};
		xhr.send(data);
	}
	catch(e){
		toReturnError && toReturnError(e);
	}
}

function setUrl(token) {
	return '/?token=' + token;
}
