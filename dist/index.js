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
        this.testConfig = {
            parallel: true
        };
        // nothing here
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
    // allows to set a config
    setConfig(testConfigArg) {
        this.testConfig = testConfigArg;
    }
    /**
     * runs tests and returns coverage report
     */
    runTests() {
        return __awaiter(this, void 0, void 0, function* () {
            let done = plugins.smartq.defer();
            // print some info
            plugins.beautylog.log(`---------------------------------------------\n`
                + `-------------------- tapbuffer ----------------------\n`
                + `-----------------------------------------------------`);
            plugins.beautylog.info(`received ${this.testableFiles.length} modulefile(s) for testing`);
            plugins.beautylog.info(`received ${this.testFiles.length} test files`);
            plugins.beautylog.info(`Coverage will be provided by istanbul`);
            // handle testableFiles
            let testableFilesMessage = {};
            for (let file of this.testableFiles) {
                testableFilesMessage[file.path] = file.contents.toString();
            }
            // handle testFiles
            let testFilesMessage = {};
            for (let file of this.testFiles) {
                testFilesMessage[file.path] = file.contents.toString();
            }
            // prepare injection handoff
            let testableFilesJson = JSON.stringify(testableFilesMessage);
            let testFilesJson = JSON.stringify(testFilesMessage);
            let parentEnv = JSON.stringify(process.env);
            plugins.smartipc.startSpawnWrap(plugins.path.join(__dirname, 'spawnhead.js'), [], {
                'TESTABLEFILESJSON': testableFilesJson,
                'TESTFILESJSON': testFilesJson,
                'PARENTENV': parentEnv
            });
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
                if (!this.testConfig.parallel) {
                    yield testPromise;
                }
                testPromiseArray.push(testPromise);
            }
            Promise.all(testPromiseArray).then(() => __awaiter(this, void 0, void 0, function* () {
                let Collector = new plugins.istanbul.Collector();
                let Reporter = new plugins.istanbul.Reporter();
                let fileArray = yield plugins.smartfile.fs.fileTreeToObject(process.cwd(), 'coverage/**/coverage-final.json');
                for (let smartfile of fileArray) {
                    Collector.add(JSON.parse(smartfile.contents.toString()));
                }
                Reporter.addAll(['text', 'lcovonly']);
                Reporter.write(Collector, true, () => {
                    let lcovInfo = plugins.smartfile.fs.toStringSync(plugins.path.join(process.cwd(), 'coverage/lcov.info'));
                    plugins.smartfile.fs.removeSync(plugins.path.join(process.cwd(), 'coverage'));
                    done.resolve(lcovInfo);
                });
            })).catch(err => {
                console.log(err);
            });
            return yield done.promise;
        });
    }
}
exports.TabBuffer = TabBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0NBQThDO0FBSzlDLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFcEQ7O0dBRUc7QUFDSDtJQVFDOztPQUVHO0lBQ0Y7UUFWQSxrQkFBYSxHQUFxQyxFQUFFLENBQUE7UUFDcEQsY0FBUyxHQUFxQyxFQUFFLENBQUE7UUFFaEQsZUFBVSxHQUFtQztZQUMzQyxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUE7UUFNQyxlQUFlO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhO1FBQ1gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELHlCQUF5QjtJQUN6QixTQUFTLENBQUUsYUFBNkM7UUFDdEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUE7SUFDakMsQ0FBQztJQUNEOztPQUVHO0lBQ0csUUFBUTs7WUFDWixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBVSxDQUFBO1lBRXpDLGtCQUFrQjtZQUNsQixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDbkIsaURBQWlEO2tCQUMvQyx5REFBeUQ7a0JBQ3pELHVEQUF1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