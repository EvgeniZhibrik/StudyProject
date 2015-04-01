var ip = '192.168.1.5';
var port = 31337;

var token = 0;
var body = '';
var period = 10000;
var name;
var messageList=[];

/*function getIp() {
    var os=require('os');
    var ifaces=os.networkInterfaces();
    
    for (var dev in ifaces) {
        for(var i in ifaces[dev]) {
            var details = ifaces[dev][i];
    
            if (details.family=='IPv4' && !details.internal) {
                return details.address;
            }
        }
    }
}*/


var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theMessage = function(text) {
	return {
		name: name,
		message: text,
		date: Date.now(),
		id: uniqueId()
	};
};

function run(){
	if(!name){
		document.getElementById('inputMessForm').setAttribute("style", "visibility:hidden;");
		document.getElementById('mainForms').style.display = "none";
	}
	else{
		document.getElementById('chatRoom').innerHTML = name;	
		var inputMessForm = document.getElementById('inputMessForm');
		inputMessForm.addEventListener('click', delegateEvent);
		get();
	}
	var inputForm = document.getElementById('inputForm');
	inputForm.addEventListener('click', delegateEvent);
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.id == 'button1')
		onSetNameButtonClick();
	if(evtObj.type === 'click'
		&& evtObj.target.id == 'button2')
		onSendMessButtonClick();
}

function onSetNameButtonClick(){
	var newName = document.getElementById('setName');
	if(newName.value == '')
		return;
	document.getElementById('inputMessForm').setAttribute("style", "visibility:visible;");
	document.getElementById('mainForms').style.display = "block";

	
	name = newName.value;
} 

function ajax(method, url, toReturn) {
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

    xhr.send();
}

function get() {
	var hostname = 'http://192.168.1.5:31337';
 	var path = setUrl(token);
	ajax('GET',hostname+path, function(response){
		onDataFromServer(response.responseText);
	});
}

function createAllMessages(){
	for(var i = 0; i < messageList.length; i++)
	{
		addMessage(messageList[i]);
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
	/*response.on('data', function(data) {
		body += data;
		//console.log('data recieved: ' + data);
	})
	response.on('end', function() {
		//console.log('get finished');
		incomingHandler(body);
		body = '';
		get();
		
	})
	response.on('error', function(e) {
		console.log('error getting: ' + e.message);
		get();
	})*/
	incomingObj = JSON.parse(response);
			//console.log('client token: ' + token);
			//console.log('incoming token: ' + incomingObj.token);
	if ( token < incomingObj.token ) {
		token = incomingObj.token;
		incomingObj.messages.forEach(function(message) {
			//message = JSON.parse(message);
			messageList.push(message);
		});
	createAllMessages(); 	
	}
}

function setUrl(token) {
	return '/?token=' + token;
}

function send( line ){

	var optionsPost = {
    	hostname: ip,
    	method: 'POST',
    	port: port,
    	agent: false
  	};

  var req = http.request(optionsPost, function(response) {
      if(response.statusCode != 200) {
        console.log('Bad request. error: ' + response.statusCode);
        return;
      }
  });

  req.on('error', function(e) {
        console.log('Server shotdown.');
  });

  req.write(JSON.stringify(('{ "name": "' + name.trim() + '", "message": "' + line.trim() + '"}')));
  token++;
  req.end();
}

function onSendMessButtonClick(){
	var newText = document.getElementById('redex');
	if(newText.value == '')
		return;
	var newMess = theMessage(newText.value);
	var hostname = 'http://192.168.1.5:31337';
	ajax('POST', hostname, function(response){
		if(response.status != 200){
			return;
		}
	});
}

function close(){
  process.exit(0);
}