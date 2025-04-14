#!/usr/bin/env node

/**
 * Entry point for evsecrets.
 * Chris Joakim, 2025
 */

import { EnvScanner } from "./EnvScanner";
import { FileUtil } from "./FileUtil";

function displayCommandLineExamples() {
    console.log('-');
    console.log('npx -- evsecrets@0.5.0 version');
    console.log('npx -- evsecrets@0.5.0 secrets');
    console.log('npx -- evsecrets@0.5.0 files');
    console.log('npx -- evsecrets@0.5.0 scan');
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
