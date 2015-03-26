require('es6-shim');
var readline = require('readline');

function inputVar(x, variables){
	//console.log(variables);
	if(typeof x == 'number')
		return Promise.resolve(x);
	else if(variables[x]){
		return Promise.resolve(variables[x]);
	}
	else{

		var rl = readline.createInterface({
  			input: process.stdin,
  			output: process.stdout
		});	

		rl.question('Enter ' + x + ': ', function(answer) {
  			rl.close();
  			variables[x]=parseFloat(answer);
  			return Promise.resolve(parseFloat(answer));
		});
	}
}

function print(txt) {
	console.log(JSON.stringify(txt, null, '\t'));
}


function isDigit(ch)
{
	return (ch>='0' && ch<='9');
}

function isLetter(ch)
{
	return ((ch>='A' && ch<='Z') || (ch>='a' && ch<='z'));
}
function isUnary(s,k)
{
	return ((s[k]=='-' || s[k]=='+') && (k==0 || s[k-1]=='('));
}

function highPriority(x,y)
{
	if (y=='(')
		return false;
	if(x=='^')
		return false;
	if((x=='+' || x== '-') && (y!=void 0))
		return true;
	if((x=='*' || x=='/') && (y=='*' || y=='/' || y=="^"))
		return true;
	return false;
}

function plus(stN, variables)
{
	
	var b = stN.pop();
	var a = stN.pop();
	inputVar(a, variables).then(function(a1){
		inputVar(b, variables).then(function(b1){
			stN.push(a1+b1);
			console.log(stN);
		});
	});
}

function minus(stN, variables, continuation)
{
	
	var b = stN.pop();
	var a = stN.pop();
	inputVar(a, variables,function(a1){
		inputVar(b, variables,function(b1){
			stN.push(a1-b1);
			//console.log(stN);
			continuation();
		});
	});
}

function mult(stN, variables, continuation)
{
	var b=stN.pop();
	var a=stN.pop();
	if (a == 0 || b == 0){
		stN.push(0);
		continuation();
	}
	else
		inputVar(a, variables,function(a1){
			inputVar(b, variables,function(b1){
				stN.push(a1*b1);
				//console.log(stN);
				continuation();
			});
		});
}

function div(stN, variables, continuation)
{
	var b=stN.pop();
	var a=stN.pop();
	if(a == 0 && typeof b == 'number' && b != 0)
	{
		stN.push(0);
		continuation();
	}
	else
	{
		inputVar(a, variables,function(a1){
			inputVar(b, variables,function(b1){
				stN.push(a1 / b1);
				//console.log(stN);
				continuation();
			});
		});
	}
}

function pow(stN, variables, continuation)
{
	var b=stN.pop();
	var a=stN.pop();
	inputVar(a, variables,function(a1){
		inputVar(b, variables,function(b1){
			stN.push(Math.pow(a1,b1));
			//console.log(stN);
			continuation();
		});
	});
}

function operation(stN, oper, variables)
{
	
	switch(oper)
	{
		case '+':
			plus(stN, variables);
			//console.log(stN);
			break;
		case '-':
			minus(stN, variables);
			//console.log(stN);
			break;
		case '*':
			mult(stN, variables);
			//console.log(stN);
			break;
		case '/':
			div(stN, variables);
			//console.log(stN);
			break;
		case '^':
			pow(stN, variables);
			//console.log(stN);
			break;
		default:
			return NaN;
	}
}

function extractNumber(s,k)
{
	var l=k+1;
	while(isDigit(s[l]))
		l++;
	if(s[l]=='.')
	{
		l++;
		while(isDigit(s[l]))
			l++;
	}
	var res=[];
	res.num=parseFloat(s.slice(k,l));
	res.ind=l-1;
	return res;
}

function extractVariable(s,k)
{
	var l = k + 1;
	while (isDigit(s[l]) || isLetter(s[l]))
		l++;
	var  res=[];
	res.num = s.slice(k,l);
	res.ind = l-1;
	return res;
}

function push(stN, num, fl)
{
	if(fl)
	{
		stN.push(-1);
		stN.push(num);
		stN.push('*');
		//console.log(stN);
	}
	else
	{
		stN.push(num);
		//console.log(stN);
	}
}

function move(stSource, stContainer, statement)
{
	var c = stSource.pop();
	while (statement(c))
	{
		stContainer.push(c);
		c = stSource.pop();
	}
	return c;
}

function toRPN(s)
{
	var resultArr = [];
	var stackOp = [];
	var k=0, symb, tmp, unaryMinus=false;
	for(k = 0; k < s.length; k++)
	{
		symb = s[k];
		//console.log(symb);	
		if(isDigit(symb))
		{
			tmp = extractNumber(s, k);
			push(resultArr, tmp.num, unaryMinus);
			k=tmp.ind;
			unaryMinus=false;
			////console.log(stackNum);
		}
		else if(isLetter(symb))
		{
			tmp = extractVariable(s, k);
			push(resultArr, tmp.num, unaryMinus);
			unaryMinus=false;
			k = tmp.ind;
			////console.log(stackNum);
		}
		else if(isUnary(s,k))
		{
			if(symb=='-')
			{
				unaryMinus=true;
			}
		}
		else
		{
			switch(symb)
			{
			case '(':
				stackOp.push(symb);
				//console.log(stackOp);
				break;
			case ')':
				move(stackOp, resultArr, function(x){ return (x != '(');});
				break;
			default:
				c = move(stackOp, resultArr, function(x){ return (highPriority(symb, x));});
				if(c!=void 0)
					stackOp.push(c);
				stackOp.push(symb);
				//console.log(stackOp);
			}
		}
	}
	move(stackOp, resultArr, function(x){ return (x != void 0);});
	return resultArr;
}

function oneStep(symb,stack, variables)
{
	return Promise.resolve(function(){
		if(typeof(symb) == 'number')	
		{
			stack.push(symb);
		}
		else if (isLetter(symb[0]))
		{
			stack.push(symb);
		}
		else
		{
			operation(stack, symb, variables);
		}
	});
}

function solveRPN(arr)
{
	var stack=[];
	var variables = {};
	var f = arr.reduce(function(prev, curr, ind, ar){
		prev.then(function(){
			console.log(curr);
			return oneStep(curr,stack, variables);
		});
	}, Promise.resolve());
	f.then(function(){
		
	});
}

function calc(s)
{
	console.log('calculating expression: ' + s);
	var x = toRPN(s);
	print(x);
	solveRPN(x);
}

/*var x = [];
x.push('(2+a)*b');

x.push('23.45+((-63)+81*(+4.23456-46/(-23)))');//465.44936
x.push('-2+2*2');//2
x.push('((((-2+2)*2-2)-2.0/2)+2)-8.3');//-9.3
x.push('1*2*3*4*5*6*7*8*9');//362880
x.push('(5-4.5)*(5*5+5*4.5+4.5*4.5)');//33.875
x.push('3+4*2/(1-5)^2');//3.5
x.push('23.45+((-63)+x*(+4.23456-e34r/(-23)))');
x.push('-2+re*q1w23e');
x.push('((((-x+x)*x-x)-x/x)+x)-8.3');
x.push('a*b*c*d*e*f*g*h*i');
x.push('(qwerty1-qwerty2)*(qwerty1*qwerty1+qwerty1*qwerty2+qwerty2*qwerty2)');

var f = x.reduceRight(function(prev, curr, ind , ar){
	return function(){
		calc(curr, function(value){ print(value, prev); })
	};
}, function(){});

f();*/
calc('2+2').then(function(value){print(value);});