require('cld').detect('This is a language recognition example', function(err, result) {
  console.log(result["languages"]["0"]["code"]);
});
