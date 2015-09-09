
1. Install Elastic Search & start it as a daemon: ./bin/elasticsearch -d
2. Install Marvel monitoring tool (optional, recommended for monitoring). Start the instance.
3. Clone the LOTUS_Indexer repo
4. Setup server settings (index settings, java memory, # open files)
4.1. export ES_HEAP_SIZE="16096M" (Java memory available -> 16GB)
 4.2. export MAX_OPEN_FILES="41000" (Increase the maximum amount of open files in the file system)
 4.3. Index settings (see & run file create_index.sh)
 4.4. Edit the config file for some general bulk settings (some may overlap with the index creation settings)
5. Make sure nodejs is installed, as well as all needed modules
6. Clone Frank inside the LOTUS Indexer repository
7. Run indexer
8. Increase nr. replicas to 1, refresh interval to default
