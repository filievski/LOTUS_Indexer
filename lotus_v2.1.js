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
var request=require('request');

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

var config = {
  // optional - when not supplied, defaults to the following:
  server : {
    host : 'lotus.lucy.surfsara.nl',
    port: 443,
    auth: "lotus:hsJh1v2F",
    secure: true
  }
};

es = elasticsearch(config);

var options = {
  _index : 'lotus2',
  _type : 'lit2',
  refresh: false,
  timeout: 900000
}

var c=0;
var s=0;

var docid= process.argv[2];
var timex=+ process.argv[3];
var termrichness=+ process.argv[4];
var semrichness=+ process.argv[5];

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
	fs.appendFile('logs.txt', (s*bulksize+r).toString() + "\t" + c.toString() + "\n", function (err){
	});
}

var logError = function(r) {
	fs.appendFile('errors.txt', r, function (err){
	});
}
var pendingRequests=0;
var finished=false;
var paused=false;
var blankNodePrefix="http://lodlaundromat.org/.well-known/genid/";
var minRequests=10;
var maxRequests=20;
parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		var datatype = N3Util.getLiteralType(docobj);
		if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(litvalue)){
			var langtag=N3Util.getLiteralLanguage(docobj);
			if (langtag=="") langtag="any"; 
			else langtag=langtag.substring(0,2).toLowerCase();
			
			// The api calls and indexing start here
			pendingRequests++;
			if (!paused && pendingRequests>maxRequests) { stream.pause(); paused=true; }
			request('http://index.lodlab.lod.labs.vu.nl/get/degrees/?key=' + encodeURIComponent('<' + doc['subject'] + '>') + '_indegree', function (errorin, responsein, bodyin) {
				request('http://index.lodlab.lod.labs.vu.nl/get/degrees/?key=' + encodeURIComponent('<' + doc['subject'] + '>') + '_outdegree', function (errorout, responseout, bodyout) {
					if (doc['subject'].indexOf(blankNodePrefix)>=0){
//					if (true) {
						if (!errorin && !errorout) { // && response.statusCode == 200) {
                                                        var indegree = + bodyin;
                                                        var outdegree = + bodyout;
							newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": langtag, "timestamp": timex, "r2d": 1, "degree": indegree+outdegree, "length": 1.0/litvalue.length };
							docs.push(newdoc);
							pendingRequests--;
							if ((++c) % bulksize==0){
                                                                console.log("stored " + c.toString());
								s++;
								processBulk(null);
							}  else if (pendingRequests==0 && finished){
                                                                console.log("Done");
								processBulk(function(){
									logToFiles(docs.length);
								});
							}
                                                        if (paused && pendingRequests<minRequests) { stream.resume(); paused=false; }
						} else {
                                                        logError(error + " " + errorin + " " + errorout + " " + doc['subject'] + '\n');
							pendingRequests--;
							if (pendingRequests==0 && finished){
                                                                console.log("Done");
                                                                processBulk(function(){
                                                                        logToFiles(docs.length);
                                                                });
                                                        }

						}
					} else {
 						request('http://index.lodlab.lod.labs.vu.nl/r2d/' + encodeURIComponent(doc['subject']) + '?size', function (error, response, body) {
							if (!error && !errorin && !errorout) { // && response.statusCode == 200) {
								var r2d= + body;
								var indegree = + bodyin;
								var outdegree = + bodyout;
								var newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": langtag, "timestamp": timex, "r2d": r2d, "degree": indegree+outdegree, "length": 1.0/litvalue.length };
								docs.push(newdoc);
								pendingRequests--;
								if ((++c) % bulksize==0){
									console.log("stored " + c.toString());
									s++;
									processBulk(null);
								}  else if (pendingRequests==0 && finished){
									processBulk(function(){
										logToFiles(docs.length);
									});
								} 
								if (paused && pendingRequests<minRequests) {  stream.resume(); paused=false; }
							} else {
								logError(error + " " + errorin + " " + errorout + " " + doc['subject'] + '\n');
								pendingRequests--;
								if (pendingRequests==0 && finished){
        	                                                        processBulk(function(){
                                                                        	logToFiles(docs.length);
                                                                });
                                                        }

							}
						});
					}
				});
			}); 
		} 
	} else {
		finished=true;
		if (pendingRequests==0){
			var remaining=docs.length;
			if (remaining){
				processBulk(function(){
					logToFiles(remaining);
				});
			}
		}
	}
});
