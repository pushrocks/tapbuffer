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
        return done.promise;
    }
}
exports.TabBuffer = TabBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0NBQThDO0FBSTlDLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFcEQ7O0dBRUc7QUFDSDtJQUlDOztPQUVHO0lBQ0Y7UUFOQSxrQkFBYSxHQUFxQyxFQUFFLENBQUE7UUFDcEQsY0FBUyxHQUFxQyxFQUFFLENBQUE7SUFPaEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUI7UUFDZixNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBTyxJQUFJO1lBQzdDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGFBQWE7UUFDWCxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBTyxJQUFJO1lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQVUsQ0FBQTtRQUV6QyxrQkFBa0I7UUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQ25CLGlEQUFpRDtjQUMvQyx5REFBeUQ7Y0FDekQsdURBQXVELENBQzFELENBQUE7UUFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSw0QkFBNEIsQ0FBQyxDQUFBO1FBQ3pGLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxD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