
1. Install Elastic Search & start it as a daemon: ./bin/elasticsearch -d
2. Install Marvel monitoring tool (optional, recommended for monitoring). Start the instance.
3. Clone the LOTUS_Indexer repo
4. Setup server settings (index settings, java memory, # open files)
⋅⋅1. export ES_HEAP_SIZE="16096M" (Java memory available -> 16GB)
⋅⋅2. export MAX_OPEN_FILES="41000" (Increase the maximum amount of open files in the file system)
⋅⋅3. Index settings (see & run file create_index.sh) - Make sure the settings here fit your system. Setup the amount of replicas and shards accordingly. In our current setup we use 1 replica and 10 shards (this creates20 shards in total = 10 for the index + 10 for the replica)
⋅⋅4. Edit the config file for some general bulk settings (some may overlap with the index creation settings)
5. Run indexer
6. Set refresh interval to default
7. Setup incrementality (make sure incremental_index.sh works)
8. Setup URI rooting if needed



Info: On 9/9/2015, LOTUS v2.0 contained 5,319,878,204 (5,32B), weighing in total 485.5 GB.
LOTUS v2.1 has size of 631GB.
