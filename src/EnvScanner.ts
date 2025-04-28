/**
 * This is the primary implementation class in this library.
 * Chris Joakim, 2025
 */

import os from "os";
import util from "util";

import * as fsWalk from '@nodelib/fs.walk';

import { FileUtil } from "./FileUtil";


export class EnvScanner {

    static CONFIG_FILE: string = ".evsecrets.json";
    static VERSION: string = "1.0.0";

    fu : FileUtil = null;
    envVarPatterns : Array<string> = null;
    excludeFilePatterns : Array<string> = null;
    excludeFileSuffixes : Array<string> = null;
    allFilenames : Array<string> = null;
    verbose : boolean = false;
    tmpFileOutputs : boolean = false;

    constructor() {
        this.fu = new FileUtil();
        this.allFilenames = Array<string>();

        try {
            // first set these arrays to their defaults
            this.envVarPatterns = this.defaultEnvVarPatterns();
            this.excludeFilePatterns = this.defaultExcludeFilePatterns();
            this.excludeFileSuffixes = this.defaultExcludeFileSuffixes();

            // next try to read the '.evsecrets.json' configuration file
            if (this.fu.fileExists(EnvScanner.CONFIG_FILE)) {
                try {
                    let txt = this.fu.readTextFileSync(EnvScanner.CONFIG_FILE);
                    let obj = JSON.parse(txt);
                    this.envVarPatterns = obj['env_var_patterns'];
                    this.excludeFilePatterns = obj['exclude_file_patterns'];
                    this.excludeFileSuffixes = obj['exclude_file_suffixes']; 
                }
                catch (error) {
                    console.error(
                        "error processing " + EnvScanner.CONFIG_FILE + ". using defaults.");
                }
            }
            else {
                console.log("file " + EnvScanner.CONFIG_FILE + " does not exist, using defaults.")
            }

            // verbose and debugging settings
            this.verbose = this.cliArgPresent("--verbose");
            this.tmpFileOutputs = this.cliArgPresent("--tmp-file-outputs");
            if (this.verbose) {
                console.log("verbose: " + this.verbose + ", tmpFileOutputs: " + this.tmpFileOutputs);
            }
        }
        catch (error) {
            console.error("evsecrets - error in constructor");
        }
    }

    /**
     * Return the version of this npm package.
     */
    static version() : string {
        return EnvScanner.VERSION;
    }

    /**
     * Write a default '.evsecrets.json' file in the current directory.
     */
    init() : boolean {
        try {
            let config = this.defaultConfig();
            config['version'] = EnvScanner.version();
            config['gen_timestamp'] = this.getFormattedTimestamp();
            let outfile = EnvScanner.CONFIG_FILE;
            this.fu.writeTextFileSync(outfile, JSON.stringify(config, null, 2));
            if (this.verbose) {
                console.log("file written: " + EnvScanner.CONFIG_FILE);
            }
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Return a timestamp string, for your local timezone, in 'YYYY-MM-DD HH:MM:SS' format.
     * For example: '2025-04-15 13:04:39'
     */
    getFormattedTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedTimestamp;
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

    /**
     * Display a list of your secrets defined in your specified environment variables.
     */
    secrets() : void {
        let secretEnvVarNames = this.secretEnvVars();
        let msg = util.format(
            '%s environment variables with secrets per your .evsecrets.json configuration:',
            secretEnvVarNames.length);
        console.log(msg);
        for (let e = 0; e < secretEnvVarNames.length; e++) {
            let envvar = secretEnvVarNames[e];
            let value = process.env[envvar];
            console.log(envvar + ' --> ' + value);
        }
    }

    /**
     * Scan your codebase for the secrets defined in your environment variables,
     * per the configuration in .evsecrets.json or the default configuration.
     * Display the matches and line numbers in the terminal output.
     */
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
     * Print the filteredFilenamesList on the console/terminal.
     */
    files() : void {
        let filesList = this.filteredFilenamesList();
        for (let i = 0; i < filesList.length; i++) {
            console.log(filesList[i]);
        }
    }

    /**
     * Return a filtered list of files to scan for secrets.
     */
    filteredFilenamesList(codebaseRootDir: string = null) : Array<string> {
        this.allFilenames = this.walkFs(codebaseRootDir);
        let filteredFilenames = new Object();
        for (let i = 0; i < this.allFilenames.length; i++) {
            let filename = this.allFilenames[i];
            if (this.includeThisFile(filename)) {
                filteredFilenames[filename] = 1;
            }
        }

        if (this.verbose) {
            console.log("filteredFilenamesList length: " + Object.keys(filteredFilenames).length);
        }
        if (this.tmpFileOutputs) {
            try {
                let outfile = "tmp/evsecrets-filteredFilenamesList.json";
                this.fu.writeTextFileSync(outfile, JSON.stringify(filteredFilenames, null, 2));
                console.log("file written: " + outfile);
            }
            catch (error) {
                console.error(error);
            }
        }
        return Object.keys(filteredFilenames).sort();
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

        if (this.verbose) {
            console.log("walkFs length: " + files.length);
        }
        if (this.tmpFileOutputs) {
            try {
                let outfile = "tmp/evsecrets-walkFs.json";
                this.fu.writeTextFileSync(outfile, JSON.stringify(files, null, 2));
                console.log("file written: " + outfile);
            }
            catch (error) {
                console.error(error);
            }
        }
        return files;
    }

    /**
     * Return a boolean indicating if the given filename should be included
     * in the scanning process, based on the filename patterns and filename
     * suffixes in the configuration.
     */
    includeThisFile(filename: string) : boolean {
        let result = true;
        for (let i = 0; i < this.excludeFilePatterns.length; i++) {
            let pattern = this.excludeFilePatterns[i];
            if (filename.includes(pattern)) {
                result = false;
            }
        }
        for (let i = 0; i < this.excludeFileSuffixes.length; i++) {
            let suffix = this.excludeFileSuffixes[i];
            if (filename.endsWith(suffix)) {
                result = false;
            }
        }
        if (this.verbose) {
            console.log("includeThisFile: " + filename + " --> " + result);
        }
        return result;
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

    /**
     * Return true if given command line arg (i.e. --verbose) is present, else return false. 
     */
    cliArgPresent(flag: string) : boolean {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === flag) {
                return true;
            }
        }
        return false;
    }

    defaultEnvVarPatterns() {
        return this.defaultConfig()['env_var_patterns'];
    }

    defaultExcludeFilePatterns() {
        return this.defaultConfig()['exclude_file_patterns'];
    }

    defaultExcludeFileSuffixes() {
        return this.defaultConfig()['exclude_file_suffixes'];
    }

    /**
     * This method returns the default configuration object.
     * It is used by default if you don't have a ".evsecrets.json" file
     * in the current directory.
     * 
     * This object is also written to your filesystem when the 'init'
     * function is executed.
     */
    defaultConfig() {
        return {
            "description": "Configuration file for the evsecrets NPM library CLI program.",
            "env_var_patterns": [
                "_KEY",
                "_URI",
                "_URL",
                "CONN_STR",
                "CONNECTION_STR",
                "CONNECTION_STRING"
            ],
            "exclude_file_patterns": [
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
            ],
            "exclude_file_suffixes": [
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
            ]
        };
    }
}

// The following line is intentional, it contains the public value of the
// Cosmos DB local emulator, in my system as env var AZURE_COSMOSDB_EMULATOR_KEY.
// This secret value will be identified with a 'scan' function.
// Secret value => C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
