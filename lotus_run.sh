#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
#filename="md5_with_time.data"
filename="document_epoch.tsv"
while read -r downloadLink ext timex tr sr; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		fn="/scratch/lodlab/crawls/12/$downloadLink/clean.$ext.gz"
		if [ -e $fn ]
		then
			zcat $fn | grep '"' | nodejs --max_old_space_size=8192 lotus_v2.1.js $downloadLink $timex $tr $sr
			echo $downloadLink >> "done.txt"
		else
			echo $downloadLink >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
