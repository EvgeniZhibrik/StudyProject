var chatAngular = angular.module('chatAngular', [
  'chatControllers',
  'messageDirective',
  'messageModel'
]);

chatAngular.value('AppState', {
		mainUrl: 'http://192.168.12.152:31337',
		token: 0,
		messageList: [],
		editMess: ''
});

chatAngular.factory('appState', ['AppState', function appStateFactory(AppState) {
	return AppState;
}]);

