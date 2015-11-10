#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
while read -r downloadLink; do
  #      echo $downloadLink
	docid=${downloadLink##*/}
        curl -q -o - $downloadLink | zcat | grep '"' | nodejs lotus_v2.1.js $docid
	#curl -q -o - $downloadLink | zcat > /dev/null        
#	echo "done"
done < <( ./Frank/frank documents --downloadUri | grep -E "http://download\.lodlaundromat\.org/[$searchFor]" )
