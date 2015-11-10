#!/usr/bin/env node

var jsonfile = require('jsonfile');
var util = require('util');
var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var cld=require('cld');
var byline = require('byline');
var math=require('mathjs');
var stream = byline.createStream(process.stdin);
var docs=[];

docid=process.argv[2];

comp = 'compatibility_' + docid + '.json';
jsonfile.readFile(comp, function (err, data) {
	if (!data)
		data={};
	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var datatype = N3Util.getLiteralType(docobj);
			if (datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"){
				cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
					var newdoc={};
					if (result && result["languages"]["0"] && result["languages"]["0"]["code"]){
						var langtag=N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase();
						var compatible = (result["languages"]["0"]["code"]==langtag);
						var wordlog = parseInt(math.log(N3Util.getLiteralValue(docobj).split(' ').length, 2), 10);
						if (wordlog>100)
							wordlog=100;
						if (compatible){
							c="c";
						} else{
							c="i";
						}
						var wlogstr = wordlog.toString();
						if (data[langtag] && data[langtag][wlogstr] && data[langtag][wlogstr][c])
						{
							data[langtag][wlogstr][c]++;
						} else{
							if (data[langtag] && data[langtag][wlogstr]){
                                                        	data[langtag][wlogstr][c]=1;
							} else if (data[langtag]){
								data[langtag][wlogstr]={};
								data[langtag][wlogstr][c]=1;
							} else{
								data[langtag]={};
                                                                data[langtag][wlogstr]={};
                                                                data[langtag][wlogstr][c]=1;
							}
						}
					}
				});
			} 
		} else {
			jsonfile.writeFile(comp, data, function (err) {
			})
		}
	});
})
