/// <reference types="node" />
import * as plugins from './tapbuffer.plugins';
import { Transform } from 'stream';
/**
 * Smartava class allows the setup of tests
 */
export declare class TabBuffer {
    testableFiles: plugins.smartinject.fileObject[];
    testFiles: plugins.smartinject.fileObject[];
    testThreads: plugins.smartipc.Thread[];
    /**
     * the constructor of class Smartava
     */
    constructor();
    /**
     * accepts a gulp strams of files to test.
     * Each file is expected to be a module
     * You may transpile them beforehand
     */
    pipeTestableFiles(): Transform;
    /**
     * accepts a gulp stream of test files
     * each test file is spawned as subprocess to speed up test execution.
     * Each spawned test file wile yet get injected any files to test
     */
    pipeTestFiles(): Transform;
    /**
     * runs tests and returns coverage report
     */
    runTests(): Promise<string>;
}
