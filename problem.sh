#! /bin/bash
fn="test.txt"
s=0
	x="/scratch/lodlab/crawls/12/e53ca5ac2b71687c09433aeb23763335/clean.nt.gz"
	if [ -e $x ]
	then
		zcat $x | grep '"' | nodejs --max_old_space_size=8192 lotus_v2.1.js 0 
#$downloadLink $timex $tr $sr
	fi
