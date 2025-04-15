# Developer Notes

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

### Package the library

```
$ ./pack.sh

...

npm notice
npm notice 📦  evsecrets@0.7.0
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 5.3kB README.md
npm notice 1.9kB dist/EnvScanner.d.ts
npm notice 11.6kB dist/EnvScanner.js
npm notice 8.0kB dist/EnvScanner.js.map
npm notice 1.5kB dist/FileUtil.d.ts
npm notice 3.7kB dist/FileUtil.js
npm notice 2.6kB dist/FileUtil.js.map
npm notice 206B dist/index.d.ts
npm notice 1.7kB dist/index.js
npm notice 1.2kB dist/index.js.map
npm notice 1.4kB package.json
npm notice Tarball Details
npm notice name: evsecrets
npm notice version: 0.7.0
npm notice filename: evsecrets-0.7.0.tgz
npm notice package size: 9.9 kB
npm notice unpacked size: 40.3 kB
npm notice shasum: 14a01ffb9b65535967989529966e5c9ead918705
npm notice integrity: sha512-NEtYTqP8by3wY[...]3P25/mJh6wERw==
npm notice total files: 12
npm notice
evsecrets-0.7.0.tgz
```

### The console_app

Before publishing the packaged library, test the packaged library
the the **console_app** in this repo.

Update the package.json file to use the packaged **tgz** file.

```
    "dependencies": {
        ...
        "evsecrets": "file:../evsecrets-0.7.0.tgz"
    },
```

Then install the npm libraries with **install.sh**.

```
$ npm run secrets version
$ npm run secrets secrets
$ npm run secrets files
$ npm run secrets scan
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