#! /bin/bash
x=/ssd/lodlab/crawls/12/827d21acc04323962e99aa3dda744337/clean.nt.gz
if [ -e $x ]
then
       zcat $x | grep '"' | nodejs --max_old_space_size=8000000 lotus_v1.3.js 10000
else
        echo "no no"
fi
