
1. Install Elastic Search
2. Install Marvel monitoring tool (optional, recommended for monitoring)
3. Clone the LOTUS_Indexer repo
4. Setup server settings (index settings, java memory, # open files)
* export ES_HEAP_SIZE="16096M" (Java memory available -> 16GB)
* export MAX_OPEN_FILES="41000" (Increase the maximum amount of open files in the file system)
* Index settings (see & run file create_index.sh)
5. Run indexer
6. Increase nr. replicas to 1, refresh interval to default
