/**
 * This class is used to read and process a ".env" file if it exists
 * in your project. A .env file can be used in some programming 
 * ecosystems as an alternative location for environment variables,
 * including secrets.
 * 
 * See https://pypi.org/project/python-dotenv/
 * See https://www.npmjs.com/package/dotenv
 * 
 * Chris Joakim, 2025
 */

import { FileUtil } from "./FileUtil";


export class DotEnvReader {
    
    static FILENAME: string = ".env";

    exists : boolean = false;
    envVars : Object = {}
    names : Array<string> = [];

    constructor() {
        try {
            let fu : FileUtil = new FileUtil();
            if (fu.fileExists(DotEnvReader.FILENAME)) {
                this.exists = true;
                this.parseFile(fu, DotEnvReader.FILENAME);
            }
            this.names = Object.keys(this.envVars).sort();
        }
        catch (err) {
            console.log(err);
        }
    }

    /**
     * Parse the .env file into its names and values, and populate the
     * this.envVars object with them.
     */
    parseFile(fu : FileUtil, infile : string) : void {
        try {
            let lines : Array<string> = fu.readTextFileAsLinesSync(DotEnvReader.FILENAME);
            for (let i = 0; i < lines.length; i++) {
                let trimmed = lines[i].trim()
                if (trimmed.length > 0) {
                    if ((trimmed.startsWith("#")) || (trimmed.startsWith("//"))) {
                        // ignore comment lines
                    }
                    else {
                        let eqIdx = trimmed.indexOf("=");
                        if (eqIdx > 0) {
                            let namePart = trimmed.substring(0, eqIdx).trim();
                            let valuePart = trimmed.substring(eqIdx + 1).trim();

                            // handle double-quoted values
                            if (valuePart.startsWith("\"")) {
                                valuePart = valuePart.substring(1);
                                if (valuePart.endsWith("\"")) {
                                    valuePart = valuePart.substring(0, valuePart.length - 1)
                                }
                            }
                            // handle single-quoted values
                            if (valuePart.startsWith("'")) {
                                valuePart = valuePart.substring(1);
                                if (valuePart.endsWith("'")) {
                                    valuePart = valuePart.substring(0, valuePart.length - 1)
                                }
                            }
                            this.envVars[namePart] = valuePart;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
