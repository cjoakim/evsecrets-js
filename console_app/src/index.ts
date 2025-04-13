#!/usr/bin/env node

/**
 * Entry point for evsecrets.
 * Chris Joakim,  2025
 */

import { EnvScanner } from "evsecrets";


function displayCommandLineExamples() {
    console.log('-');
    console.log('npm exec evsecrets patterns');
    console.log('npm exec evsecrets files');
    console.log('npm exec evsecrets scan');
    console.log('');
}

async function main() {
  try {
    let func = process.argv[2];
    let es   = new EnvScanner();
    switch (func) {
        case "patterns":
            console.log(es.envVarPatterns);
            break;
        case "files":
            let files = await es.filteredFilenamesList();
            console.log(files);
            break;
        case "scan":
            let results = await es.scan(null);
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
