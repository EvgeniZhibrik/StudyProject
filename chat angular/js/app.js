var chatAngular = angular.module('chatAngular', [
  'chatControllers',
  'messageDirective'
]);

chatAngular.value('AppState', {
		mainUrl: 'http://192.168.1.2:31337',
		token: 0,
		messageList: [{
			name: "kaktus",
			date: "19.05.2015",
			text: "haha",
			id: "1"
		}, {
			name: "fikus",
			date: "19.05.2015",
			text: "hoho",
			id: "2"
		}],
		editMess: ''
});

chatAngular.factory('appState', ['AppState', function appStateFactory(AppState) {
	return AppState;
}]);