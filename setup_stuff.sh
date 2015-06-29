#! /bin/bash

curl -X DELETE http://localhost:9200/lodl

curl -X PUT http://localhost:9200/lodl -d '{
"settings": {
    "transient" : {
        "indices.store.throttle.type" : "none" 
    },
    "bulk" : {
	"merge": {
	    "scheduler": {
		"max_thread_count": 16
	    }
	},
	"number_of_replicas" : 0,
        "refresh_interval": -1,
	"translog": {
	    "flush_threshold_size": "4000mb"
	}
    },
    "index" : {
        "merge": {
            "scheduler": {
                "max_thread_count": 16
            }
        },
        "number_of_replicas" : 0,
        "refresh_interval": -1,
        "translog": {
            "flush_threshold_size": "4000mb"
        }
    }
    },
"mappings": {
    "lodlindex" : {
	    "_all": {
                "enabled":  false
            },
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

