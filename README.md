# evsecrets

Home of the **evsecrets** npm library.

The purpose of this library is to detect environment variable secrets
in your codebase **before** you push your code to GitHub.

## Installation

Install the library in your Node.js project.

```
$ npm install evsecrets
```

## Configuration

In the root directory of your Node.js project, create a file named
**evsecrets.json** that looks like the following.

Edit the values within **env_var_patterns**, **exclude_file_patterns** and
**exclude_file_suffixes** per your needs.

These determine what environment variables to obtain your secrets from,
the files to be excluded from scanning, and the filetypes to be excluded
from scanning, respectively.

```
{
    "env_var_patterns": [
        "CONN_STR",
        "CONNECTION_STR",
        "CONNECTION_STRING",
        "_KEY",
        "_URI",
        "_URL"
    ],
    "exclude_file_patterns": [
        "bin/",
        "obj/",
        "tmp/",
        "node_modules/",
        "venv/"
    ],
    "exclude_file_suffixes": [
        ".class",
        ".jar",
        ".pyc",
        ".tar",
        ".zip"
    ]
}
```

## Example

Assuming the above **evsecrets.json** configuration file, 
and the following environment variable in your system:

```
AZURE_COSMOSDB_EMULATOR_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
```

Then the value 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='
will be identified if it exists in your codebase.

## Use 

```
$ npx evsecrets patterns

$ npx evsecrets files

$ npx evsecrets scan
```

## Version History

| Version |    Date    | Changes                                                         |
| ------- | ---------- | --------------------------------------------------------------- |
|  0.1.0  | 2025/04/13 | Initial release                                                 |


--- 

## Development Use

Instructions for developing, testing, packaging, and publishing this library.



### Clone the codebase

```
$ git clone git@github.com:cjoakim/evsecrets-js.git

$ cd evsecrets-js
```

### Install libraries

```
$ ./install.sh
```

### Compile the TypeScript code, and test

```
$ ./build.sh

...

  EnvScanner: constructor
    ✔ should return the correct version
    ✔ should have the correct envVarPatterns
    ✔ should have the correct excludeFilePatterns
    ✔ should have the correct excludeFileSuffixes

  EnvScanner: secretEnvVars()
    ✔ should return the correct secretEnvVars()

  EnvScanner: filteredFilenamesList()
    ✔ should return the correct filteredFilenamesList() list

  EnvScanner: scan()
    ✔ should scan the codebase for secrets
```

### Execute the three CLI functions

#### patterns

Display the environment variable patterns for secrets that will be used.

```
$ npm run patterns

...

[
  'CONN_STR',
  'CONNECTION_STR',
  'CONNECTION_STRING',
  '_KEY',
  '_URI',
  '_URL'
]
```

#### files

Display the filenames that will be scanned.

```
$ npm run files

...

[
  '/Users/cjoakim/github/evsecrets-js/.env',
  '/Users/cjoakim/github/evsecrets-js/.gitignore',
  '/Users/cjoakim/github/evsecrets-js/LICENSE',
  '/Users/cjoakim/github/evsecrets-js/README.md',
  '/Users/cjoakim/github/evsecrets-js/backup.xml',
  '/Users/cjoakim/github/evsecrets-js/build.ps1',
  '/Users/cjoakim/github/evsecrets-js/build.sh',
  '/Users/cjoakim/github/evsecrets-js/dist/EnvScanner.d.ts',
  '/Users/cjoakim/github/evsecrets-js/dist/EnvScanner.js',
  '/Users/cjoakim/github/evsecrets-js/dist/EnvScanner.js.map',
  '/Users/cjoakim/github/evsecrets-js/dist/EnvScanner.test.d.ts',
  '/Users/cjoakim/github/evsecrets-js/dist/EnvScanner.test.js',
  '/Users/cjoakim/github/evsecrets-js/dist/EnvScanner.test.js.map',
  '/Users/cjoakim/github/evsecrets-js/dist/FileUtil.d.ts',
  '/Users/cjoakim/github/evsecrets-js/dist/FileUtil.js',
  '/Users/cjoakim/github/evsecrets-js/dist/FileUtil.js.map',
  '/Users/cjoakim/github/evsecrets-js/dist/index.d.ts',
  '/Users/cjoakim/github/evsecrets-js/dist/index.js',
  '/Users/cjoakim/github/evsecrets-js/dist/index.js.map',
  '/Users/cjoakim/github/evsecrets-js/evsecrets-0.1.0.tgz',
  '/Users/cjoakim/github/evsecrets-js/evsecrets.json',
  '/Users/cjoakim/github/evsecrets-js/install.ps1',
  '/Users/cjoakim/github/evsecrets-js/install.sh',
  '/Users/cjoakim/github/evsecrets-js/npm_pack.txt',
  '/Users/cjoakim/github/evsecrets-js/pack.ps1',
  '/Users/cjoakim/github/evsecrets-js/pack.sh',
  '/Users/cjoakim/github/evsecrets-js/package-lock.json',
  '/Users/cjoakim/github/evsecrets-js/package.json',
  '/Users/cjoakim/github/evsecrets-js/src/EnvScanner.test.ts',
  '/Users/cjoakim/github/evsecrets-js/src/EnvScanner.ts',
  '/Users/cjoakim/github/evsecrets-js/src/FileUtil.ts',
  '/Users/cjoakim/github/evsecrets-js/src/index.ts',
  '/Users/cjoakim/github/evsecrets-js/tsconfig.json'
]
```

#### secrets

Scan the files for the values of the identified environment variables
per their patterns.

```
$ npm run scan

...

--- 1
WARNING: Secret found at line 273 of file /Users/cjoakim/github/evsecrets-js/dist/EnvScanner.js
content: // Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
--- 2
WARNING: Secret found at line 281 of file /Users/cjoakim/github/evsecrets-js/src/EnvScanner.ts
content: // Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
```

Note: The above "secret" is actually a public value, but is used here for
demonstration purposes.  See ttps://learn.microsoft.com/en-us/azure/cosmos-db/how-to-develop-emulator.

### Publish to npmjs.com

```
$ npm login
$ npm publish --access=public
```
