# evsecrets

Home of the **evsecrets** npm library, a command-line interface (CLI) program.

The purpose of this library is to detect **environment variable secrets**
in your codebase **before** you push your code to GitHub.

Per the Twelve Factor App best practices, configuration should be stored in 
environment variables; see https://12factor.net/config.
Docker and containerized environments also commonly use environment variables.

These CLI subcommands are implemented:

| Subcommand | Function                                                                                |
| ---------- | --------------------------------------------------------------------------------------- |
| version    | Display the version of the evsecrets library (i.e. - '0.5.0')                           |
| secrets    | Display the pattern-matched environment variables and their values (i.e. - the secrets) |
| files      | Display the filtered list of files that will be scanned per your evsecrets.json file    |
| scan       | Scan the filtered files list in your codebase for the identified secrets                |

## Installation

### Global Installation

You can install the library globally, with the -g parameter.

```
$ npm install -g evsecrets
```

### Project Installation 

Alternatively, you can install the library locally in your Node.js project.

```
$ npm install -g evsecrets
```

Add script alias command in package.json:

```
    "scripts": {
        ...
        "secrets": "./node_modules/evsecrets/dist/index.js"
    },
```

Then, execute the alias command:

```
$ npm run secrets version
$ npm run secrets secrets
$ npm run secrets files
$ npm run secrets scan
```

Linux/macOS users may need to make the script executable:

```
$ chmod 744 ./node_modules/evsecrets/dist/index.js
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

The **npx** program within Node.js can be used to execute this library as follows:

```
$ npx -- evsecrets@0.5.0 version
$ npx -- evsecrets@0.5.0 secrets
$ npx -- evsecrets@0.5.0 files
$ npx -- evsecrets@0.5.0 scan
```

## Version History

| Version |    Date    | Changes                                                         |
| ------- | ---------- | --------------------------------------------------------------- |
|  0.5.0  | 2025/04/13 | Added 'secrets' subcommand, removed 'patterns'                  |
|  0.4.0  | 2025/04/13 | npx usage and -g installation                                   |
|  0.3.0  | 2025/04/13 | Simplified bin command, added version CLI function              |
|  0.2.0  | 2025/04/13 | Sample console_app                                              |
|  0.1.0  | 2025/04/13 | Initial release                                                 |

## Common Errors

### Maximum call stack size exceeded

```
$ npx -- evsecrets@0.5.0 scan
RangeError: Maximum call stack size exceeded
```

This error occurs when the scanned directory contains too many files.
In this case reduce the scope of the scanning by 

### Permission denied

```
./node_modules/evsecrets/dist/index.js: Permission denied
```

In this case, on Linux and macOS, make the file executable with this command:

```
$ chmod 744 ./node_modules/evsecrets/dist/index.js
```

--- 

## Developer Notes

Instructions for developing, testing, packaging, and publishing this library.

### Links

- https://docs.npmjs.com/cli/v11/commands/npx  (version 11.3.0 - latest)

### Upgrade npm and typescript

```
$ npm install -g npm@11.3.0
$ npm install -g typescript@5.8.3

$ npm --version
11.3.0

$ tsc --version
Version 5.8.3
```

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

  7 passing (23ms)
```

### Execute the CLI functions

```
$ npm run files

$ npm run scan
```

### Publish to npmjs.com

```
$ npm login
$ npm publish
```
