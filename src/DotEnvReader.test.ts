/**
 * Unit tests for class EnvScanner.
 * Chris Joakim, 2025
 */

import { assert } from 'chai';
import { expect } from 'chai';
import { DotEnvReader } from "./DotEnvReader";

describe('DotEnvReader: constructor', () => {

    it('should find and parse the .env file', () => {
        let reader = new DotEnvReader();
        let envVars = reader.envVars;
        expect(reader.exists).to.be.equal(true);
        expect(reader.envVars["KAGGLE_KEY"]).to.be.equal("dd64Wup8RwYrNCReZQPB");
        expect(reader.envVars["KAGGLE_USERNAME"]).to.be.equal("Miles");
        expect(reader.envVars["SOME_DOUBLE_QUOTED_API_KEY"]).to.be.equal("Tdvs4352oeSe6o6ULU7Umb3pZQ6u3RqDQ");
        expect(reader.envVars["SOME_SINGLE_QUOTED_API_KEY"]).to.be.equal("Tdvs4352oeSe6o6ULU7Umb3pZQ6u3RqSQ");

        // This test assumes that the .env file has the following contents:
        //
        // KAGGLE_KEY=dd64Wup8RwYrNCReZQPB
        // KAGGLE_USERNAME=   Miles   
        // SOME_DOUBLE_QUOTED_API_KEY="Tdvs4352oeSe6o6ULU7Umb3pZQ6u3RqDQ"
        // SOME_SINGLE_QUOTED_API_KEY= 'Tdvs4352oeSe6o6ULU7Umb3pZQ6u3RqSQ' 
    });
});
