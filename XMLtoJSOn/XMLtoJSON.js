var fs = require('fs');
var assert = require('assert');

var sax = require("sax/lib/sax");


var Tag = require('./tag');
var Cursor = require('./cursor');

function makeXMLDocument(xml, scheme, p){
	var current = {};
	console.log(JSON.stringify(scheme, null, '\t'));
	var currentTag;
	var cursor;
	var root;

	var parser = p();

	parser.ontext = function (t) {
		currentTag.text = t;
 	};

 	parser.onopentag = function (node) {
 		if(!currentTag) {
 			cursor = new Cursor(node.name, null, scheme);
 			currentTag = Tag.createNew(node, cursor.type());
 			root = currentTag;
 		}
 		else {
 			cursor = new Cursor(node.name, cursor, scheme);
 			currentTag = currentTag.addChild(node, cursor.type());
 		}
	};

 	parser.onclosetag = function (name){
 		
 		assert(currentTag.name == name);
 		assert(currentTag.type in {'string':0, 'array':0, 'object':0});

 		
 		if(currentTag.hasParent()) {
 			currentTag = currentTag.parent;
 			cursor = cursor.parent;
 		} 
 	};
 	parser.write(xml).close();
 	return root;
}

function printXMLDocument (root) {
	print (root, 0);
}

function print (tag, level){
	var s = buildS (level);
	console.log(s + tag.name);
	s = buildS (level + 1);
	for (var i in tag.attributes) {
		console.log(s + i);
	}
	if(tag.type != "string" && tag.text)
		console.log(s + 'text');
	for (var i = 0; i < tag.children.length; i++) {
		print(tag.children[i], level + 1);
	}
}

function buildS (level) {
	var s = '';
	var j = 0;
	while (j < 2 * level) {
		if((j % 2 == 0) || (j == 2 * (level - 1)))
			s += '|';
		else if (j == (2 * level - 1))
			s += '-';
		else
			s += ' ';
		j++;
	}
	return s;
}

function makeJSON (xml,scheme) {
	var obj = {};
	var root = makeXMLDocument(xml, scheme, function() {
		return sax.parser(true);
	});

	printXMLDocument(root);
	obj[root.name] = getResult(root);
	console.log(JSON.stringify(obj, null, '\t'));
	return obj;
}

function getResult (tag) {
	if(tag.children.length == 0) {
		tag.createResult();
		return tag.result;
	}
	var flag = true;
	for(var i = 0; i < tag.children.length; i++) {
		if(!tag.children[i].result) {
			getResult(tag.children[i]);
		}
	}
	tag.createResult();
	return tag.result;
}



module.exports.makeJSON = makeJSON;

/*function defaultAlhorythm(node, parents, currTag)
{
	var par = peek(parents);
 	var ct = peek(currTag);

 	if(par.hasOwnProperty(node.name)){
 		var temp = par[node.name];
 		parents.pop();
 		var parpar = peek(parents);
 		parpar[ct]=[];
 		parpar[ct].push(temp);
 		parents.push(parpar[ct]);
 		temp = {};
 		parpar[ct].push(temp);
 		parents.push(temp);
 		addAtributes(temp,node.attributes);
 	}
 	else if(Array.isArray(par)){
 		var temp = {};
 		par.push(temp);
 		parents.push(temp);
 		addAtributes(temp,node.attributes);
 	}
 	else{
 		par[node.name]={};
 		parents.push(par[node.name]);
 		currTag.push(node.name);
 		addAtributes(par[node.name],node.attributes);
 	}
 	var last = peek(parents);
		if(isObject(last) && hasAttributes(last)){
			last.text = t;
		}
		else
		{
			parents.pop();
			var par = peek(parents);
			if(Array.isArray(par)){
				par.pop();
				par.push(t);
				parents.push(0);
			}
			else
			{
				last = peek(currTag);
				par[last]=t;
				parents.push(0);
			}
		}
}*/
