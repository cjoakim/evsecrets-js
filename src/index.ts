#!/usr/bin/env node

/**
 * Entry point for the evsecrets CLI program.
 * Chris Joakim, 2025
 */

import { EnvScanner } from "./EnvScanner";
import { FileUtil } from "./FileUtil";

function displayCommandLineExamples() {
    console.log('-');
    console.log('npx -- evsecrets version');
    console.log('npx -- evsecrets init');
    console.log('npx -- evsecrets secrets');
    console.log('npx -- evsecrets files');
    console.log('npx -- evsecrets scan');
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
        case "init":
            es.init();
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
        case "walk":
            es.walkFs(null);
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

export { EnvScanner }
export { FileUtil }
