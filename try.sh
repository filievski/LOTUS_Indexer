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
			if ! grep "$line" done.txt > /dev/null
			then
				zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz | grep '"' | { read first rest ; echo $first ;}
				echo $line >> "done.txt"
			fi
		else
			echo $line >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
