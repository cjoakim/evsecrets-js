/**
 * 
 * Chris Joakim, 2025
 */

import fs from "fs";
import os from "os";
import path from "path";
import util from "util";

import { exec } from "child_process";

import { FileUtil } from "./FileUtil";

export class EnvScanner {

    fu : FileUtil = null;
    envVarPatterns : Array<string> = null;
    excludeFilePatterns : Array<string> = null;
    excludeFileSuffixes : Array<string> = null;
    allFilenames : Array<string> = null;

    constructor() {
        this.fu = new FileUtil();
        this.allFilenames = Array<string>();

        try {
            let txt = this.fu.readTextFileSync("evsecrets.json");
            let obj = JSON.parse(txt);
            this.envVarPatterns = obj['env_var_patterns'];
            this.excludeFilePatterns = obj['exclude_file_patterns'];
            this.excludeFileSuffixes = obj['exclude_file_suffixes'];
            this.excludeFilePatterns.push("git/");
        }
        catch (error) {
            console.error("EnvScanner error in constructor, using defaults");
            console.error(error);
            if (this.excludeFilePatterns === null) {
                this.envVarPatterns = [
                    "CONN_STR",
                    "CONNECTION_STR",
                    "CONNECTION_STRING",
                    "_KEY",
                    "_URI",
                    "_URL"
                ];
            }
            if (this.excludeFilePatterns === null) {
                this.excludeFilePatterns = [
                    "git/",
                    "bin/",
                    "obj/",
                    "tmp/",
                    "node_modules/",
                    "venv/"
                ];
            }
            if (this.excludeFileSuffixes === null) {
                this.excludeFileSuffixes = [
                    ".class",
                    ".jar",
                    ".pyc",
                    ".tar",
                    ".zip"
                ];
            }
            console.log("EnvScanner.envVarPatterns init from defaults")
        }
    }

    /**
     * Return the version of this npm package.
     */
    static version() : string {
        return '0.4.0';
    }

    /**
     * Return an array of the secret environment variable names
     * per your defined patterns.
     */
    secretEnvVars() : Array<string> {
        let names = new Object();
        let allEnvVarNames = Object.keys(process.env).sort();
        for (let e = 0; e < allEnvVarNames.length; e++) {
            let name = allEnvVarNames[e];
            for (let i = 0; i < this.envVarPatterns.length; i++) {
                let pattern = this.envVarPatterns[i];
                if (name.includes(pattern)) {
                    names[name] = pattern;
                }
            }
        }
        return Object.keys(names).sort();
    }

    async scan(codebaseRootDir: string = null, silent: boolean = false) : Promise<Array<string>> {
        let results = new Array<string>();
        try {
            let secrets = new Array<string>();
            let envVars = this.secretEnvVars();
            let counter = 0;
            for (let i = 0; i < envVars.length; i++) {
                let envvar = envVars[i];
                secrets.push(process.env[envvar]);
            }
            let codebaseFilenames = await this.filteredFilenamesList(codebaseRootDir);
            for (let i = 0; i < codebaseFilenames.length; i++) {
                let filename = codebaseFilenames[i];
                let lines = this.fu.readTextFileAsLinesSync(filename);
                let lineNum = 0;
                for (let l = 0; l < lines.length; l++) {
                    let line = lines[l];
                    lineNum++;
                    for (let s = 0; s < secrets.length; s++) {
                        let secret = secrets[s];
                        if (line.includes(secret)) {
                            counter++;
                            let msg = '--- ' + counter;
                            results.push(msg);
                            if (!silent) {
                                console.log(msg);
                            }
                            msg = util.format('WARNING: Secret found at line %s of file %s', lineNum, filename);
                            results.push(msg);
                            if (!silent) {
                                console.log(msg);
                            }
                            msg = "content: " + line;
                            results.push(msg);
                            if (!silent) {
                                console.log(msg);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        return results;
    }

    async filteredFilenamesList(codebaseRootDir: string = null) : Promise<Array<string>> {
        this.allFilenames = Array<string>();
        this.allFilenames = await this.walkFiles(codebaseRootDir);
        let filteredFilenames = new Object();

        for (let i = 0; i < this.allFilenames.length; i++) {
            let filename = this.allFilenames[i];
            if (this.includeThisFile(filename)) {
                filteredFilenames[filename] = 1;
            }
        }
        return Object.keys(filteredFilenames).sort();
    }

    /**
     * Recursively collect a list of all filenames within codebaseRootDir.
     */
    async walkFiles(
        codebaseRootDir: string = null) : Promise<Array<string>> {
        if (codebaseRootDir === null) {
            codebaseRootDir = process.cwd();
        }
        const fsp = require('fs').promises;
        const entries = await fsp.readdir(codebaseRootDir);
        for (const entry of entries) {
            const entryPath = path.join(codebaseRootDir, entry);
            const stat = await fsp.stat(entryPath);
            if (stat.isDirectory()) {
                if (this.includeThisDirectory(entryPath)) {
                    const subFiles = await this.walkFiles(entryPath);
                    this.allFilenames.push(...subFiles); // Spread syntax to add all elements
                }    
            }
            else if (stat.isFile()) {
                this.allFilenames.push(entryPath);
            }
        }
        return this.allFilenames;
    }

    // ========== api methods above; private methods below ==========

    includeThisDirectory(filename: string) : boolean {
        for (let i = 0; i < this.excludeFilePatterns.length; i++) {
            let pattern = this.excludeFilePatterns[i];
            if (filename.includes(pattern)) {
                return false;
            }
        }
        return true;
    }

    includeThisFile(filename: string) : boolean {
        for (let i = 0; i < this.excludeFilePatterns.length; i++) {
            let pattern = this.excludeFilePatterns[i];
            if (filename.includes(pattern)) {
                return false;
            }
        }
        for (let i = 0; i < this.excludeFileSuffixes.length; i++) {
            let suffix = this.excludeFileSuffixes[i];
            if (filename.endsWith(suffix)) {
                return false;
            }
        }
        return true;
    }

    getPackageName() : string {
        let pkg = this.getPackageJson();
        return pkg['name'];
    }

    getPackageVersion() : string {
        let pkg = this.getPackageJson();
        return pkg['version'];
    }

    getPackageAuthor() : string {
        let pkg = this.getPackageJson();
        return pkg['author'];
    }

    getPackageJson() {
        return this.fu.readJsonObjectFile('package.json');
    }

    /**
     * Return the name of the platform where this node.js process is running.
     * Possible values are 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'.
     */
    platform() : string {
        return os.platform();
    }

    /**
     * Return true if the current platform is Windows, else return false. 
     */
    isWindows() : boolean {
        let p : string = os.platform().toLowerCase();
        if (this.isMac()) {
            return false;  // 'darwin' contains 'win'!
        }
        return p.includes('win');
    }

    /**
     * Return true if the current platform is Apple macOS, else return false. 
     */
    isMac() : boolean {
        let p : string = os.platform().toLowerCase();
        return p.includes('darwin');
    }

    /**
     * Return true if the current platform is Linux, else return false. 
     */
    isLinux() : boolean {
        let p : string = os.platform().toLowerCase();
        return p.includes('linux');
    }

    cliArgPresent(flag: string) : boolean {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === flag) {
                return true;
            }
        }
        return false;
    }

}

// The following line is intentional, it contains the public value of the
// Cosmos DB local emulator, in my system as env var AZURE_COSMOSDB_EMULATOR_KEY.
// Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
