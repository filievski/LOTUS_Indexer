#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
#filename="md5_with_time.data"
filename="md5test.data"
while read -r downloadLink ext timex tr sr; do
	echo "$downloadLink"
	if [[ $downloadLink == [$searchFor]* ]] ; then
		fn="/ssd/lodlab/crawls/12/$downloadLink/clean.$ext.gz"
		echo $fn
		if [ -e $fn ]
		then
			echo $fn
			zcat $fn | grep '"' | nodejs --max_old_space_size=8192 lotus2.js $downloadLink $timex $tr $sr
			echo $sr
			echo $downloadLink >> "done.txt"
		else
			echo $downloadLink >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
