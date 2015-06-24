#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var elasticsearch = require('es'),
  es = elasticsearch();
var fs = require('fs');
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

var processBulk = function(callback) {
	temp=docs;
	docs=[];
	es.bulkIndex(options, temp, function (err, data) {
		if (!err){
			if (callback)
				callback();
		} else {
			console.log("Error while bulk inserting" + err);
			process.exit(1);
		}
	});
}

var logToFiles = function(r) {
	fs.appendFile('logs.txt', (s*bulksize+r).toString() + "\t" + c.toString() + "\t" + nums.toString() + "\n", function (err){
	});
}

//stream.on('end', function(){
//});


parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		if (litvalue.match(regex))
			nums++;	
		else {
			var newdoc={"_id": zpad(c, 15), "graph": doc["graph"], "subject": doc["subject"], "predicate": doc["predicate"], "lexform": litvalue, "lang": N3Util.getLiteralLanguage(docobj), "dtype": N3Util.getLiteralType(docobj)};
			docs.push(newdoc);
			if ((++c) % bulksize==0){
				s++;
				processBulk(null);
			} 
		}
	} else {
		var remaining=docs.length;
		if (remaining){
			processBulk(function(){
				logToFiles(remaining);
			});
		}

	}
});
