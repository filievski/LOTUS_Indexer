#! /bin/bash

curl -X DELETE 130.37.193.118:9200/lodspot

curl -X PUT 130.37.193.118:9200/lodspot -d '{
"settings": {
    "index" : {
        "merge": {
	    "scheduler": {
		"max_thread_count": 1
	    }
	},
	"number_of_shards": 3,
	"number_of_replicas" : 0,
        "refresh_interval": -1,
	"translog": {
	    "flush_threshold_size": "2000mb"
	}
    }
    },
"mappings": {
    "lodtype" : {
      "properties" : {
        "graph" : {
          "type" :    "string",
          "index":    "not_analyzed"      
	},
       "subject" : {
          "type" :    "string",
          "index":    "not_analyzed"      
	},
       "predicate" : {
          "type" :    "string",
     	  "index":    "not_analyzed"      
	},
       "lexform" : {
          "type" :    "string",
          "index":    "analyzed"      
	},
       "dtype" : {
          "type" :    "string",
          "index":    "not_analyzed"      
	},
       "lang" : {
          "type" :    "string",
          "index":    "analyzed"      
	}
        }
      }
    }
  }'

rm logs.txt
echo -e "Stored\tRead\tNumbers\n" > logs.txt

