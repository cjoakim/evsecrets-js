/**
 * Unit tests for class EnvScanner.
 * Chris Joakim, 2025
 */

import { assert } from 'chai';
import { expect } from 'chai';
import { EnvScanner } from "./EnvScanner";

describe('EnvScanner: constructor', () => {

    it('should return the correct version', () => {
        let es = new EnvScanner();
        let obj = es.fu.readJsonObjectFile('package.json');
        let pkgVersion : string = obj['version'];
        let codeVersion : string = EnvScanner.version();
        expect(pkgVersion).to.be.equal(codeVersion);
    });

    it('should have the correct envVarPatterns', () => {
        let es = new EnvScanner();
        let patterns = es.envVarPatterns.sort();
        //console.log(patterns);
        expect(patterns.length).to.be.above(5);
        expect(patterns.length).to.be.below(10);
        let expectedPatterns = [
            "CONN_STR",
            "CONNECTION_STR",
            "CONNECTION_STRING",
            "_KEY",
            "_URI",
            "_URL"
        ]
        for (let i = 0; i < expectedPatterns.length; i++) {
            let pattern = expectedPatterns[i];
            assert.include(patterns, pattern, pattern + ' is an expected pattern');
        }
    });

    it('should have the correct excludeFilePatterns', () => {
        let es = new EnvScanner();
        let patterns = es.excludeFilePatterns.sort();
        //console.log(patterns);
        expect(patterns.length).to.be.above(5);
        expect(patterns.length).to.be.below(8);
        let expectedPatterns = [
            "git/",
            "bin/",
            "obj/",
            "tmp/",
            "node_modules/",
            "venv/"
        ]
        for (let i = 0; i < expectedPatterns.length; i++) {
            let pattern = expectedPatterns[i];
            assert.include(patterns, pattern, pattern + ' is an expected pattern');
        }
    });

    it('should have the correct excludeFileSuffixes', () => {
        let es = new EnvScanner();
        let suffixes = es.excludeFileSuffixes.sort();
        //console.log(suffixes);
        expect(suffixes.length).to.be.above(4);
        expect(suffixes.length).to.be.below(8);
        let expectedSuffixes = [
            ".class",
            ".jar",
            ".pyc",
            ".tar",
            ".zip"
        ]
        for (let i = 0; i < expectedSuffixes.length; i++) {
            let suffix = expectedSuffixes[i];
            assert.include(suffixes, suffix, suffix + ' is an expected suffix');
        }
    });
});

describe('EnvScanner: secretEnvVars()', () => {

    it('should return the correct secretEnvVars()', () => {
        let es = new EnvScanner();
        let secretVars = es.secretEnvVars();
        //console.log(secretVars);
        expect(secretVars.length).to.be.above(6);
        expect(secretVars.length).to.be.below(30);
        let expectedVars = [
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'AZURE_COSMOSDB_EMULATOR_KEY',
            'AZURE_COSMOSDB_EMULATOR_MONGO_CONN_STR',
            'AZURE_COSMOSDB_EMULATOR_URI',
            'AZURE_COSMOSDB_NOSQL_CONN_STR',
            'AZURE_COSMOSDB_NOSQL_KEY',
            'AZURE_COSMOSDB_NOSQL_URI',
            'KAGGLE_KEY'
        ]
        for (let i = 0; i < expectedVars.length; i++) {
            let envVarName = expectedVars[i];
            assert.include(secretVars, envVarName, envVarName + ' is an expected pattern');
        }
    });
});

describe('EnvScanner: filteredFilenamesList()', () => {

    it('should return the correct filteredFilenamesList() list', async function() {
        let es = new EnvScanner();
        let filteredFiles = await es.filteredFilenamesList();
        //console.log("filteredFiles.length: " + filteredFiles.length);
        for (let i = 0; i < filteredFiles.length; i++) {
            let filename = filteredFiles[i];
            //console.log("filteredFiles: " + filename);
        }
        expect(filteredFiles.length).to.be.above(28);
        expect(filteredFiles.length).to.be.below(50);

        let expectedFiles = [
            'evsecrets-js/src/index.ts',
            'evsecrets-js/src/EnvScanner.ts',
            'evsecrets-js/package.json'
        ]
        for (let i = 0; i < expectedFiles.length; i++) {
            let expectedFilename = expectedFiles[i];
            let present = false;
            for (let f = 0; f < filteredFiles.length; f++) {
                let ff = filteredFiles[f];
                if (ff.endsWith(expectedFilename)) {
                    present = true;
                }
            }
            expect(present).to.be.equal(true);
        }
    });
});

describe('EnvScanner: scan()', () => {

    it('should scan the codebase for secrets', async function() {
        let es = new EnvScanner();
        let expectedFilename = 'evsecrets-js/src/EnvScanner.ts';
        let expectedFileFound = false;
        let results = await es.scan(null, true);
        for (let i = 0; i < results.length; i++) {
            if (results[i].includes(expectedFilename)) {
                expectedFileFound = true;
            }
        }
        expect(expectedFileFound).to.be.equal(true);
    });
});
