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
const smartava = require("../dist/index");
const path = require("path");
const gulp = require("gulp");
const smartq = require("smartq");
const gulpFunction = require("gulp-function");
let mySmartava = new smartava.Smartava();
let testAblesReady = smartq.defer();
let testFilesReady = smartq.defer();
gulp.src(path.join(__dirname, 'testablefiles/**/*.js'))
    .pipe(mySmartava.pipeTestableFiles())
    .pipe(gulpFunction.atEnd(() => __awaiter(this, void 0, void 0, function* () {
    testAblesReady.resolve();
})));
gulp.src(path.join(__dirname, 'testfiles/**/*.js'))
    .pipe(mySmartava.pipeTestFiles())
    .pipe(gulpFunction.atEnd(() => __awaiter(this, void 0, void 0, function* () {
    testFilesReady.resolve();
})));
Promise.all([testAblesReady.promise, testFilesReady.promise])
    .then(() => {
    console.log('ready');
    mySmartava.runTests();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDBCQUF1QjtBQUV2QiwwQ0FBeUM7QUFDekMsNkJBQTRCO0FBQzVCLDZCQUE0QjtBQUM1QixpQ0FBZ0M7QUFDaEMsOENBQTZDO0FBRTdDLElBQUksVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBRXhDLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNuQyxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7QUFFbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0tBQ3BELElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztJQUN2QixjQUFjLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDMUIsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBO0FBRUwsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0tBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDdkIsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzFCLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQTtBQUVMLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMxRCxJQUFJLENBQUM7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3BCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUN2QixDQUFDLENBQUMsQ0FBQSJ9