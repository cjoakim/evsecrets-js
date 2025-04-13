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
        "secrets": "./node_modules/evsecrets/dist/index.js"
    },
```

### Add your evsecrets.json file

As shown in this directory.

### Run from the CLI

```
$ npm run secrets patterns

> evsecrets-console-app@0.1.0 secrets
> ./node_modules/evsecrets/dist/index.js patterns

[
  'CONN_STR',
  'CONNECTION_STR',
  'CONNECTION_STRING',
  '_KEY',
  '_URI',
  '_URL'
]
```