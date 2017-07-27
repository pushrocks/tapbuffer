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
        this.testConfig = plugins.smartlodash.merge(this.testConfig, testConfigArg);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0NBQThDO0FBTTlDLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFcEQsYUFBYTtBQUViOztHQUVHO0FBQ0g7SUFTQzs7T0FFRztJQUNGO1FBWEEsa0JBQWEsR0FBcUMsRUFBRSxDQUFBO1FBQ3BELGNBQVMsR0FBcUMsRUFBRSxDQUFBO1FBRWhELGVBQVUsR0FBbUM7WUFDM0MsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUE7UUFNQyxlQUFlO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhO1FBQ1gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELHlCQUF5QjtJQUN6QixTQUFTLENBQUUsYUFBNkM7UUFDdEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQzdFLENBQUM7SUFDRDs7T0FFRztJQUNHLFFBQVE7O1lBQ1osSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQVUsQ0FB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