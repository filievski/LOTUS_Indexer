#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
while read -r downloadLink; do
  #      echo $downloadLink
        curl -q -o - $downloadLink | zcat | grep '"' | nodejs --max-old-space-size=8192 literals_in_es.js
	#curl -q -o - $downloadLink | zcat > /dev/null        
#	echo "done"
done < <( ./Frank/frank documents --downloadUri | grep -E "http://download\.lodlaundromat\.org/[$searchFor]" )
