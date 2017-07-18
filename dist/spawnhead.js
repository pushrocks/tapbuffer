"use strict";
// This file gets executed beforehand in every child spawned
Object.defineProperty(exports, "__esModule", { value: true });
const smartinject = require("smartinject");
let testNumber = parseInt(process.env.TESTNUMBER, 10);
let istanbul = require('istanbul');
let localInstrumenter = new istanbul.Instrumenter({
    coverageVariable: '__coverage__',
    instrumenter: istanbul.Instrumenter
});
let localCollector = new istanbul.Collector();
let localReporter = new istanbul.Reporter(null, `coverage/test-${testNumber}`);
// handle testableFiles
let testableFilesToInject = JSON.parse(process.env.TESTABLEFILES_JSON);
let fileArray = [];
for (let key in testableFilesToInject) {
    let fileContentString = testableFilesToInject[key];
    let fileInstrumented = localInstrumenter.instrumentSync(fileContentString, key);
    let fileContentsBuffer = new Buffer(fileInstrumented);
    // push it to fileArray
    fileArray.push({
        path: key,
        contents: fileContentsBuffer
    });
}
// handle testFiles
let testFilesToInject = JSON.parse(process.env.TESTFILES_JSON);
for (let key in testFilesToInject) {
    let fileContentString = testFilesToInject[key];
    let fileContentsBuffer = new Buffer(fileContentString);
    // push it to fileArray
    fileArray.push({
        path: key,
        contents: fileContentsBuffer
    });
}
smartinject.injectFileArray(fileArray);
// handle parent env distribution
let parentEnv = JSON.parse(process.env.PARENT_ENV);
for (let key in parentEnv) {
    if (!process.env[key]) {
        process.env[key] = parentEnv[key];
    }
}
// handle Shell Path distribution
process.env.SMARTSHELL_PATH = process.env.PARENT_SHELLPATH;
// handle exit
process.on('exit', function () {
    localCollector.add(global['__coverage__']);
    localReporter.add('json');
    localReporter.write(localCollector, true, () => {
    });
});
require('spawn-wrap').runMain();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25oZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc3Bhd25oZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0REFBNEQ7O0FBRzVELDJDQUEwQztBQUcxQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFFckQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRWxDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ2hELGdCQUFnQixFQUFFLGNBQWM7SUFDaEMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0NBQ3BDLENBQUMsQ0FBQTtBQUNGLElBQUksY0FBYyxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQzdDLElBQUksYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFFOUUsdUJBQXVCO0FBQ3ZCLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFDdEUsSUFBSSxTQUFTLEdBQTZCLEVBQUUsQ0FBQTtBQUM1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDdEMsSUFBSSxpQkFBaUIsR0FBVyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMxRCxJQUFJLGdCQUFnQixHQUFXLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUN2RixJQUFJLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFFckQsdUJBQXVCO0lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULFFBQVEsRUFBRSxrQkFBa0I7S0FDN0IsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELG1CQUFtQjtBQUNuQixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM5RCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDbEMsSUFBSSxpQkFBaUIsR0FBVyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN0RCxJQUFJLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFFdEQsdUJBQXVCO0lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULFFBQVEsRUFBRSxrQkFBa0I7S0FDN0IsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFdEMsaUNBQWlDO0FBQ2pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNsRCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkMsQ0FBQztBQUNILENBQUM7QUFFRCxpQ0FBaUM7QUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQTtBQUUxRCxjQUFjO0FBQ2QsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDakIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUMxQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3pCLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRTtJQUMxQyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBIn0=