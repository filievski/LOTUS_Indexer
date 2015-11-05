var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

console.log(lngDetector.detect('Rutgerus Johannes Martinus "Ruud" van Nistelrooy (Dutch: Ruud van Nistelrooij; Dutch pronunciation: [ˈryt fɑn ˈnɪstəlroːi̯] (13px ); born 1 July 1976) is a retired Dutch footballer and current assistant manager for the Dutch National Football Team. He is the fourth-highest goalscorer in Champions League history with 56 goals.'));

