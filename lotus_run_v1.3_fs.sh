#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5_with_time.data"
while read -r line; do
	if [[ $line == [$searchFor]* ]] ; then
		IFS=' ' read downloadLink ext timex <<< $line
		if [ -e "/scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz" ]
		then
			zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz | grep '"' | nodejs --max_old_space_size=8000000 lotus_v1.3.js $timex
			echo $line >> "done.txt"
		else
			echo $line >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
