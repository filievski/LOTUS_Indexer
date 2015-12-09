#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5s.data"
while read -r line; do
	if [[ $line == [$searchFor]* ]] ; then
		IFS=. read downloadLink ext <<< $line
		if [ -e "/scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz" ]
		then
			if ! grep "$line" done.txt > /dev/null
			then
				read -a arr <<< `grep "$downloadLink" document_epoch.tsv`
				if [ -z "$arr" ]; then
					timex=$arr[1]
				else
					timex=0
				fi
				zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz | grep '"' | nodejs --max_old_space_size=4000000 lotus_v1.2.js $timex
				echo $line >> "done.txt"
			fi
		else
			echo $line >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
