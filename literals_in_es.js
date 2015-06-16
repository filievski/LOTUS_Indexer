#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
//var program = require('commander');
var request = require('request');

//program  
//  .version('1.0.0');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data) {  
//	console.log(data);
	if (data && data!=""){
		parser.parse(data,
		     function (error, triple, prefixes) {
			if (!error){
				if (triple && N3Util.isLiteral(triple.object)){
					request({ url: "http://localhost:9200/lodl", method: 'PUT', json: {"object": {"lang": N3Util.getLiteralLanguage(triple.object), "lexform": N3Util.getLiteralValue(triple.object), "dtype": N3Util.getLiteralType(triple.object)}, "subject": triple.subject, "predicate": triple.predicate, "graph": triple.graph}}, function(error, request, body){
				   		console.log("HELLO");
					});
				}
			}
			 else {
				console.log("NodeError: " + data + " " + error);
			}
		});
	}
});
