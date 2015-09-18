curl -X PUT http://localhost:9200/laundrospot -d '{
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
        "number_of_replicas" : 0,
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
    "lst" : {
                "_all": {
                    "enabled":  false
            },{
	        "_source": {
		    "enabled": false
	      }
	    },
      "properties" : {
        "docid" : {
          "type" :    "string",
          "index":    "not_analyzed"      
        },
       "subject" : {
          "type" :    "string",
          "index":    "not_analyzed"      
        },
       "kbase" : {
          "type" :    "string",
          "index":    "not_analyzed"      
        },
       "predicate" : {
          "type" :    "string",
          "index":    "not_analyzed"      
        },
       "string" : {
          "type" :    "string",
          "index":    "analyzed"      
        },
       "langtag" : {
          "type" :    "string",
          "index":    "analyzed"      
        }
        }
      }
    }
  }'
