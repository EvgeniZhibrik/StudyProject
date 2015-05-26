var messageDirective = angular.module('messageDirective',[]);

messageDirective.directive('msgDir', [function(){
	function link(scope, elem, attrs){
		scope.message = JSON.parse(attrs.message);
		scope.editMode = null;
		scope.edit = function(){
			if(attrs.name == scope.message.name && scope.message.status != 'deleted'){
				scope.editMode = scope.message.id;
				scope.edText = scope.message.text;
			}
		}
		//scope.manipulate = attrs.manipulate;
		scope.editing = function(event){
			if(event.shiftKey && event.which == 13){
				scope.editMode = null;
				scope.manipulate({id: scope.message.id, oper: 'put', newtxt: scope.edText});
			}
		}
		scope.deleting = function(){
			scope.editMode = null;
			scope.manipulate({id: scope.message.id, oper: 'delete', newtxt: ""});
		}
	}

	return {
		restrict: 'E',
		templateUrl: 'message/message.tpl.html',
		link: link,
		scope: {
			manipulate: '&onManipulate'
		}
	};
}]);