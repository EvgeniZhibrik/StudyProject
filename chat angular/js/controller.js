var chatControllers = angular.module('chatControllers', []);


chatControllers.controller('chatCtrl', ['$scope', '$http', 'appState',
  function($scope, $http, appState) {
  	
  	$scope.submitNameClick = function(userName)
	{
		if(!$scope.name)
			getMessages();
		$scope.name = userName;
		$scope.userName = null;
	}

	$scope.onSendMessClick = function (newText){
		if(newText == '' || newText == null)
			return 0;
		var newMess = postMessage(newText, uniqueId());
		$scope.newText = '';

		$http.post(appState.mainUrl, newMess).
  		success(function(data, status, headers, config) {
    
  		}).
  		error(function(data, status, headers, config) {
    
    	});
	}

	getMessages = function(){
		$http.get(appState.mainUrl + '/?token=' + $scope.token).
  		success(function(data, status, headers, config) {
  			onRespond(data);	
  		}).
  		error(function(data, status, headers, config) {
    	
    	});
	};
  	
  	function onRespond (incomingObj){
  		console.log(incomingObj);
		incomingObj.messages.forEach(function(message) {
			for (var i = 0; i < $scope.messageList.length; i++){
				if($scope.messageList[i].id == message.id){
					$scope.messageList[i] = message;
					return;
				}
			}
			$scope.messageList.push(message);
		});
		$scope.token = incomingObj.token;
		getMessages();
	}


	var postMessage = function(text, id) {
		return {
			method: 'POST',
			name: $scope.name,
			text: text,
			date: getDate(),
			id: id
		};
	};

	var uniqueId = function() {
		var date = Date.now();
		var random = Math.random() * Math.random();

		return Math.floor(date * random).toString();
	};

	var getDate = function(){
		var date = new Date();
		return date.toUTCString();
	}


  	$scope.messageList = [];
  	$scope.token = 0;
  }]);
