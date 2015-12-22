curl -u lotus:$(cat .password-file) -X PUT https://lotus.lucy.surfsara.nl/lotus1 -d '{
"settings": {
    "transient" : {
        "indices.store.throttle.type" : "none" 
    },
    "bulk" : {
        "number_of_replicas" : 1,
	"number_of_shards": 5,
        "refresh_interval": -1,
        "translog": {
            "flush_threshold_size": "4000mb"
        },
        "query": {
            "default_field":"string"
        }
    },
    "index" : {
        "number_of_replicas" : 1,
	"number_of_shards": 5,
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
    "lit1" : {
                "_all": {
                    "enabled":  false
            	},
	      "properties" : {
		        "subject" : {
			  "type" :    "string",
			  "index":    "no"      
			},
                        "predicate" : {
                          "type" :    "string",
                          "index":    "no"      
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
      			},
			"r2d": {
				"type": "integer"
			},
			"length": {
				"type": "float"
			}
    		}
  	}
}
}'
