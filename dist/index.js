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
// interfaces
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
            parallel: true,
            coverage: true
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
        this.testConfig = Object.assign(this.testConfig, testConfigArg);
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
            let parentShellPath = (yield plugins.smartshell.execSilent(`echo $PATH`)).stdout;
            parentShellPath = parentShellPath.replace(/\r?\n|\r/g, ''); //  remove end of line
            plugins.smartipc.startSpawnWrap(plugins.path.join(__dirname, 'spawnhead.js'), [], {
                'TESTABLEFILES_JSON': testableFilesJson,
                'TESTFILES_JSON': testFilesJson,
                'PARENT_ENV': parentEnv
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
                if (this.testConfig.coverage) {
                    // remap the output
                    let remapArray = [];
                    for (let smartfile of fileArray) {
                        remapArray.push(smartfile.path);
                    }
                    let remapCoverage = plugins.remapIstanbul_load(remapArray);
                    let remappedCollector = plugins.remapIstanbul_remap(remapCoverage);
                    let remappedJsonPath = plugins.path.resolve('coverage-final.json');
                    yield plugins.remapIstanbul_write(remappedCollector, 'json', remappedJsonPath);
                    Collector.add(plugins.smartfile.fs.toObjectSync(remappedJsonPath));
                    yield plugins.smartfile.fs.remove(remappedJsonPath);
                    Reporter.addAll(['text', 'lcovonly']);
                    Reporter.write(Collector, true, () => {
                        let lcovInfo = plugins.smartfile.fs.toStringSync(plugins.path.join(process.cwd(), 'coverage/lcov.info'));
                        plugins.smartfile.fs.removeSync(plugins.path.join(process.cwd(), 'coverage'));
                        done.resolve(lcovInfo);
                    });
                }
            })).catch(err => {
                console.log(err);
            });
            return yield done.promise;
        });
    }
}
exports.TabBuffer = TabBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0NBQThDO0FBTTlDLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFcEQsYUFBYTtBQUViOztHQUVHO0FBQ0g7SUFTQzs7T0FFRztJQUNGO1FBWEEsa0JBQWEsR0FBcUMsRUFBRSxDQUFBO1FBQ3BELGNBQVMsR0FBcUMsRUFBRSxDQUFBO1FBRWhELGVBQVUsR0FBcUM7WUFDN0MsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUE7UUFNQyxlQUFlO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhO1FBQ1gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELHlCQUF5QjtJQUN6QixTQUFTLENBQUUsYUFBK0M7UUFDeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUE7SUFDakUsQ0FBQztJQUNEOztPQUVHO0lBQ0csUUFBUTs7WUFDWixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBVSxDQUFBO1lBRXpDLGtC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