curl -u $(cat .config) -X PUT https://lotus.lucy.surfsara.nl/lotus -d '{
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
        "number_of_replicas" : 1,
	"number_of_shards": 10,
        "refresh_interval": -1,
        "translog": {
            "flush_threshold_size": "4000mb"
        },
        "query": {
            "default_field":"string"
        }
    },
    "index" : {
        "merge": {
            "scheduler": {
                "max_thread_count": 16
            }
        },
        "number_of_replicas" : 1,
	"number_of_shards": 10,
        "refresh_interval": -1,
        "translog": {
            "flush_threshold_size": "4000mb"
        },
	"query": {
	    "default_field":"string"
	}
    }
    },
"mappings": {
    "lit" : {
                "_all": {
                    "enabled":  false
            	},
	      "properties" : {
			"docid" : {
			  "type" :    "string",
			  "index":    "not_analyzed"      
			},
		       "string" : {
			  "type" :    "string",
			  "index":    "analyzed"      
			},
                    	"langtag" : {
			  "type" :    "string",
			  "index":    "not_analyzed"      
			},
			"triple" : {
				"type": "object",
				"properties" : {
					"subject" : {
						"type" :    "string",
						"index":    "no"      
					},
				       "predicate" : {
						"type" :    "string",
						"index":    "no"      
					},
					"object" : {
						"type" :    "string",
						"index":    "no"      
					}
				}
      			}
    		}
  	}
}
}'
