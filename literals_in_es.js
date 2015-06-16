var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();

 
//process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data) {  
	parser.parse(data,
             function (error, triple, prefixes) {
        	if (!error){
			if (triple && N3Util.isLiteral(triple.object))
				jsontje={"object": {"lang": N3Util.getLiteralLanguage(triple.object), "lexform": N3Util.getLiteralValue(triple.object), "dtype": N3Util.getLiteralType(triple.object)}, "subject": triple.subject, "predicate": triple.predicate, "graph": triple.graph};
		} else {
			console.log("NodeError: " + error);
		}
        });
});
