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

echo '=========='
echo 'init :'
rm evsecrets.json
npm run secrets init  -- --verbose


# The following line is intentional, it contains the public value of the
# Cosmos DB local emulator, in my system as env var AZURE_COSMOSDB_EMULATOR_KEY.
# This secret value will be identified with a 'scan' function.
# Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
