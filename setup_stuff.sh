#! /bin/bash

curl -X DELETE http://localhost:9200/laundrospot
curl -X DELETE http://localhost:9200/lotus

#export ES_HEAP_SIZE="16096M"
#export MAX_OPEN_FILES="41000"

./create_index.sh

rm md5.txt
rm errors.txt
rm logs.txt
echo -e "Stored\tRead\tNumbers\n" > logs.txt
