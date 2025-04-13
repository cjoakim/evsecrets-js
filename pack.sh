#!/bin/bash

# Bash script to compile, test, and pack this npm package.
#
# Chris Joakim, 2025

rm  *.tgz

npm run build

npm run test

rm  dist/*test*

npm pack