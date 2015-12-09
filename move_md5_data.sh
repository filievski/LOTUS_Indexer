#! /bin/bash
filename="md5s.data"
while read -r line; do
	IFS=. read downloadLink ext <<< $line
	if [ -e "/scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz" ]
	then
		read -a arr <<< `grep "$downloadLink" document_epoch.tsv`
		if [ -z "$arr" ]; then
			timex=0
		else
			timex=${arr[1]}
		fi
		echo "$downloadLink $ext $timex" >> "md5_with_time.data"
	else
		echo $line >> "notexist.txt"
	fi
done < "$filename"
