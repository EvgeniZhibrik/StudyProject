function messageModel(name, message){
	this.name = name;
	this.message = message;
}
messageModel.prototype.edit = function(id, newText){}
messageModel.prototype.del = function(id){}