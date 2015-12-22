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
var configurationFile = 'config.json';
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
  _index : 'lotus1',
  _type : 'lit1',
  refresh: false,
  timeout: 900000
}

var c=0;
var s=0;
var nums=0;

var timex=+ process.argv[2];

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

var uriToString = function(s1){
	return s1.replace(/\W+/g, " ");
}


var newdoc={};
var previous='';
var prevSize=0;
var pendingRequests=0;
var finished=false;
var blankNodePrefix="http://lodlaundromat.org/.well-known/genid/";
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
			if (doc['subject']==previous){
				newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": langtag, "timestamp": timex, "r2d": prevSize, "length": 1.0/litvalue.length };
                                docs.push(newdoc);
                                if ((++c) % bulksize==0){
                                        s++;
                                        processBulk(null);
                                } else if (pendingRequests==0 && finished){
                                        processBulk(function(){
                                                logToFiles(docs.length);
                                        });
                                }
			} else if (doc['subject'].indexOf(blankNodePrefix)>=0){
				prevSize=1;
				previous=doc['subject'];
				newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": langtag, "timestamp": timex, "r2d": 1, "length": 1.0/litvalue.length };
                                docs.push(newdoc);
                                if ((++c) % bulksize==0){
                                        s++;
                                        processBulk(null);
                                }  else if (pendingRequests==0 && finished){
                                        processBulk(function(){
                                                logToFiles(docs.length);
                                        });
                                }
			} else {
				pendingRequests++;
				request('http://index.lodlaundromat.org/r2d/' + encodeURIComponent(doc['subject']) + '?size', function (error, response, body) {
					var r2d=0;
					console.log(error);
					console.log(response.statusCode);
					if (!error && response.statusCode == 200) {
						r2d=JSON.parse(body).size;
						previous=doc["subject"];
						prevSize=r2d;
						var newdoc={"subject": doc["subject"], "predicate": doc["predicate"], "string": litvalue, "langtag": langtag, "timestamp": timex, "r2d": r2d, "length": 1.0/litvalue.length };
						docs.push(newdoc);
						pendingRequests--;
						if ((++c) % bulksize==0){
							s++;
							processBulk(null);
						} else {
							if (pendingRequests==0 && finished){
								processBulk(function(){
									logToFiles(remaining);
								});
							}  else if (pendingRequests==0 && finished){
								processBulk(function(){
									logToFiles(docs.length);
								});
							}
						}
					} else
						logError(doc['subject'] + '\n');
			       })
			}

		} else
			nums++;
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
