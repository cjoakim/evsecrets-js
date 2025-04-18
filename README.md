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

These five subcommands are implemented:

| Subcommand | Function                                                                                |
| ---------- | --------------------------------------------------------------------------------------- |
| version    | Display the version of the evsecrets library (i.e. - '0.7.0')                           |
| init       | Create a evsecrets.json file in the current directory.  Edit it as necessary            |
| secrets    | Display the pattern-matched environment variables and their values (i.e. - the secrets) |
| files      | Display the filtered list of files that will be scanned per your evsecrets.json file    |
| scan       | Scan the filtered files list in your codebase for the identified secrets                |

The **scan** subcommand is the primary function. It will identify the files to be scanned,
then scan them for your secrets.  The other subcommands (i.e. - version, secrets, files)
are informational.

## Use 

The **npx** program within Node.js can be used to execute this library,
and the four subcommands, as follows:

```
$ npx -- evsecrets version
$ npx -- evsecrets init
$ npx -- evsecrets secrets
$ npx -- evsecrets files
$ npx -- evsecrets scan
```

You can also specify a specific version number with npx.

```
$ npx -- evsecrets@0.9.0 scan
```

---

### Project Installation 

Alternatively, you can install the library locally in your Node.js project.
See the **console_app** directory in this repo for a demonstration of this.

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
$ npm run secrets init
$ npm run secrets secrets
$ npm run secrets files
$ npm run secrets scan
```

### Optional CLI flag arguments 

The **--verbose** command-line arg can be used to produce additional output
for your understanding and debugging purposes.

The **--tmp-file-outputs** command-line arg can be used to write json
files to the **tmp** directory within the current directory.
This json files contain a list all files found, and the files that are
included for scanning.

For example:

```
$ npm run scan -- --tmp-file-outputs
...
file written: tmp/evsecrets-walkFs.json
file written: tmp/evsecrets-filteredFilenamesList.json
```

```
$ npm run scan -- --verbose
...
includeThisFile: /Users/cjoakim/github/evsecrets-js/.gitignore --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/LICENSE --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/README.md --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/backup.xml --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/build.ps1 --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/build.sh --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/devnotes.md --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/evsecrets-0.7.0.tgz --> false
includeThisFile: /Users/cjoakim/github/evsecrets-js/evsecrets.json --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/install.ps1 --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/install.sh --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/pack.ps1 --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/pack.sh --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/package-lock.json --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/package.json --> true
includeThisFile: /Users/cjoakim/github/evsecrets-js/tsconfig.json --> true
...
includeThisFile: /Users/cjoakim/github/evsecrets-js/tmp/evsecrets-filteredFilenamesList.json --> false
includeThisFile: /Users/cjoakim/github/evsecrets-js/tmp/evsecrets-walkFs.json --> false
...
```

Linux/macOS users may need to make the script executable:

```
$ chmod 744 ./node_modules/evsecrets/dist/index.js
```

## Configuration: evsecrets.json

In the root directory of your project, optionally create a file named
**evsecrets.json** that looks like the following JSON.

This file, with default values, can be created for you when you execute
the 'init' subcommand as described above.

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

Then the value 'C2y6yDjf5' will be identified if it exists in your codebase
during a **scan**.

---

## Version History

| Version |    Date    | Changes                                                             |
| ------- | ---------- | ------------------------------------------------------------------- |
|  0.9.0  | 2025/04/15 | Logging each file with the 'files' command instead of a json array  |
|  0.8.0  | 2025/04/15 | Initialization handling for absent config file                      |
|  0.7.0  | 2025/04/15 | Updated GitHub URL, updated installation.  Added init subcommand    |
|  0.6.0  | 2025/04/14 | Ported to the @nodelib/fs.walk library, made codebase synchronous   |
|  0.5.0  | 2025/04/13 | Added 'secrets' subcommand, removed 'patterns'                      |
|  0.4.0  | 2025/04/13 | npx usage and -g installation                                       |
|  0.3.0  | 2025/04/13 | Simplified bin command, added version CLI function                  |
|  0.2.0  | 2025/04/13 | Sample console_app                                                  |
|  0.1.0  | 2025/04/13 | Initial release                                                     |

## Common Errors

### Permission denied

```
./node_modules/evsecrets/dist/index.js: Permission denied
```

In this case, on Linux and macOS, make the file executable with this command:

```
$ chmod 744 ./node_modules/evsecrets/dist/index.js
```
