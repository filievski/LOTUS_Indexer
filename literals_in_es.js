#!/usr/bin/env node

//var request = require('request');
//var uuid = require('node-uuid');
//var trim = require('trim');
//var fs = require('fs');

// Readline interface for reading statements line by line
/*
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
*/

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var elasticsearch = require('es'),
  es = elasticsearch();
var  byline = require('byline');
var stream = byline.createStream(process.stdin);
var c=0, docs=[];
var bulksize = 5;

var options = {
  _index : 'ltest',
  _type : 'data'
}

parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		oldobject=doc['object'];
		doc['object']={"lang": N3Util.getLiteralLanguage(oldobject), "lexform": N3Util.getLiteralValue(oldobject), "dtype": N3Util.getLiteralType(oldobject)};
		docs.push(doc);
		if (++c>=bulksize){
			c=0;
			es.bulkIndex(options, docs, function (err, data) {
				docs=[];
				if (!err){
					console.log("Stored");
				} else {
					console.log("Error while bulk inserting");
				}
			});
		} 
	} else{
		es.bulkIndex(options, docs, function (err, data) {
			docs=[];
			if (!err){
				console.log("Stored");
			} else {
				console.log("Error while bulk inserting");
			}
		});
	}

});
/*
var rdfStream = rl;
rdfStream.pipe(parser);
//streamParser.pipe(new SlowConsumer());

// Read line by line, parse triple/quad with N3 and store it in elasticsearch
rl.on('line', function(line){
	N3.Parser().parse(line,	
	function (error, triple, prefixes) {
		if (triple && N3Util.isLiteral(triple.object)){
//				esjson=JSON.stringify({"object": {"lang": N3Util.getLiteralLanguage(triple.object), "lexform": N3Util.getLiteralValue(triple.object), "dtype": N3Util.getLiteralType(triple.object)}, "subject": triple.subject, "predicate": triple.predicate, "graph": triple.graph});
			request({ url: "http://localhost:9200/lodlit/data/" + uuid.v4(), method: 'PUT', json: {"obj": {"lang": N3Util.getLiteralLanguage(triple.object), "lexform": N3Util.getLiteralValue(triple.object), "dtype": N3Util.getLiteralType(triple.object)}, "subject": triple.subject, "predicate": triple.predicate, "graph": triple.graph}}, function(error, request, body){
				if (error)
					console.log("Insertion error: " + error);
			});
		
		}
		else {
			if (error){
				console.log(error);
			}
		}
	});
});
*/
