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
            let testThread = new smartipc.Thread(testFile.path);
            let testPromise = testThread.sendOnce({}).then((message) => { }).catch(err => {
                console.log('wow error:');
                console.log(err);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsMEJBQXVCO0FBRXZCLHFDQUFvQztBQUNwQyw4Q0FBNkM7QUFDN0MsNkJBQTRCO0FBQzVCLGlDQUFnQztBQUloQzs7R0FFRztBQUNIO0lBSUM7O09BRUc7SUFDRjtRQU5BLGtCQUFhLEdBQTZCLEVBQUUsQ0FBQTtRQUM1QyxjQUFTLEdBQTZCLEVBQUUsQ0FBQTtJQU94QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlCQUFpQjtRQUNmLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQU8sSUFBSTtZQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhO1FBQ1gsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBTyxJQUFJO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3pCLElBQUksb0JBQW9CLEdBQVEsRUFBRSxDQUFBO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzVELENBQUM7UUFDRCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDeEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQTtRQUMvRixJQUFJLGdCQUFnQixHQUFtQixFQUFFLENBQUE7UUFDekMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuRCxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRztnQkFDdkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtnQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNsQixDQUFDLENBQUMsQ0FBQTtZQUNGLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDaEIsQ0FBQyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUNyQixDQUFDO0NBQ0Y7QUExREQsOEJBMERDIn0=