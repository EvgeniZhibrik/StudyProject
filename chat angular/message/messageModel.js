var messageModel = angular.module('messageModel',[]);


messageModel.factory('messModel',function(){
	var messModel = function(name, message){
		this.name = name;
		this.message = message;
	}
	messModel.prototype.edit = function(id, newText){};
	messModel.prototype.del = function(id){};
	return messModel;
});
