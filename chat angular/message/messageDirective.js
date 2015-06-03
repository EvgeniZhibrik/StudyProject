var messageDirective = angular.module('messageDirective',[]);

messageDirective.directive('msgDir', [function(){
	function link(scope, elem, attrs){
		scope.message = scope.model.message;
		scope.editMode = null;
		scope.edit = function(){
			if(scope.model.name == scope.message.name && scope.message.status != 'deleted'){
				scope.editMode = scope.message.id;
				scope.edText = scope.message.text;
			}
		}
		//scope.manipulate = attrs.manipulate;
		scope.editing = function(event){
			if(event.shiftKey && event.which == 13){
				scope.model.edit(scope.edText);
			}
		}
		scope.deleting = function(){
			scope.editMode = null;
			scope.model.del();
		}
	}

	return {
		restrict: 'E',
		templateUrl: 'message/message.tpl.html',
		link: link,
		scope: {
			model: '='
		}
	};
}]);