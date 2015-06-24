#!/bin/bash

./setup_stuff.sh

./frank_documents_new.sh abcd &
./frank_documents_new.sh efgh &
./frank_documents_new.sh ijkl &
./frank_documents_new.sh mnop &
./frank_documents_new.sh qrstu &
./frank_documents_new.sh vwxyz &

./frank_documents_new.sh 01234 &
./frank_documents_new.sh 56789 &
