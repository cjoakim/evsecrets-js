#!/bin/bash

# Bash script to test all of the evsecrets CLI functions.
#
# See package.json and note how the evsecrets library
# is aliased to the 'secrets' command with this line.
#         "secrets": "./node_modules/evsecrets/dist/index.js"
#
# Chris Joakim, 2025

cp ../example_dot_env .env

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
rm .evsecrets.json
npm run secrets init  -- --verbose


# The following lines are intentional, it contains the public value of the
# Cosmos DB local emulator, in my system as env var AZURE_COSMOSDB_EMULATOR_KEY.
# These secret values will be identified with a 'scan' function.
# Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
# Secret value => dd64Wup8RwYrNCReZQPB  (defined in the .env file, a similated _KEY)
