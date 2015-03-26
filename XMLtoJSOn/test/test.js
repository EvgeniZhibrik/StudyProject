var x = require('../XMLtoJSON.js');
var assert = require("assert");
var should = require('should');
fs = require('fs');

describe('makeJSON()', function(){
    /*it('should exist', function(done){
    	assert (x.makeJSON('<root></root>')!== null);
    	done();	
    });

    it('should return an object',function(done){
    	assert (typeof x.makeJSON('<root></root>') == 'object');
    	done();	
    });
   
   	it('should return object with parameter person when running for test1.xml',function(done){
   		var t = x.makeJSON('<person>'+
   								'<firstName>Иван</firstName>'+
   							'</person>');
   		assert("person" in t);
   		done();
   	});


   	it('should has firstName=Иван when running for test1.xml',function(done){
   		var t = x.makeJSON('<person>'+
   								'<firstName>Иван</firstName>'+
   							'</person>');
   		assert(t.person.firstName == 'Иван' );
   		done();
   	});

   	it('must return an object that suits empty xml', function(done){
   		var t = x.makeJSON('<root></root>');
   		assert.deepEqual(t, {root: {}});
   		done();
   	});

	it('must return an object that suits xml with 1 object with attribute', function(done){
   		var t = x.makeJSON('<root>'+
   								'<e attr="x"></e>'+
   							'</root>');
   		assert.deepEqual(t, {
   								root:{
   									e:{
   										attr:'x'
   									}
   								}
   							});
   		done();
   	});
	it('must return right object with test1', function(done){
		var t = x.makeJSON('<person>'+
								'<firstName>Иван</firstName>'+
								'<lastName>Иванов</lastName>'+
								'<address>'+
									'<streetAddress>Московское ш., 101, кв.101</streetAddress>'+
									'<city>Ленинград</city>'+
									'<postalCode>101101</postalCode>'+
								'</address>'+
								'<phoneNumbers>'+
									'<phoneNumber>812 123-1234</phoneNumber>'+
									'<phoneNumber>916 123-4567</phoneNumber>'+
								'</phoneNumbers>'+
							'</person>');
   		assert.deepEqual(t, {
   			"person": {
   				"firstName": "Иван",
   				"lastName": "Иванов",
   				"address": {
   					"streetAddress": "Московское ш., 101, кв.101",
   					"city": "Ленинград",
   					"postalCode": 101101
   				},
   				"phoneNumbers": ["812 123-1234","916 123-4567"]
   			}
   		});
   		done();
	});
	it('must return right object with test2', function(done){
		var t = x.makeJSON('<recipe name="хлеб" preptime="5min" cooktime="180min">'+
								'<title>Простой хлеб</title>'+
								'<composition>'+
									'<ingredient amount="3" unit="стакан">Мука</ingredient>'+
									'<ingredient amount="0.25" unit="грамм">Дрожжи</ingredient>'+
									'<ingredient amount="1.5" unit="стакан">Тёплая вода</ingredient>'+
									'<ingredient amount="1" unit="чайная ложка">Соль</ingredient>'+
								'</composition>'+
								'<instructions>'+
									'<step>Смешать все ингредиенты и тщательно замесить.</step>'+
									'<step>Закрыть тканью и оставить на один час в тёплом помещении.</step>'+
									'<!-- <step>Почитать вчерашнюю газету.</step>- это сомнительный шаг...-->'+
									'<step>Замесить ещё раз, положить на противень и поставить в духовку.</step>'+
								'</instructions>'+
							'</recipe>');
   		assert.deepEqual(t, {
   			"recipe": {
   				"name": "хлеб",
   				"preptime": "5min",
   				"cooktime": "180min",
   				"title": "Простой хлеб",
   				"composition": [{
   						"amount": "3",
	   					"unit": "стакан",
   						"text": "Мука"
   					},{
   						"amount": "0.25",
   						"unit": "грамм",
   						"text": "Дрожжи"
   					},{
   						"amount": "1.5",
   						"unit": "стакан",
   						"text": "Тёплая вода"
   					},{
   						"amount": "1",
   						"unit": "чайная ложка",
   						"text": "Соль"
   				}],
   				"instructions": ["Смешать все ингредиенты и тщательно замесить.",
   							"Закрыть тканью и оставить на один час в тёплом помещении.",
   							"Замесить ещё раз, положить на противень и поставить в духовку."]
   			}
   		});
   		done();
	});
	
	it('must return right object for test3', function(done){
		var t = x.makeJSON('<person firstName="Иван" lastName="Иванов">'+
								'<address streetAddress="Московское ш., 101, кв.101" city="Ленинград" postalCode="101101" />'+
								'<phoneNumbers>'+
									'<phoneNumber>812 123-1234</phoneNumber>'+
									'<phoneNumber>916 123-4567</phoneNumber>'+
								'</phoneNumbers>'+
							'</person>');
		assert.deepEqual(t, {
			"person": {
				"firstName": "Иван",
				"lastName": "Иванов",
				"address": {
					"streetAddress": "Московское ш., 101, кв.101",
					"city": "Ленинград",
					"postalCode": 101101
				},
				"phoneNumbers": ["812 123-1234","916 123-4567"]
			}
   		});
   		done();
	});*/
	it('should return right object for test3.5 with scheme', function(done){
		var t = x.makeJSON('<person firstName="Иван" lastName="Иванов">'+
								'<address streetAddress="Московское ш., 101, кв.101" city="Ленинград" postalCode="101101" />'+
								'<phoneNumbers>'+
									'<phoneNumber>812 123-1234</phoneNumber>'+
								'</phoneNumbers>'+
							'</person>',{"person": {"address": {}, "phoneNumbers": []}});
		
		assert.deepEqual(t, {
			"person": {
				"firstName": "Иван",
				"lastName": "Иванов",
				"address": {
					"streetAddress": "Московское ш., 101, кв.101",
					"city": "Ленинград",
					"postalCode": "101101"
				},
				"phoneNumbers": [
					"812 123-1234"
				]
			}
   		});
		done();
	});
	it('shoud return right object for test4 with scheme', function(done){
		var t = x.makeJSON('<glossary>'+
								'<title>example glossary</title>'+
								'<GlossDiv>'+
									'<title>S</title>'+
									'<GlossList>'+
										'<GlossEntry ID="SGML" SortAs="SGML">'+
											'<GlossTerm>Standard Generalized Markup Language</GlossTerm>'+
											'<Acronym>SGML</Acronym>'+
											'<Abbrev>ISO 8879:1986</Abbrev>'+
											'<GlossDef>'+
												'<para>A meta-markup language, used to create markup languages such as DocBook.</para>'+
												'<GlossSeeAlso>'+
													'<OtherTerm>GML</OtherTerm>'+
													'<OtherTerm>XML</OtherTerm>'+
												'</GlossSeeAlso>'+
											'</GlossDef>'+
											'<GlossSee>markup</GlossSee>'+
										'</GlossEntry>'+
									'</GlossList>'+
								'</GlossDiv>'+
							'</glossary>',{"glossary": {
												"title": "", 
												"GlossDiv": {
													"title": "", 
													"GlossList": {
														"GlossEntry": {
															"GlossTerm": "", 
															"Acronym": "",
															"Abbrev": "", 
															"GlossDef": {
																"para": "",
																"GlossSeeAlso": [
																]
															},
														"GlossSee": ""
														}
													}
												}
											}
										});
		assert.deepEqual(t,{
			"glossary": {
				"title": "example glossary",
				"GlossDiv": {
					"title": "S",
					"GlossList": {
						"GlossEntry": {
							"ID": "SGML",
							"SortAs": "SGML",
							"GlossTerm": "Standard Generalized Markup Language",
							"Acronym": "SGML",
							"Abbrev": "ISO 8879:1986",
							"GlossDef": {
								"para": "A meta-markup language, used to create markup languages such as DocBook.",
								"GlossSeeAlso": ["GML", "XML"]
							},
							"GlossSee": "markup"
						}
					}
				}
			}
		});
		done();
	});
	it('must return right object with test2.5 with scheme', function(done){
		var t = x.makeJSON('<recipe name="хлеб" preptime="5min" cooktime="180min">'+
								'<title>Простой хлеб</title>'+
								'<composition>'+
									'<ingredient amount="3" unit="стакан">Мука</ingredient>'+
									'<ingredient amount="0.25" unit="грамм">Дрожжи</ingredient>'+
									'<ingredient amount="1.5" unit="стакан">Тёплая вода</ingredient>'+
									'<ingredient amount="1" unit="чайная ложка">Соль</ingredient>'+
								'</composition>'+
								'<instructions>'+
									'<step>Смешать все ингредиенты и тщательно замесить.</step>'+
									'<step>Закрыть тканью и оставить на один час в тёплом помещении.</step>'+
									'<!-- <step>Почитать вчерашнюю газету.</step>- это сомнительный шаг...-->'+
									'<step>Замесить ещё раз, положить на противень и поставить в духовку.</step>'+
								'</instructions>'+
							'</recipe>',{
									"recipe":{
										"title":"",
										"composition":[
											{
												"ingredient":{}
											},
											{
												"ingredient":{}
											},
											{
												"ingredient":{}
											},
											{
												"ingredient":{}
											}
										],
										"instructions":[]
									}
								});
   		assert.deepEqual(t, {
   			"recipe": {
   				"name": "хлеб",
   				"preptime": "5min",
   				"cooktime": "180min",
   				"title": "Простой хлеб",
   				"composition": [
   					{
					"ingredient":{
   						"amount": "3",
	   					"unit": "стакан",
   						"text": "Мука"
   						}
   					},
   					{
					"ingredient":{
   						"amount": "0.25",
   						"unit": "грамм",
   						"text": "Дрожжи"
   						}
   					},
   					{
					"ingredient":{
   						"amount": "1.5",
   						"unit": "стакан",
   						"text": "Тёплая вода"
   						}
   					},
   					{
					"ingredient":{
   						"amount": "1",
   						"unit": "чайная ложка",
   						"text": "Соль"
   						}
   					}
   				],
   				"instructions": ["Смешать все ингредиенты и тщательно замесить.",
   							"Закрыть тканью и оставить на один час в тёплом помещении.",
   							"Замесить ещё раз, положить на противень и поставить в духовку."]
   			}
   		});
   		done();
	});
});

