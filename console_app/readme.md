# evsecrets console_app

Sample app to develop and demonstrate the evsecrets library.

## Example Use

### Install 

```
$ npm install evsecrets
```

### Configure in package.json

The "secrets" command is aliased here to the installed evsecrets lib.

```
    "scripts": {
        "evsecrets": "./node_modules/evsecrets/dist/index.js"
    },
```

### Add your evsecrets.json file

As shown in this directory.

### Run from the CLI

```
$ npm run evsecrets version
$ npm run evsecrets secrets
$ npm run evsecrets files
$ npm run evsecrets scan
```