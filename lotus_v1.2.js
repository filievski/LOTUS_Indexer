#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var elasticsearch = require('es');
var fs = require('fs');
var byline = require('byline');
var cld=require('cld');
var url=require('url');
var stream = byline.createStream(process.stdin);
var docs=[];
var bulksize = 50000;
var configurationFile = 'config.json';
var category = require('unicode-7.0.0/categories');

var isNLS = function(s){
        var consecutive=0
	if (s.length<2) return false;
        for (var i = 0, len=s.length; i<len; i++) {
                if(category[ s.charCodeAt(i) ][0]=="L") {
                        if (++consecutive==2) return true;
                } else {
                        consecutive=0;
                }
                if (i==len-1) return false;
        }
}

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
  _index : 'lotus',
  _type : 'lit',
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

var logMd5 = function() {
	fs.appendFile('done.txt', docid + "\n", function (err){
	});
}

var logError = function(r) {
	fs.appendFile('errors.txt', r, function (err){
	});
}

var uriToString = function(s){
	return s.replace(/\W+/g, " ").replace("_", " ");
}

docid=process.argv[2];

parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		delete doc["graph"];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		var datatype = N3Util.getLiteralType(docobj);
		if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(litvalue)){
			var langtag=N3Util.getLiteralLanguage(docobj);
			var pred =  uriToString(doc["predicate"]);
			//if (subject.lastIndexOf("http://lodlaundromat.org/.well-known/genid/", 0)==-1){ // skip blank nodes
			var sub = uriToString(doc["subject"]);
			//}
			if (langtag==""){
				cld.detect(litvalue, function(err, result) {
					var newdoc={};
					if (result && result["languages"]["0"] && result["languages"]["0"]["code"]){
						newdoc={"triple": doc, "s": sub, "p": pred, "o": litvalue, "langtag": result["languages"]["0"]["code"].substring(0,2).toLowerCase()};
					} else{
						newdoc={"triple": doc, "s": sub, "p": pred, "o": litvalue, "langtag": "any"};
					}
					docs.push(newdoc);
					if ((++c) % bulksize==0){
						s++;
						processBulk(null);
					}
				});
			} else{
				var newdoc={"triple": doc, "s": sub, "p": pred, "o": litvalue, "langtag": langtag.substring(0,2).toLowerCase()};
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
				logMd5();
			});
		} else logMd5();
	}
});
