#!/bin/bash

./lang_setup_stuff.sh

./lang_test.sh 89abcdef &
./lang_test.sh 01234567 &
