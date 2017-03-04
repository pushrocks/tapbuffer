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
require("typings-global");
const smartipc = require("smartipc");
const gulpFunction = require("gulp-function");
const path = require("path");
const smartq = require("smartq");
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
        return gulpFunction.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            this.testableFiles.push(file);
        }));
    }
    /**
     * accepts a gulp stream of test files
     * each test file is spawned as subprocess to speed up test execution.
     * Each spawned test file wile yet get injected any files to test
     */
    pipeTestFiles() {
        return gulpFunction.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            this.testFiles.push(file);
        }));
    }
    /**
     * runs tests and returns coverage report
     */
    runTests() {
        let done = smartq.defer();
        let testableMessageFiles = {};
        for (let file of this.testableFiles) {
            testableMessageFiles[file.path] = file.contents.toString();
        }
        let threadMessage = JSON.stringify(testableMessageFiles);
        smartipc.startSpawnWrap(path.join(__dirname, 'spawnhead.js'), [], { 'SMARTINJECT': threadMessage });
        let testPromiseArray = [];
        for (let testFile of this.testFiles) {
            let testThread = new smartipc.ThreadSimple(testFile.path, { silent: true });
            let testPromise = testThread.run().then((childProcess) => {
                let done = smartq.defer();
                childProcess.stdout.pipe(tapMochaReporter('list'));
                childProcess.on('exit', function () {
                    done.resolve();
                });
                return done.promise;
            });
            testPromiseArray.push(testPromise);
        }
        Promise.all(testPromiseArray).then(() => {
            done.resolve();
        });
        return done.promise;
    }
}
exports.TabBuffer = TabBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsMEJBQXVCO0FBRXZCLHFDQUFvQztBQUNwQyw4Q0FBNkM7QUFDN0MsNkJBQTRCO0FBQzVCLGlDQUFnQztBQUdoQyxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBRXBEOztHQUVHO0FBQ0g7SUFJQzs7T0FFRztJQUNGO1FBTkEsa0JBQWEsR0FBNkIsRUFBRSxDQUFBO1FBQzVDLGNBQVMsR0FBNkIsRUFBRSxDQUFBO0lBT3hDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBTyxJQUFJO1lBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGFBQWE7UUFDWCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFPLElBQUk7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7UUFDTixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDekIsSUFBSSxvQkFBb0IsR0FBUSxFQUFFLENBQUE7UUFDbEMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDcEMsb0JBQW9CLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDOUQsQ0FBQztRQUNELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUN4RCxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO1FBQ25HLElBQUksZ0JBQWdCLEdBQW1CLEVBQUUsQ0FBQTtRQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLFVBQVUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1lBQ3pFLElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZO2dCQUNuRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQ3pCLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUN0QixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FDekIsQ0FBQTtnQkFDRCxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtvQkFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUNoQixDQUFDLENBQUMsQ0FBQTtnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtZQUNyQixDQUFDLENBQUMsQ0FBQTtZQUNGLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDaEIsQ0FBQyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUNyQixDQUFDO0NBQ0Y7QUFoRUQsOEJBZ0VDIn0=