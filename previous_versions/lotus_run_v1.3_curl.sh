#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi

filename="md5_with_time.data"
while read -r line; do
	if [[ $line == [$searchFor]* ]] ; then
		IFS=' ' read downloadLink ext timex <<< $line
		fn="http://download.lodlaundromat.org/$downloadLink"
        	curl -q -o - $fn | zcat | grep '"' | nodejs --max_old_space_size=8192 lotus_v1.3.js $timex $docid
	fi
done < "$filename"
