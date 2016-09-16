# LOTUS: Linked Open Text Unleashed
The indexing scripts of LOTUS, an award-winning full-text index to the LOD Laundromat, and the largest available LOD index today.

This module was developed at VU University Amsterdam, as a collaboration between CLTL and the Knowledge Representation & Reasoning departments.

##How to Create LOTUS index (this procedure roughly stays the same, but until we clean the instructions, please get in touch if you are interested in creating your own LOTUS index)

1. Install Elastic Search & start it as a daemon: ./bin/elasticsearch -d
2. Install Marvel monitoring tool (optional, recommended for monitoring). Start the instance.
3. Clone the LOTUS_Indexer repo
4. Setup server settings (index settings, java memory, # open files)
  1. export ES_HEAP_SIZE="16096M" (Java memory available -> 16GB)
  2. export MAX_OPEN_FILES="41000" (Increase the maximum amount of open files in the file system)
  3. Index settings (see & run file create_index.sh) - Make sure the settings here fit your system. Setup the amount of replicas and shards accordingly. In our current setup we use 1 replica and 10 shards (this creates20 shards in total = 10 for the index + 10 for the replica)
  4. Edit the config file for some general bulk settings (some may overlap with the index creation settings)
5. Run indexer
6. Set refresh interval to default
7. Setup incrementality (make sure incremental_index.sh works)
8. Setup URI rooting if needed



**Info:**
  * On 9/9/2015, LOTUS v1.0 contained 5,319,878,204 (5,32B), weighing in total 485.5 GB.  
  * LOTUS v1.2 has size of 631GB.

##Additional materials

 Video from ESWC 2016's presentation on LOTUS http://videolectures.net/eswc2016_ilievski_linked_data/

Research paper from ESWC 2016
http://link.springer.com/chapter/10.1007\%2F978-3-319-34129-3_29

Slides from ESWC 2016's presentation on LOTUS
http://www.slideshare.net/FilipIlievski1/lotus-adaptive-text-search-for-big-linked-data
  
Workshop paper from the ISWC 2015 COLD Workshop
http://ceur-ws.org/Vol-1426/paper-06.pdf

##Awards

The LOTUS Semantic Search engine was awarded the 2nd place in the European Linked Open Data Competition 2016 (http://2016.semantics.cc/eldc).

##Contact
Filip Ilievski (f.ilievski@vu.nl)
