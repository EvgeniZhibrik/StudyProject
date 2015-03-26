function Tag(parent, type, name, attrs) {
	this.parent = parent;
	this.type = type;
	this.name = name;
	this.addAtributes(attrs);
	this.children = [];
}

Tag.createNew = function(node, type){
	var tag = new Tag(null, type, node.name, node.attributes);

	return tag;
}

Tag.prototype.addChild = function (node, type) {
	var temp = Tag.createNew (node, type);

	this.children.push(temp);
	temp.parent = this;
	return temp;
}

Tag.prototype.addAtributes = function (attr) {
	if (!attr)
		return;

	this.attributes = {};
  	for (var i in attr)      
  	{
    	this.attributes[i]=attr[i];
  	}
}

Tag.prototype.isString = function () {
	return this.type == 'string';
}

Tag.prototype.isArray = function () {
	return this.type == 'array';
}

Tag.prototype.isObject = function () {
	return this.type == 'object';
}

Tag.prototype.createArray = function (){
	var temp = [];
	for (var i = 0; i < this.children.length; i++)
		temp.push(this.children[i].result);
	return temp;
}

Tag.prototype.createObject = function () {
	var temp = {};
	for (var i in this.attributes)
		temp[i] = this.attributes[i];
	for (var i = 0; i < this.children.length; i++)
		temp[this.children[i].name] = this.children[i].result;
	if(this.hasOwnProperty('text'))
		temp.text = this.text;
	if(this.parent && this.parent.type == 'array'){
		var temp2 = {};
		temp2[this.name] = temp;
		temp = temp2;
	}
	return temp;
}

Tag.prototype.createResult = function() {
	var result;
	if(this.isString()) {
 		result = this.text;
 	} else if(this.isArray()) {
 		result = this.createArray();
 	} else if(this.isObject()) {
 		result = this.createObject();
 	} else {
 		throw new Error('Unexpected exception');
 	}
	this.result = result;
}

Tag.prototype.hasParent = function() {
	return (this.parent);
}

module.exports = Tag;