var chatAngular = angular.module('chatAngular', [
  'chatControllers',
  'messageDirective',
]);

chatAngular.value('AppState', {
		mainUrl: 'http://192.168.0.102:31337',
		token: 0,
		messageList: [],
		editMess: ''
});

chatAngular.factory('appState', ['AppState', function appStateFactory(AppState) {
	return AppState;
}]);

chatAngular.factory('messageModel',function(){
	var messageModel = function(name, message){
		this.name = name;
		this.message = message;
	}
	messageModel.prototype.edit = function(id, newText){};
	messageModel.prototype.del = function(id){};
	return messageModel;
});