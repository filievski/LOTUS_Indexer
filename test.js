var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();

var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
var cld=require('cld');

var regex = /^[-\.,0-9]*$/;
var nums=0;
var def=0, undef=0;
var undef_solved=0, undef_unsolved=0, def_unsolved=0, def_solved_good=0, def_solved_bad=0;
docid=process.argv[2];
parser.parse(stream, function(){
        if (arguments['1']) {
                var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		if (litvalue.match(regex))
			nums++;
		else { 
			if (N3Util.getLiteralLanguage(docobj)){ //Defined
				def++;
                                cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
					if (!result || !result["languages"]["0"])
						def_unsolved++;
					else{
						if (result["languages"]["0"]["code"]==N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase())
							def_solved_good++;
						else
							def_solved_bad++;
					}
				});
			} else {
				cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
					undef++;
					if (result){
						undef_solved++;
					} else {
						undef_unsolved++;
					}
				});
			}
		}
	} else{
		fs.appendFile('lang_logs.txt', def.toString() + "\t" + def_solved_good.toString() + "\t" + def_solved_bad.toString() + "\t" + def_unsolved.toString() + "\t" + undef.toString() + "\t" + undef_solved.toString() + "\t" + undef_unsolved.toString() + "\n", function (err){
		});
	//	console.log("End of file: Solved, unsolved, defined...");
	//	console.log(solved);
	//	console.log(unsolved);
	//	console.log(defined);
	}
});

console.log(docid);

//cld.detect('', function(err, result) {
//  console.log(result);
//});
