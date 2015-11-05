#!/usr/bin/env node

var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');

combineddata={};
addon = ['0123', '4567', '89ab', 'cdef'];
for (var i = 0; i < 4; ) {
	file = 'catalogue_' + addon[i] + '.json';
	jsonfile.readFile(file, function (err, data) {
		if (!combineddata)
			combineddata=data;
		var datalength = data.length;
		var cnt =0;
		console.log(datalength, cnt, i);
		for (var attrkey in data){
			if (attrkey in combineddata){
				combineddata[attrkey] += data[attrkey];
			} else{
				combineddata[attrkey] = data[attrkey];
			}
			if (++cnt==datalength){
				if (++i==4){	
					jsonfile.writeFile('combined.json', combineddata, function (err) {
					})
				}
			}
		}
	})

}

