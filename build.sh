#!/bin/bash

# Bash script to compile and unit-test this app.
#
# Chris Joakim, 2025

rm tmp/*.*

npm run build

npm run test
