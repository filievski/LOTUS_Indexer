#!/bin/bash

./frank statements | grep '"' |  nodejs --max-old-space-size=8192 literals_in_es.js | xargs -p curl -XPOST http://localhost:9200/laundry/data -d 
