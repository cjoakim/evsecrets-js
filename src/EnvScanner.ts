/**
 * This is the primary implementation class in this library.
 * Chris Joakim, 2025
 */

import os from "os";
import path from "path";
import util from "util";

import * as fsWalk from '@nodelib/fs.walk';

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
            // first set these arrays to their defaults
            this.envVarPatterns = this.defaultEnvVarPatterns();
            this.excludeFilePatterns = this.defaultExcludeFilePatterns();
            this.excludeFileSuffixes = this.defaultExcludeFileSuffixes();

            // next try to read the evsecrets.json file
            let txt = this.fu.readTextFileSync("evsecrets.json");
            let obj = JSON.parse(txt);
            this.envVarPatterns = obj['env_var_patterns'];
            this.excludeFilePatterns = obj['exclude_file_patterns'];
            this.excludeFileSuffixes = obj['exclude_file_suffixes'];
        }
        catch (error) {
            console.error("EnvScanner error in constructor, using defaults");
        }
    }

    /**
     * Return the version of this npm package.
     */
    static version() : string {
        return '0.7.0';
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

    secrets() : void {
        let secretEnvVarNames = this.secretEnvVars();
        let msg = util.format(
            '%s environment variables with secrets per your evsecrets.json configuration:',
            secretEnvVarNames.length);
        console.log(msg);
        for (let e = 0; e < secretEnvVarNames.length; e++) {
            let envvar = secretEnvVarNames[e];
            let value = process.env[envvar];
            console.log(envvar + ' --> ' + value);
        }
    }

    scan(codebaseRootDir: string = null, silent: boolean = false) : Array<string> {
        let results = new Array<string>();
        try {
            let secrets = new Array<string>();
            let envVars = this.secretEnvVars();
            let counter = 0;
            for (let i = 0; i < envVars.length; i++) {
                let envvar = envVars[i];
                secrets.push(process.env[envvar]);
            }
            let codebaseFilenames = this.filteredFilenamesList(codebaseRootDir);
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

    /**
     * Recursively walk the filesystem from the given codebaseRootDir.
     * Return an unfiltered list of all of the files found; not directories.
     */
    walkFs(codebaseRootDir: string = null) : Array<string> {
        let files = Array<string>();
        if (codebaseRootDir === null) {
            codebaseRootDir = process.cwd();
        }
        let walkSettings = {};
        walkSettings['stats'] = false;
        walkSettings['followSymbolicLinks'] = false;

        // This functionality is implemented with the '@nodelib/fs.walk' library
        const entries = fsWalk.walkSync(codebaseRootDir, walkSettings);

        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            // See https://nodejs.org/api/fs.html#direntisfile
            if (entry.dirent.isFile()) {  
                files.push(entry.path);
            }
        }
        this.fu.writeTextFileSync("tmp/walkFs.json", JSON.stringify(files, null, 2));
        return files;
    }

    filteredFilenamesList(codebaseRootDir: string = null) : Array<string> {
        this.allFilenames = this.walkFs(codebaseRootDir);
        let filteredFilenames = new Object();

        for (let i = 0; i < this.allFilenames.length; i++) {
            let filename = this.allFilenames[i];
            if (this.includeThisFile(filename)) {
                filteredFilenames[filename] = 1;
            }
        }
        return Object.keys(filteredFilenames).sort();
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

    defaultEnvVarPatterns() {
        return [
            "_KEY",
            "_URI",
            "_URL",
            "CONN_STR",
            "CONNECTION_STR",
            "CONNECTION_STRING"
        ];
    }

    defaultExcludeFilePatterns() {
        return [
            "__MACOSX/",
            "__pycache__/",
            ".code-workspace",
            ".git/",
            ".git/",
            ".gradle/",
            ".idea/",
            ".vscode/",
            "bin/",
            "build/",
            "htmlcov/",
            "man/",
            "node_modules/",
            "obj/",
            "opt/",
            "tmp/",
            "venv/"
        ];
    }

    defaultExcludeFileSuffixes() {
        return [
            ".acc",
            ".avi",
            ".bmp",
            ".class",
            ".dll",
            ".doc",
            ".docx",
            ".DS_Store",
            ".exe",
            ".gif",
            ".jar",
            ".jpeg",
            ".jpg",
            ".mov",
            ".mp3",
            ".mp4",
            ".pdf",
            ".png",
            ".ppt",
            ".pptx",
            ".pyc",
            ".so",
            ".tar",
            ".tgz",
            ".tiff",
            ".wav",
            ".xls",
            ".xlsx",
            ".vscode",
            ".zip"
        ];
    }

}

// The following line is intentional, it contains the public value of the
// Cosmos DB local emulator, in my system as env var AZURE_COSMOSDB_EMULATOR_KEY.
// Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
