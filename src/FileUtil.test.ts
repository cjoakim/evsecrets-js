/**
 * Unit tests for class FileUtil.
 * Chris Joakim, 2025
 */

import { assert } from 'chai';
import { expect } from 'chai';
import { FileUtil } from "./FileUtil";

describe('FileUtil: fileExists()', () => {

    it('should detect if a file exists or not', () => {
        let fu = new FileUtil();

        let result = fu.fileExists('package.json');
        expect(result).to.be.equal(true);

        result = fu.fileExists('not_there.json');
        expect(result).to.be.equal(false);
    });
});

