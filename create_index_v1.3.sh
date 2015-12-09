curl -u lotus:$(cat .password-file) -X PUT https://lotus.lucy.surfsara.nl/lotus -d '{
"settings": {
    "transient" : {
        "indices.store.throttle.type" : "none" 
    },
    "bulk" : {
        "number_of_replicas" : 1,
	"number_of_shards": 15,
        "refresh_interval": -1,
        "translog": {
            "flush_threshold_size": "4000mb"
        },
        "query": {
            "default_field":"_all"
        }
    },
    "index" : {
        "number_of_replicas" : 1,
	"number_of_shards": 15,
        "refresh_interval": -1,
        "translog": {
            "flush_threshold_size": "4000mb"
        },
	"query": {
	    "default_field":"_all"
	}
    }
    },
"mappings": {
    "lit" : {
                "_all": {
                    "enabled":  true
            	},
	      "properties" : {
		        "subject" : {
			  "type" :    "string",
			  "index":    "analyzed"      
			},
                        "predicate" : {
                          "type" :    "string",
                          "index":    "analyzed"      
                        },
                        "string" : {
                          "type" :    "string",
                          "index":    "analyzed"      
                        },
                    	"langtag" : {
			  "type" :    "string",
			  "index":    "not_analyzed"      
			},
			"timestamp" : {
				"type": "integer"
      			}
    		}
  	}
}
}'
