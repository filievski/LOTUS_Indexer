#! /bin/bash

./frank statements | grep '\"*\"\|\"*\"^^xsd:*\|\"*\"\@*' | nodejs literals_in_es.js
