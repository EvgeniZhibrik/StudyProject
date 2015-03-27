var ip = getIp();
var port = 31337;

var token = 0;
var body = '';
var period = 10000;
var name;


function getIp() {
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
}


var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theMessage = function(text) {
	return {
		name: name,
		message: text,
		//time: Date.now(),
		//id: uniqueId()
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
	}
	var inputForm = document.getElementById('inputForm');
	inputForm.addEventListener('click', delegateEvent);
	
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.id == 'button1')
		onSetNameButtonClick();

}

function onSetNameButtonClick(){
	var newName = document.getElementById('setName');
	if(newName.value == '')
		return;
	document.getElementById('inputMessForm').setAttribute("style", "visibility:visible;");
	document.getElementById('mainForms').style.display = "block";

	
	name = newName.value;
	
} 

function get() {
	var optionsGet = {
 		hostname: getIp(),
 		port: port,
  		path: '/',
  		method: 'GET'
	};

	optionsGet.path = setUrl(token);
	
	var gett = http.request(optionsGet, function(response){
		onDataFromServer(response,function(incoming) {
			incomingObj = JSON.parse(incoming);
			//console.log('client token: ' + token);
			//console.log('incoming token: ' + incomingObj.token);
			if ( token < incomingObj.token ) {
				token = incomingObj.token;
				incomingObj.messages.forEach(function(message) {
					addMessage(message);
					//message = JSON.parse(message);
					//console.log(message.name + ': ' + message.message);
				}) 	
			}
			
		});
	});
	gett.on('error', function(e){
		get();
	});
	gett.end();
}

function onDataFromServer(response, incomingHandler) {
	response.on('data', function(data) {
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
	})

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


function close(){
  process.exit(0);
}


/*process.stdin.setEncoding('utf8');
var input;
var temp;

function commandHandler(input){

  switch ( temp.trim() ){
      case 'exit':
        close();
       break;

       default:
        if ( temp != null && temp.length > 0 )
          send(temp);
    }
}

process.stdin.on('readable', function(){
    var input = process.stdin.read();
    if ( input == null ) {
      return;
    }
    temp = input;
    commandHandler(input); 
}); */



//main.
//starting with get request and listening for input to send or close client instatance.