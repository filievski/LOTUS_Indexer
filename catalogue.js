#!/usr/bin/env node

var jsonfile = require('jsonfile');
var util = require('util');
var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
var docs=[];

docid=process.argv[2];

file = 'catalogue_' + docid + '.json';
jsonfile.readFile(file, function (err, data) {
	if (!data)
		data={};
	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var datatype = N3Util.getLiteralType(docobj);
			if (datatype in data){
				data[datatype]++;
			} else{
				data[datatype]=1;
			}
		} else {
			jsonfile.writeFile(file, data, function (err) {
			})
		}
	});
})
