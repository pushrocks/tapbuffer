// This file gets executed beforehand in every child spawned
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const smartinject = require("smartinject");
let testNumber = parseInt(process.argv[3], 10);
let istanbul = require('istanbul');
let localInstrumenter = new istanbul.Instrumenter({
    coverageVariable: '__coverage__',
    instrumenter: istanbul.Instrumenter
});
let localCollector = new istanbul.Collector();
let localReporter = new istanbul.Reporter(null, `coverage/test-${testNumber}`);
let filesToInject = JSON.parse(process.env.SMARTINJECT);
let fileArray = [];
for (let key in filesToInject) {
    let fileContentString = filesToInject[key];
    let fileInstrumented = localInstrumenter.instrumentSync(fileContentString, key);
    let fileContents = new Buffer(fileInstrumented);
    // push it to fileArray
    fileArray.push({
        path: key,
        contents: new Buffer(fileContents)
    });
}
smartinject.injectFileArray(fileArray);
process.on('exit', function () {
    localCollector.add(global['__coverage__']);
    localReporter.add('json');
    localReporter.write(localCollector, true, () => {
    });
});
require('spawn-wrap').runMain();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25oZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc3Bhd25oZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDREQUE0RDs7O0FBRTVELDJDQUEwQztBQUcxQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUU5QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFFbEMsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDaEQsZ0JBQWdCLEVBQUUsY0FBYztJQUNoQyxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7Q0FDcEMsQ0FBQyxDQUFBO0FBQ0YsSUFBSSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDN0MsSUFBSSxhQUFhLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsVUFBVSxFQUFFLENBQUMsQ0FBQTtBQUM5RSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDdkQsSUFBSSxTQUFTLEdBQTZCLEVBQUUsQ0FBQTtBQUM1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzlCLElBQUksaUJBQWlCLEdBQVcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2xELElBQUksZ0JBQWdCLEdBQVcsaUJBQWlCLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ3ZGLElBQUksWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFFL0MsdUJBQXVCO0lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUM7S0FDbkMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFdEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDakIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUMxQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3pCLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRTtJQUMxQyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBIn0=