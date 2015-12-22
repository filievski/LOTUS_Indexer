#! /bin/bash
fn="test.txt"
s=0
while read -r md5; do
	x="/scratch/lodlab/crawls/12/$md5/clean.nt.gz"
	if [ -e $x ]
	then
		echo "$x"
		c=`zcat $x | grep '"' | wc -l`
		echo "$c"
	fi
done < "$fn"
print "$s"
