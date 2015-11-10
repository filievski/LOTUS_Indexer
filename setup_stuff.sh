#! /bin/bash

curl -u lotus:$(cat .password-file) -X DELETE https://lotus.lucy.surfsara.nl/lotus
#export ES_HEAP_SIZE="16096M"
#export MAX_OPEN_FILES="41000"

./create_index_v2.1.sh

rm md5.txt
rm errors.txt
rm logs.txt
echo -e "Stored\tRead\tNumbers\n" > logs.txt
