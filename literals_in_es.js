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
var zpad = require('zpad');
var  byline = require('byline');
var stream = byline.createStream(process.stdin);
var docs=[];
var bulksize = 40000;

var options = {
  _index : 'lodspot',
  _type : 'lodtype'
}

var regex = /^[-\.,0-9]*$/;

var c=0;
var s=0;
var nums=0;
//console.time("dbsave");
parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		if (litvalue.match(regex))
			nums++;	
		var newdoc={"_id": zpad(c, 15), "graph": doc["graph"], "subject": doc["subject"], "predicate": doc["predicate"], "lexform": litvalue, "lang": N3Util.getLiteralLanguage(docobj), "dtype": N3Util.getLiteralType(docobj)};
		docs.push(newdoc);
		if (c==2000000){
			console.log("Numbers amount: ", nums)
			process.exit();
		}
		if ((++c) % bulksize==0){
			console.log(c);
			temp=docs;
			docs=[];
//			stream.pause();
			console.time("st");
			es.bulkIndex(options, temp, function (err, data) {
				if (!err){
					console.timeEnd("st");
					//if((++s)*bulksize >= 1000000){console.timeEnd("dbsave"); process.exit();}
				} else {
					console.log("Error while bulk inserting" + err);
					process.exit(1);
				}
//				stream.resume();
			});
		} 
	} /* else{
		es.bulkIndex(options, docs, function (err, data) {
			docs=[];
			if (!err){
				console.log("Stored", c);
			} else {
				console.log("Error while bulk inserting" + err);
				process.exit(1);
			}
		});
	} */
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
