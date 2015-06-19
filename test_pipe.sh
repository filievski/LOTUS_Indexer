#! /bin/bash

curl -q -o - http://download.lodlaundromat.org/85d5a476b56fde200e770cefa0e5033c | zcat | grep '"' | nodejs --max-old-space-size=8192 literals_in_es.js 
