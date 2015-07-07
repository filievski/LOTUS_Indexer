downloadLink=$1
docid=${downloadLink##*/}
curl -q -o - $downloadLink | zcat | grep '"' | nodejs literals_in_es.js $docid
