"use strict";
// This file gets executed beforehand in every child spawned
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
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
let testableFilesToInject = JSON.parse(process.env.TESTABLEFILESJSON);
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
let testFilesToInject = JSON.parse(process.env.TESTFILESJSON);
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
let parentEnv = JSON.parse(process.env.PARENTENV);
for (let key in parentEnv) {
    if (!process.env[key]) {
        process.env[key] = parentEnv[key];
    }
}
process.on('exit', function () {
    localCollector.add(global['__coverage__']);
    localReporter.add('json');
    localReporter.write(localCollector, true, () => {
    });
});
require('spawn-wrap').runMain();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25oZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc3Bhd25oZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0REFBNEQ7O0FBRTVELE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3ZDLDJDQUEwQztBQUcxQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFFckQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRWxDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ2hELGdCQUFnQixFQUFFLGNBQWM7SUFDaEMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0NBQ3BDLENBQUMsQ0FBQTtBQUNGLElBQUksY0FBYyxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQzdDLElBQUksYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFFOUUsdUJBQXVCO0FBQ3ZCLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDckUsSUFBSSxTQUFTLEdBQTZCLEVBQUUsQ0FBQTtBQUM1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDdEMsSUFBSSxpQkFBaUIsR0FBVyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMxRCxJQUFJLGdCQUFnQixHQUFXLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUN2RixJQUFJLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFFckQsdUJBQXVCO0lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULFFBQVEsRUFBRSxrQkFBa0I7S0FDN0IsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELG1CQUFtQjtBQUNuQixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM3RCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDbEMsSUFBSSxpQkFBaUIsR0FBVyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN0RCxJQUFJLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFFdEQsdUJBQXVCO0lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULFFBQVEsRUFBRSxrQkFBa0I7S0FDN0IsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFdEMsaUNBQWlDO0FBQ2pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNqRCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkMsQ0FBQztBQUNILENBQUM7QUFFRCxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtJQUNqQixjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBO0lBQzFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDekIsYUFBYSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFO0lBQzFDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUEifQ==