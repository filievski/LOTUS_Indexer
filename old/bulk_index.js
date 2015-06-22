#!/usr/bin/env node

// Readline interface for reading statements line by line
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var elasticsearch = require('es'),
  es = elasticsearch();

var N3 = require('n3');
var N3Util = N3.Util;
//var parser = N3.Parser();

var options = {
  _index : 'lodtest',
  _type : 'data'
}

var c=0;
var tostore=[];
// Read line by line, parse triple/quad with N3 and store it in elasticsearch
rl.on('line', function(line){
        N3.Parser().parse(line,
        function (error, triple, prefixes) {
                if (triple && N3Util.isLiteral(triple.object)){
			tostore.push({"obj": {"lang": N3Util.getLiteralLanguage(triple.object), "lexform": N3Util.getLiteralValue(triple.object), "dtype": N3Util.getLiteralType(triple.object)}, "subject": triple.subject, "predicate": triple.predicate, "graph": triple.graph});
			if (++c==10000){
				es.bulkIndex(options, documents, function (err, data) {
					console.log("Stored");
					tostore=[];
				});
			}
                }
                else {
                        if (error){
                                console.log(error);
                        }
                }
        });
});
