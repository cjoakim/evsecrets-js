#!/bin/bash

# Bash script to install and list the npm packages for this app.
#
# Chris Joakim, 2025

rm package-lock.json

rm -rf node_modules

mkdir -p ./tmp

npm install

npm list
