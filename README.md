# evsecrets

The purpose of the **evsecrets** npm library is to detect **secrets**
in your codebase, **before** you push your code to GitHub, where the 
secret values are defined in your **environment variables**.
**evsecrets** is a command-line interface (CLI) program.

Per the Twelve Factor App best practices, configuration should be stored in 
environment variables; see https://12factor.net/config.
Docker and containerized environments also commonly use environment variables.

---

## Global Installation

evsecrets can be installed globally on your system as follows:

```
$ npm install -g evsecrets
```

Note: When installed globally, the envsecrets library can be used to scan
the codebase of **any** project on your system (i.e. - Python, Java, C#, Node.js, etc.).
Thus, this is the recommended installation approach.

## Configuration

See the **Configuration: evsecrets.json** section below.

## CLI subcommands

These four subcommands are implemented.

| Subcommand | Function                                                                                |
| ---------- | --------------------------------------------------------------------------------------- |
| version    | Display the version of the evsecrets library (i.e. - '0.7.0')                           |
| secrets    | Display the pattern-matched environment variables and their values (i.e. - the secrets) |
| files      | Display the filtered list of files that will be scanned per your evsecrets.json file    |
| scan       | Scan the filtered files list in your codebase for the identified secrets                |

## Use 

The **npx** program within Node.js can be used to execute this library,
and the four subcommands, as follows:

```
$ npx -- evsecrets version
$ npx -- evsecrets secrets
$ npx -- evsecrets files
$ npx -- evsecrets scan
```

---

### Project Installation 

Alternatively, you can install the library locally in your Node.js project.

```
$ npm install evsecrets
```

Add a script alias command in package.json:

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

## Configuration: evsecrets.json

In the root directory of your project, optionally create a file named
**evsecrets.json** that looks like the following JSON.

Edit the values within **env_var_patterns**, **exclude_file_patterns** and
**exclude_file_suffixes** per your needs.  The values shown below are
the **defaults** implemented in the program.

These determine what environment variables to obtain your secrets from,
the files to be excluded from scanning, and the filetypes to be excluded
from scanning, respectively.

```
{
    "env_var_patterns": [
        "_KEY",
        "_URI",
        "_URL",
        "CONN_STR",
        "CONNECTION_STR",
        "CONNECTION_STRING"
    ],
    "exclude_file_patterns": [
        "__MACOSX/",
        "__pycache__/",
        ".code-workspace",
        ".git/",
        ".git/",
        ".gradle/",
        ".idea/",
        ".vscode/",
        "bin/",
        "build/",
        "htmlcov/",
        "man/",
        "node_modules/",
        "obj/",
        "opt/",
        "tmp/",
        "venv/"
    ],
    "exclude_file_suffixes": [
        ".acc",
        ".avi",
        ".bmp",
        ".class",
        ".dll",
        ".doc",
        ".docx",
        ".DS_Store",
        ".exe",
        ".gif",
        ".jar",
        ".jpeg",
        ".jpg",
        ".mov",
        ".mp3",
        ".mp4",
        ".pdf",
        ".png",
        ".ppt",
        ".pptx",
        ".pyc",
        ".so",
        ".tar",
        ".tgz",
        ".tiff",
        ".wav",
        ".xls",
        ".xlsx",
        ".vscode",
        ".zip"
    ]
}
```

## Example

Assuming the above **evsecrets.json** configuration file, 
and the following environment variable in your system:

```
SOME_SECRET_KEY=C2y6yDjf5
```

Then the value 'C2y6yDjf5' will be identified if it exists in your codebasesuring a **scan**.

---

## Version History

| Version |    Date    | Changes                                                           |
| ------- | ---------- | ----------------------------------------------------------------- |
|  0.7.0  | 2025/04/15 | Updated GitHub URL, updated installation                          |
|  0.6.0  | 2025/04/14 | Ported to the @nodelib/fs.walk library, made codebase synchronous |
|  0.5.0  | 2025/04/13 | Added 'secrets' subcommand, removed 'patterns'                    |
|  0.4.0  | 2025/04/13 | npx usage and -g installation                                     |
|  0.3.0  | 2025/04/13 | Simplified bin command, added version CLI function                |
|  0.2.0  | 2025/04/13 | Sample console_app                                                |
|  0.1.0  | 2025/04/13 | Initial release                                                   |

## Common Errors

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

---

https://www.npmjs.com/package/@nodelib/fs.walk
https://www.npmjs.com/package/walk 
https://www.npmjs.com/package/node-os-walk   3y