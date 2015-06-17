#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var request = require('request');

// Readline interface for reading statements line by line
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Read line by line, parse triple/quad with N3 and store it in elasticsearch
rl.on('line', function(line){
	parser.parse(line,
	     function (error, triple, prefixes) {
		if (!error){
			if (triple && N3Util.isLiteral(triple.object)){
				request({ url: "http://localhost:9200/lodl/data", method: 'POST', json: {"object": {"lang": N3Util.getLiteralLanguage(triple.object), "lexform": N3Util.getLiteralValue(triple.object), "dtype": N3Util.getLiteralType(triple.object)}, "subject": triple.subject, "predicate": triple.predicate, "graph": triple.graph}}, function(error, request, body){
					if (error)
						console.log("Insertion error: " + error);
				});
			}
		}
		 else {
			console.log("Parsing triple error: " + line + " " + error);
		}
	});
});
