function Cursor(name, parent, scheme) {
	this.name = name;
	this.parent = parent;
	if(!parent) {

		this.place = scheme[name];

	}else if (Array.isArray(parent.place)) {
		if(this.parentIsArrayOfObjects()) {
			this.place = this.objectInArray(name);
		} else {
			this.place = '';
		}
	}else if (typeof parent.place == "object") {
		//assert (name in parent.place);
		this.place = parent.place[name]
	}else {
		throw new Error ('Scheme is not valid');
	}
	
}

Cursor.prototype.type = function () {
	if (typeof this.place == "string")
		return 'string';
	else if (Array.isArray(this.place))
		return 'array';
	else if (typeof this.place == "object")
		return 'object';
	else
		throw new Error ('Scheme is not valid');
}

Cursor.prototype.parentIsArrayOfObjects = function ()
{
	if(!Array.isArray(this.parent.place))
		return false;
	for(var i = 0; i < this.parent.place.length; i++)
		if(typeof this.parent.place[i] == "object")
			return true;
	return false;
}

Cursor.prototype.objectInArray = function (name)
{
	if(!Array.isArray(this.parent.place))
		throw new Error('Scheme is not valid');
	var flag = false;
	for(var i = 0; i < this.parent.place.length; i++) {
		if(typeof this.parent.place[i] == 'object' && this.parent.place[i].hasOwnProperty(name)){
			flag = true;
			return this.parent.place[i];
		}
	}
	if(!flag)
		throw new Error('Scheme is not valid');
}

module.exports = Cursor;