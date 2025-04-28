# evsecrets console_app

Sample app to develop and demonstrate the evsecrets library.

## Example Use

### Configure in package.json

The "secrets" command is aliased here to the installed evsecrets lib.

```
    "scripts": {
        "secrets": "./node_modules/evsecrets/dist/index.js"
    },
```

Update the dependencies to use the packaged **tgz** file
produced by **pack.sh** in the parent directory.

```
    "dependencies": {
        ...
        "evsecrets": "file:../evsecrets-0.7.0.tgz"
    },
```

### Install 

```
$ install.sh
```



### Test

```
$ npm run secrets version
$ npm run secrets init
$ npm run secrets secrets
$ npm run secrets files
$ npm run secrets scan
```