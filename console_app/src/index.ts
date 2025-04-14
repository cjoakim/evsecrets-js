#!/usr/bin/env node

/**
 * Entry point for the console_app.
 * Chris Joakim, 2025
 */

import { EnvScanner } from "evsecrets";

function displayCommandLineExamples() {
  console.log('-');
  console.log('npx -- evsecrets@0.6.0 version');
  console.log('npx -- evsecrets@0.6.0 secrets');
  console.log('npx -- evsecrets@0.6.0 files');
  console.log('npx -- evsecrets@0.6.0 scan');
  console.log('-');
  console.log('npm run evsecrets version');
  console.log('npm run evsecrets secrets');
  console.log('npm run evsecrets files');
  console.log('npm run evsecrets scan');
  console.log('');
}

function main() {
  try {
    let func = process.argv[2];
    let es   = new EnvScanner();
    switch (func) {
      case "version":
        console.log(EnvScanner.version());
        break;
      case "secrets":
          es.secrets();
          break;
      case "files":
          let files = es.filteredFilenamesList();
          console.log(files);
          break;
      case "scan":
          let results = es.scan(null);
          break;
      default:
          displayCommandLineExamples();
          break;
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();
