#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var elasticsearch = require('es');
var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
var docs=[];
var bulksize = 50000;

var config = {
  // optional - when not supplied, defaults to the following:
  server : {
    host : 'localhost',
    port : 9200
  }
};

es = elasticsearch(config);

var options = {
  _index : 'lodl',
  _type : 'lodlindex',
  refresh: false,
  timeout: 900000
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
			logError("Error while bulk indexing: " + err + "\n");
//			process.exit(1);
		}
	});
}

var logToFiles = function(r) {
	fs.appendFile('logs.txt', (s*bulksize+r).toString() + "\t" + c.toString() + "\t" + nums.toString() + "\n", function (err){
	});
}

var logError = function(r) {
	fs.appendFile('errors.txt', r, function (err){
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
			var newdoc={"graph": doc["graph"], "subject": doc["subject"], "predicate": doc["predicate"], "lexform": litvalue, "lang": N3Util.getLiteralLanguage(docobj), "dtype": N3Util.getLiteralType(docobj)};
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
