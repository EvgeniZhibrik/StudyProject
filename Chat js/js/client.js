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

function store(item){
	localStorage.setItem("AppState", JSON.stringify(item));
}

function restore(){
	ajax('GET', AppState.mainUrl + setUrl(AppState.token), null, function(response){
		var incomingObj = JSON.parse(response.responseText);
		incomingObj.messages.forEach(function(message) {
			AppState.messageList.push(message);
		});
		AppState.token = AppState.messageList.length;
		var temp2 = JSON.parse(localStorage.getItem("AppState"));
		if (temp2){
			AppState.firstUse = temp2.firstUse;
			AppState.editMode = temp2.editMode;
			AppState.editMess = temp2.editMess;
			AppState.name = temp2.name;
		}
		displayPage();
		get();
	}); 
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


var theMessage = function(text, id) {
	return {
		name: AppState.name,
		text: text,
		date: getDate(),
		id: id,
		edited: AppState.editMode,
		deleted: false
	};
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

function displayPage(){
	if(AppState.firstUse){
		document.getElementById('inputMessForm').setAttribute("style", "visibility:hidden;");
		document.getElementById('mainForms').style.display = "none";
	}
	else {
		var s = document.getElementById('chatRoom').innerHTML;
		if(s == 'CHATTING ROOM #1')
			document.getElementById('chatRoom').innerHTML = AppState.name + ' in ' + s;
		createAllMessages();
		if(AppState.editMode){
			var inputMessFormButtons = document.getElementsByClassName("form-group")[1];
			var temp = document.createElement('div');
			temp.innerHTML =  '<div class="col-xs-offset-2 col-xs-10"><button type="send" class="btn btn-primary" id = "button3">Cancel</button></div>';
			inputMessFormButtons.appendChild(temp);
			document.getElementById('button2').textContent = "Edit";
			var inputMessFormText = document.getElementById("redex");
			var allMessages = document.getElementsByClassName("message");
			for (var i = 0; i < allMessages.length; i++)
				if(allMessages[i].attributes['data-task-id'].value == AppState.editMess){
					inputMessFormText.value = allMessages[i].children[1].innerHTML;
					var temp2 = document.createElement('div');
					temp2.innerHTML = '<form class="form-inline">' + allMessages[i].children[1].innerHTML + '<button type="send" class="btn btn-danger" id = "button' + AppState.editMess +'" style = "float: right">Delete</button></form>';
					allMessages[i].insertBefore(temp2, allMessages[i].children[1]);
					allMessages[i].removeChild(allMessages[i].getElementsByClassName('text')[0]);
					break;
				}
		}
		else{
			var inputMessFormButtons = document.getElementsByClassName("form-group")[1];
			if(document.getElementsByClassName('col-xs-offset-2 col-xs-10')[1])
				inputMessFormButtons.removeChild(inputMessFormButtons.children[1]);
			document.getElementById('button2').textContent = "Send";
			var inputMessFormText = document.getElementById("redex");
			inputMessFormText.value = '';
		}
	}
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
		onCancelEditButtonClick();
	else if(evtObj.type === 'click'
		&& evtObj.target.parentNode.className == 'message'
		&& evtObj.target.parentNode.getElementsByClassName('userName')[0].innerHTML == AppState.name)
		onEditMessButtonClick(evtObj.target.parentNode.attributes['data-task-id'].value);
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
	store(AppState);
} 

function onCancelEditButtonClick(){
	AppState.editMode = false;
	AppState.editMess = '';
	displayPage();
}

function onEditMessButtonClick(messId){
	AppState.editMode = true;
	AppState.editMess = messId;
	store(AppState);
	displayPage();
}

function onDeleteMessButtonClick(){

	ajax('DELETE', AppState.mainUrl + '/?id=' + AppState.editMess, null, function(response){
			get();
		});
	AppState.editMode = false;
	AppState.editMess = '';
	store(AppState);
}

function ajax(method, url, data, toReturn) {
	var xhr = new XMLHttpRequest();

	xhr.open(method, url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4) {
			return;
		}

		toReturn(xhr);
	};    

    xhr.ontimeout = function () {
    	//toReturn('Server timed out !');
    }

    xhr.onerror = function (e) {
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"';

        //toReturn(errMsg);
    };

    xhr.send(data);
}

function get() {
	var path = setUrl(AppState.token);
	ajax('GET',AppState.mainUrl+path, null, function(response){
		onDataFromServer(response.responseText);
	});
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
	if(message.deleted){
		htmlAsText = '<div class="message" data-task-id="' + message.id + '">' + 
						'<div class="date">deleted: ' + message.date + '</div>' + 
					'</div>';
	}
	else if(!message.edited){
		htmlAsText = '<div class="message" data-task-id="' + message.id + '">' + 
						'<div class="userName">' + message.name + '</div>' +
						'<div class="text">' + message.text + '</div>' +
						'<div class="date">sended: ' + message.date + '</div>' + 
					'</div>';
	}
	else {
		htmlAsText = '<div class="message" data-task-id="' + message.id + '">' + 
						'<div class="userName">' + message.name + '</div>' +
						'<div class="text">' + message.text + '</div>' +
						'<div class="date">edited: ' + message.date + '</div>' + 
					'</div>';
	}
	temp.innerHTML = htmlAsText;
	document.getElementsByClassName("messages")[0].appendChild(temp);

}


function onDataFromServer(response) {
	var incomingObj = JSON.parse(response);
			//console.log('client token: ' + token);
			//console.log('incoming token: ' + incomingObj.token);
	while(incomingObj.token - AppState.messageList.length < incomingObj.messages.length)	
		AppState.messageList.pop();
	incomingObj.messages.forEach(function(message) {
		AppState.messageList.push(message);
	});
	AppState.token = AppState.messageList.length;
	store(AppState);
	displayPage();
}

function setUrl(token) {
	return '/?token=' + token;
}

function onSendMessButtonClick(){
	var newText = document.getElementById('redex');
	var newMess;
	if(!AppState.editMode){
		if(newText.value == '')
		return;
		newMess = theMessage(newText.value, uniqueId());
		var data = JSON.stringify(newMess);
		ajax('POST', AppState.mainUrl, data,function(response){
			get();
		});
	}
	else{
		newMess = theMessage(newText.value, AppState.editMess);
		var data = JSON.stringify(newMess);
		AppState.editMode = false;
		AppState.editMess = '';
		store(AppState);
		ajax('PUT', AppState.mainUrl + '/?id=' + newMess.id, data, function(response){
			get();
		});
	}
	
	
}

function close(){
  process.exit(0);
}

function end(){
	localStorage.clear();
}