/*describe('readXML()',function(){
	it ('should work for empty file', function(done){
		var t = x.readXML('../test/test5.xml');
		assert.equal(t,'');
		done();
	});
	it('should work for test1.xml', function(done){
		var t = x.readXML('../test/test1.xml');
		assert.equal(t,'<person>'+
								'<firstName>Иван</firstName>'+
								'<lastName>Иванов</lastName>'+
								'<address>'+
									'<streetAddress>Московское ш., 101, кв.101</streetAddress>'+
									'<city>Ленинград</city>'+
									'<postalCode>101101</postalCode>'+
								'</address>'+
								'<phoneNumbers>'+
									'<phoneNumber>812 123-1234</phoneNumber>'+
									'<phoneNumber>916 123-4567</phoneNumber>'+
								'</phoneNumbers>'+
							'</person>');
		done();
	});
	it('should work for test2.xml',function(done){
		var t = x.readXML('../test/test2.xml');
		assert.equal(t,'<recipe name="хлеб" preptime="5min" cooktime="180min">'+
								'<title>Простой хлеб</title>'+
								'<composition>'+
									'<ingredient amount="3" unit="стакан">Мука</ingredient>'+
									'<ingredient amount="0.25" unit="грамм">Дрожжи</ingredient>'+
									'<ingredient amount="1.5" unit="стакан">Тёплая вода</ingredient>'+
									'<ingredient amount="1" unit="чайная ложка">Соль</ingredient>'+
								'</composition>'+
								'<instructions>'+
									'<step>Смешать все ингредиенты и тщательно замесить.</step>'+
									'<step>Закрыть тканью и оставить на один час в тёплом помещении.</step>'+
									'<!--<step>Почитать вчерашнюю газету.</step>- это сомнительный шаг... -->'+
									'<step>Замесить ещё раз, положить на противень и поставить в духовку.</step>'+
								'</instructions>'+
							'</recipe>');
		done();
	});
	it('should work for test3.xml',function(done){
		var t = x.readXML('../test/test3.xml');
		assert.equal(t,'<person firstName="Иван" lastName="Иванов">'+
								'<address streetAddress="Московское ш., 101, кв.101" city="Ленинград" postalCode="101101" />'+
								'<phoneNumbers>'+
									'<phoneNumber>812 123-1234</phoneNumber>'+
									'<phoneNumber>916 123-4567</phoneNumber>'+
								'</phoneNumbers>'+
							'</person>');
		done();
	});
	it('should work for test4.xml',function(done){
		var t = x.readXML('../test/test4.xml');
		assert.equal(t,'<glossary>'+
								'<title>example glossary</title>'+
								'<GlossDiv>'+
									'<title>S</title>'+
									'<GlossList>'+
										'<GlossEntry ID="SGML" SortAs="SGML">'+
											'<GlossTerm>Standard Generalized Markup Language</GlossTerm>'+
											'<Acronym>SGML</Acronym>'+
											'<Abbrev>ISO 8879:1986</Abbrev>'+
											'<GlossDef>'+
												'<para>A meta-markup language, used to create markup languages such as DocBook.</para>'+
												'<GlossSeeAlso>'+
													'<OtherTerm>GML</OtherTerm>'+
													'<OtherTerm>XML</OtherTerm>'+
												'</GlossSeeAlso>'+
											'</GlossDef>'+
											'<GlossSee>markup</GlossSee>'+
										'</GlossEntry>'+
									'</GlossList>'+
								'</GlossDiv>'+
							'</glossary>');
		done();
	});
});*/