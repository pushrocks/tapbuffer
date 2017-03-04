/// <reference types="node" />
import 'typings-global';
import * as smartinject from 'smartinject';
import * as smartipc from 'smartipc';
import { Transform } from 'stream';
/**
 * Smartava class allows the setup of tests
 */
export declare class TabBuffer {
    testableFiles: smartinject.fileObject[];
    testFiles: smartinject.fileObject[];
    testThreads: smartipc.Thread[];
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
    runTests(): Promise<{}>;
}
