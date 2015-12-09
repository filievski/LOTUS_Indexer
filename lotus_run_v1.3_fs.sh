#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5_with_time.data"
while read -r line; do
	if [[ $line == [$searchFor]* ]] ; then
		IFS=' ' read downloadLink ext timex <<< $line
		echo $downloadLink
		echo $ext
		echo $timex
		if [ -e "/scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz" ]
		then
			if ! grep "$line" done.txt > /dev/null
			then
				zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz | grep '"' | nodejs --max_old_space_size=4000000 lotus_v1.3.js $timex
				echo $line >> "done.txt"
			fi
		else
			echo $line >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
