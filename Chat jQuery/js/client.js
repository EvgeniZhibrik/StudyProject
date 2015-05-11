'use strict';

var AppState = {
	mainUrl: 'http://192.168.2.97:31337',
	token: 0,
	messageList: [],
	editMess: '',
	name: '',
	serverStatus: true
};

function listen(){
	$("#InputName").keypress(function(event){

		if(event.which == 13){
			event.preventDefault();
			submitNameClick();
		}
	});
	$("#submitName").click(function(){
		submitNameClick();	
	});
	$("#button2").click(function(){
		button2Click();
		
	});
	$("#messages").find("div").dblclick(function(event){
		onMessageDblclick(event,this);
	});
	$(".btn-danger").click(function(event){
		onDeleteButtonClick();	
	});
	$(".editMessText").keypress(function(event){
		if(event.shiftKey && event.which == 13)
			onEditMessKeyPress(this);
	});

}

function submitNameClick()
{
	var newName = $("#InputName").val();
	if(newName == '')
		return;
	AppState.name = newName;
	$("#InputName").val('');
	displayPage();
}

function button2Click(){
	var newText = $("#redex").val();
	var newMess;
	if(newText == '')
		return 0;
	newMess = postMessage(newText, uniqueId());
	$("#redex").val("");
	$.ajax({
		url: AppState.mainUrl,
		data: JSON.stringify(newMess),
		type: 'POST',
		success: function(){
			console.log('POST succed');
		},
		error: function(xhr, status, errorThrown){
			alert( "Sorry, there was a problem! on post" );
       		console.log( "Error: " + errorThrown );
       		console.log( "Status: " + status );
		},
		complete: function(){
			console.log("POST complete!");
		}
	});
}

function onMessageDblclick(event,th){
	var elem = $(th).parents("div.message");
	if(elem.children('.name').html()==AppState.name && elem.siblings('.day').html() == $('div.day').last().html()){
		AppState.editMess = elem.attr("id");
		displayPage();
	}
}

function onDeleteButtonClick(){
	$.ajax({
		url: AppState.mainUrl + '/?id=' + AppState.editMess,
		type: 'DELETE',
		success: function(){
			console.log("DELETE succed");
		},
		error: function(xhr, status, errorThrown){
			alert( "Sorry, there was a problem on delete!" );
       		console.log( "Error: " + errorThrown );
       		console.log( "Status: " + status );
		},
		complete: function(){
			console.log("DELETE complete!");
		}
	});
	AppState.editMess = '';
	displayPage();
}

function onEditMessKeyPress(th){
		var newText = $(th).val();
		var newMess = putMessage(newText, AppState.editMess);
		$.ajax({
			url: AppState.mainUrl + '?/id=' + AppState.editMess,
			data: JSON.stringify(newMess),
			type: 'PUT',
			success: function(){
				console.log("PUT succed");
			},
			error: function(xhr, status, errorThrown){
				alert( "Sorry, there was a problem on put!" );
       			console.log( "Error: " + errorThrown );
       			console.log( "Status: " + status );
			},
			complete: function(){
				console.log("PUT complete!");
			}
		});
		AppState.editMess = '';
}

function run(){
	listen();
	restore();
}

function onRespond (incomingObj){
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
}

function restore(){
	$.ajax({
		url: AppState.mainUrl + '/?token=' + AppState.token,
		type: 'GET',
		dataType: "json",
		success: function(incomingObj){
			AppState.serverStatus = true;
			onRespond(incomingObj);	
		},
		error: function(xhr, status, errorThrown){
			if(AppState.serverStatus){
				alert( "Sorry, there was a problem on get!" );
				AppState.serverStatus = false;
				AppState.messageList = [];
				AppState.token = 0;
			}

        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	displayPage();
			restore();
		},
		complete: function(){
			console.log("GET complete!");
		}
	});
}

function displayPage(){
	if(AppState.name != ""){
		$("h1").show();
		$("h1").html("Hello, " + AppState.name + "!");
		$("#messages").show();
		$("#inputMessForm").show();
		createAllMessages();
	}
	else{
		$("h1").hide();
		$("#messages").hide();
		$("#inputMessForm").hide();
	}
	if(AppState.serverStatus){
		$("#serverOK").show();
		$("#serverNotOK").hide();
	}
	else{
		$("#serverOK").hide();
		$("#serverNotOK").show();
	}
	listen();
}

function createAllMessages(){
	var messages = $("#messages");
	messages.children().remove();
	for(var i = 0; i < AppState.messageList.length; i++)
	{
		addMessage(AppState.messageList[i]);
	}
	if(AppState.editMess == '')
		messages.scrollTop(9999);
}

function addMessage(message) {
	var newMess;
	var time = new Date(message.date);
	var date = time.toDateString();
	var strTime = time.getHours() + ':';
	if(time.getMinutes()<10)
		strTime += "0";
	strTime += time.getMinutes();
	var prevDate = $('div.day').last().html();
	if(prevDate != date){
		var newDate = $('<div class = "dayChat col-md-12"><div class = "day col-md-12">' + date + '</div></div>');
		$('#messages').append(newDate);
	}
	if(message.status == 'deleted'){
		newMess = $('<div class="message row" id="' + message.id + '">' + 
		'<div class="name col-md-2">' + message.name + '</div><div class="data col-md-10"><div class="text col-md-10">deleted</div><div class="time col-md-2">' +
						strTime + '</div></div></div>');
	}
	else /*if(message.status == 'sent')*/{
		newMess = $('<div class="message row" id="' + message.id + '"><div class="name col-md-2">' +
						message.name + '</div><div class="data col-md-10"><div class="text col-md-10"><pre>' +
						message.text + '</pre></div><div class="time col-md-2">' +
						strTime + '</div></div><div class="editForm col-md-10 row"><textarea class="editMessText col-md-9">' +
						message.text + '</textarea><button type="button" class = "btn btn-danger col-md-3">Delete</button></div></div>');
		if(message.id == AppState.editMess){
			newMess.children(".data").hide();
			newMess.children(".editForm").show();
		}
		else{
			newMess.children(".data").show();
			newMess.children(".editForm").hide();
		}
	}
	$('div.dayChat').last().append(newMess);
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
