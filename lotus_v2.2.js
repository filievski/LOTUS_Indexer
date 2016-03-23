#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var elasticsearch = require('es');
var fs = require('fs');
var byline = require('byline');
var url=require('url');
var stream = byline.createStream(process.stdin);
var docs=[];
var bulksize = 50000;
var category = require('unicode-7.0.0/categories');
var cld=require('cld');

var isNLS = function(s1){
        var consecutive=0
	if (s1.length<2) return false;
        for (var i = 0, len=s1.length; i<len; i++) {
                if(category[ s1.charCodeAt(i) ][0]=="L") {
                        if (++consecutive==2) return true;
                } else {
                        consecutive=0;
                }
                if (i==len-1) return false;
        }
}

var configurationFile = 'config.json';

var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

var config = {
  // optional - when not supplied, defaults to the following:
  server : {
    host : 'lotus.lucy.surfsara.nl',
    port: 443,
    auth: configuration.auth,
    secure: true
  }
};

es = elasticsearch(config);

var options = {
  _index : 'lotus22',
  _type : 'lit22',
  refresh: false,
  timeout: 900000
}

var c=0;
var s=0;
var nums=0;

var docid= process.argv[2];
var timex=+ process.argv[3];
var termrichness=+ process.argv[4];
var semrichness=+ process.argv[5];
var degree=1;
var r2d=1;

var processBulk = function(callback) {
	temp=docs;
	docs=[];
	es.bulkIndex(options, temp, function (err, data) {
		if (!err || !err["errors"]){
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

parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		var datatype = N3Util.getLiteralType(docobj);
		if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(litvalue)){
			var langtag=N3Util.getLiteralLanguage(docobj);
			if (langtag=="") 
			{
				cld.detect(litvalue, function(err, result) {
					var newdoc={};
					if (result && result["languages"]["0"] && result["languages"]["0"]["code"]){
						newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": "a_" + result["languages"]["0"]["code"].substring(0,2).toLowerCase(), "docid": docid, "timestamp": timex, "tr": termrichness, "sr": semrichness, "length": 1.0/litvalue.length, "r2d": r2d, "degree": degree};
					} else{
						newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": "any", "docid": docid, "timestamp": timex, "tr": termrichness, "sr": semrichness, "length": 1.0/litvalue.length, "r2d": r2d, "degree": degree};
					}
					docs.push(newdoc);
					if ((++c) % bulksize==0){
						s++;
						processBulk(null);
					}
				});
			}
			else {
				langtag=langtag.substring(0,2).toLowerCase();
				var newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": "u_" + langtag, "docid": docid, "timestamp": timex, "tr": termrichness, "sr": semrichness, "length": 1.0/litvalue.length, "r2d": r2d, "degree": degree};
				docs.push(newdoc);
				if ((++c) % bulksize==0){
					s++;
					processBulk(null);
				}
			}
		} else
			nums++;
	} else {
		var remaining=docs.length;
		if (remaining){
			processBulk(function(){
				logToFiles(remaining);
			});
		}
	}
});
