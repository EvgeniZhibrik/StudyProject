var messageDirective = angular.module('messageDirective',[]);

messageDirective.directive('msgDir', [function(){
	return {
		restrict: 'E',
		templateUrl: 'message/message.tpl.html',
		transclude: true
	};
}]);