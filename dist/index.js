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
                let parsedPath = plugins.path.parse(testFile.path);
                console.log('=======');
                plugins.beautylog.log(`-------------- ${parsedPath.name} --------------`);
                console.log('=======');
                let testPromise = testThread.run().then((childProcess) => {
                    let done = plugins.smartq.defer();
                    childProcess.stdout.pipe(tapMochaReporter('list'));
                    childProcess.on('exit', function () {
                        done.resolve();
                    });
                    return done.promise;
                });
                // wait for tests to complete if not running parallel
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