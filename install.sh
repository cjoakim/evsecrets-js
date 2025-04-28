#!/bin/bash

# Bash script to install and list the npm packages for this app.
#
# Chris Joakim, 2025

rm -rf node_modules

rm package-lock.json

mkdir -p ./tmp

npm install

npm list
