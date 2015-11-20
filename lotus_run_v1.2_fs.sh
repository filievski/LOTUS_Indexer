#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5s.data"
while read -r downloadLink; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		docid=${downloadLink##*/}
		zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.*.gz | grep '"' | nodejs lotus_v1.2.js $docid
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
