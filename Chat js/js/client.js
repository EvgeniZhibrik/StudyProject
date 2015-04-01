'use strict';

var AppState = restore() || {
	mainUrl: 'http://192.168.2.167:31337',
	messageList: [],
	name: "anon",
	token: 0,
	firstUse: true
};

function store(item){
	localStorage.setItem("AppState", JSON.stringify(item));
}

function restore(){
	return JSON.parse(localStorage.getItem("AppState"));
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


var theMessage = function(text) {
	return {
		name: AppState.name,
		text: text,
		date: getDate(),
		id: uniqueId()
	};
};

function run(){
	var inputMessForm = document.getElementById('inputMessForm');
	inputMessForm.addEventListener('click', delegateEvent);
	var inputForm = document.getElementById('inputForm');
	inputForm.addEventListener('click', delegateEvent);
	displayPage();
}

function displayPage(){
	if(AppState.firstUse){
		document.getElementById('inputMessForm').setAttribute("style", "visibility:hidden;");
		document.getElementById('mainForms').style.display = "none";
		//document.getElementById('chatRoom').innerHTML = AppState.name;
	}
	else {
		get();
		createAllMessages();
	}
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.id == 'button1')
		onSetNameButtonClick();
	else if(evtObj.type === 'click'
		&& evtObj.target.id == 'button2')
		onSendMessButtonClick();
}

function onSetNameButtonClick(){
	var newName = document.getElementById('setName');
	if(newName.value == '')
		return;
	AppState.name = newName.value;
	AppState.firstUse =false;
	store(AppState);
	get();
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
}

function addMessage(message) {
	var temp = document.createElement('div');
	var htmlAsText = '<div class="message" data-task-id="' + message.id + '">' + 
						'<div class="userName">' + message.name + '</div>' +
						'<div class="text">' + message.text + '</div>' +
						'<div class="date">' + message.date + '</div>' + 
					'</div>';
	temp.innerHTML = htmlAsText;
	document.getElementsByClassName("messages")[0].appendChild(temp);

}


function onDataFromServer(response) {
	var incomingObj = JSON.parse(response);
			//console.log('client token: ' + token);
			//console.log('incoming token: ' + incomingObj.token);
	if ( AppState.token < incomingObj.token ) {
		AppState.token = incomingObj.token;
		incomingObj.messages.forEach(function(message) {
			//message = JSON.parse(message);
			AppState.messageList.push(message);
		});
		store(AppState);
		displayPage();
	}
}

function setUrl(token) {
	return '/?token=' + token;
}

function onSendMessButtonClick(){
	var newText = document.getElementById('redex');
	if(newText.value == '')
		return;
	var newMess = theMessage(newText.value);
	var data = JSON.stringify(newMess);
	ajax('POST', AppState.mainUrl, data,function(response){
		if(response.status != 200){
			return;
		}
		onDataFromServer(response.responseText);
		get();
	});
}

function close(){
  process.exit(0);
}

function end(){
	localStorage.clear();
}

/*function f(){
	
	setTimeout(function (){f();get();}, 10000);
}

f();*/