var assert = require("assert");
var should = require('should');
var x = require('../expression.js');

describe('calc()', function(){
    it('should return 2 when the expression is -2+2*2', function(done){
    	var t;
    	x.calc('-2+2*2',function(value){
      		assert.equal(2, value);
      		done();
    	});
    });

    it('should return 10 when the expression is (2+3)*2', function(done){
    	x.calc('(2+3)*2',function(value){
 		    assert.equal(10, value);
 		    done();
    	});
    });

    it('should return 9 when the expression is 2+3+4*(43-42)', function(done){
    	x.calc('2+3+4*(43-42)', function(value){
    		value.should.equal(9);
    		done();
    	});
    });
});