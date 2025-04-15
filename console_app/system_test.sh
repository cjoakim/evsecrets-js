#!/bin/bash

# Bash script to test all of the evsecrets CLI functions.
#
# See package.json and note how the evsecrets library
# is aliased to the 'secrets' command with this line.
#         "secrets": "./node_modules/evsecrets/dist/index.js"
#
# Chris Joakim, 2025

echo '=========='
echo 'version:'
npm run secrets version

echo '=========='
echo 'init:'
npm run secrets init -- --verbose

echo '=========='
echo 'secrets:'
npm run secrets secrets

echo '=========='
echo 'files:'
npm run secrets files

echo '=========='
echo 'scan:'
npm run secrets scan 

echo '=========='
echo 'scan:'
npm run secrets scan  -- --verbose --tmp-file-outputs
