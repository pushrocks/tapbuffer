"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins = require("./tapbuffer.plugins");
let tapMochaReporter = require('tap-mocha-reporter');
/**
 * Smartava class allows the setup of tests
 */
class TabBuffer {
    /**
     * the constructor of class Smartava
     */
    constructor() {
        this.testableFiles = [];
        this.testFiles = [];
    }
    /**
     * accepts a gulp strams of files to test.
     * Each file is expected to be a module
     * You may transpile them beforehand
     */
    pipeTestableFiles() {
        return plugins.gulpFunction.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            this.testableFiles.push(file);
        }));
    }
    /**
     * accepts a gulp stream of test files
     * each test file is spawned as subprocess to speed up test execution.
     * Each spawned test file wile yet get injected any files to test
     */
    pipeTestFiles() {
        return plugins.gulpFunction.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            this.testFiles.push(file);
        }));
    }
    /**
     * runs tests and returns coverage report
     */
    runTests() {
        let done = plugins.smartq.defer();
        plugins.beautylog.log(`---------------------------------------------\n`
            + `-------------------- tapbuffer ----------------------\n`
            + `-----------------------------------------------------`);
        plugins.beautylog.info(`received ${this.testableFiles.length} modulefile(s) for testing`);
        plugins.beautylog.info(`received ${this.testFiles.length} test files`);
        plugins.beautylog.info(`Coverage will be provided by istanbul`);
        let testableMessageFiles = {};
        for (let file of this.testableFiles) {
            testableMessageFiles[file.path] = file.contents.toString();
        }
        let threadMessage = JSON.stringify(testableMessageFiles);
        plugins.smartipc.startSpawnWrap(plugins.path.join(__dirname, 'spawnhead.js'), [], { 'SMARTINJECT': threadMessage });
        let testPromiseArray = [];
        let testCounter = 0;
        for (let testFile of this.testFiles) {
            testCounter++;
            let testThread = new plugins.smartipc.ThreadSimple(testFile.path, [], { silent: true, env: { TESTNUMBER: `${testCounter.toString()}` } });
            let testPromise = testThread.run().then((childProcess) => {
                let done = plugins.smartq.defer();
                childProcess.stdout.pipe(tapMochaReporter('list'));
                childProcess.on('exit', function () {
                    done.resolve();
                });
                return done.promise;
            });
            testPromiseArray.push(testPromise);
        }
        Promise.all(testPromiseArray).then(() => __awaiter(this, void 0, void 0, function* () {
            let Collector = new plugins.istanbul.Collector();
            let Reporter = new plugins.istanbul.Reporter();
            let fileArray = yield plugins.smartfile.fs.fileTreeToObject(process.cwd(), 'coverage/**/coverage-final.json');
            for (let smartfile of fileArray) {
                Collector.add(JSON.parse(smartfile.contents.toString()));
            }
            Reporter.add('text');
            Reporter.write(Collector, true, () => {
                done.resolve();
            });
        })).catch(err => {
            console.log(err);
        });
        return done.promise;
    }
}
exports.TabBuffer = TabBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0NBQThDO0FBSTlDLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFcEQ7O0dBRUc7QUFDSDtJQUlDOztPQUVHO0lBQ0Y7UUFOQSxrQkFBYSxHQUFxQyxFQUFFLENBQUE7UUFDcEQsY0FBUyxHQUFxQyxFQUFFLENBQUE7SUFPaEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUI7UUFDZixNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBTyxJQUFJO1lBQzdDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGFBQWE7UUFDWCxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBTyxJQUFJO1lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNqQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDbkIsaURBQWlEO2NBQy9DLHlEQUF5RDtjQUN6RCx1REFBdUQsQ0FDMUQsQ0FBQTtRQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLDRCQUE0QixDQUFDLENBQUE7UUFDekYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFD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