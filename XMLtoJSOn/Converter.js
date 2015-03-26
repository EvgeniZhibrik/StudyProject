var conv = require('./XMLtoJSON.js');
var program = require('commander');

program
  .version('0.0.1')
  .option('-s, --source [path]', 'Source file (nessesary otion)')
  .option('-d, --destination [path]', 'Destination file, default is [sourseFileName](converted).json')
  .option('-c, --scheme [path]', 'File, containig scheme')
  .option('-f, --folder [path]', 'Default folder, where all the paths start')
  .parse(process.argv);

function readXML(path)
{
	var s = fs.readFileSync(path,'utf8');
	//console.log(s);
	s = s.replace(/\s+/g," ");
	s = s.replace(/(\s+)</g,"<");
	s = s.replace(/>\s+/g,">");
	//console.log(s);
	return s;
}

function newFileNameConstruction(old){
	var i = old.length-1;
	while (old[i]!='.') // indexOf
		i--;
	var s = old.slice(0,i) + '(converted).json';
	return s;
}

function writeJSON(obj, oldPath, newPath){
	if(newPath == 'console'){
		console.log(JSON.stringify(obj,null,'\t'));
	}
	else if(newPath){
		fs.writeFileSync(newPath, JSON.stringify(obj, null, '\t'));
	}
	else{
		fs.writeFileSync(newFileNameConstruction(oldPath),JSON.stringify(obj,null,'\t'));	
	}
}

if(program.source)
{
	if(program.folder)
	{
		var source = program.folder + program.source;
		if(program.destination)
			var destination = program.folder + program.destination;
		if(program.scheme)
			var scheme = program.folder + program.scheme;
	}
	else
	{
		var source = program.source;
		if(program.destination)
			var destination = program.destination;
		if(program.scheme)
			var scheme = program.scheme;
	}

	var xml = readXML(source);
	if(scheme)
		var sch = JSON.parse(fs.readFileSync(scheme,'utf8'));
	var y = conv.makeJSON(xml, sch);
	writeJSON(y, source, destination);
}
else
{
	console.log('Source file needed');
}