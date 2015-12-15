#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5test.data"
while read -r downloadLink ext timex tr sr; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		echo $downloadLink
		echo $timex
		if [[ timex != "0" ]]
		then
			fn="/scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz"
			echo $fn
			if [ -e $fn ]
			then
				echo "exist"
				zcat $fn | grep '"' | nodejs --max_old_space_size=8192 lotus_v1.3.js $timex
				echo $downloadLink >> "done.txt"
				exit
			else
				echo $downloadLink >> "notexist.txt"
			fi
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
