// This file gets executed beforehand in every child spawned
"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25oZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc3Bhd25oZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDREQUE0RDs7O0FBRTVELDJDQUEwQztBQUcxQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFFckQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRWxDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ2hELGdCQUFnQixFQUFFLGNBQWM7SUFDaEMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0NBQ3BDLENBQUMsQ0FBQTtBQUNGLElBQUksY0FBYyxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQzdDLElBQUksYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDOUUsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3ZELElBQUksU0FBUyxHQUE2QixFQUFFLENBQUE7QUFDNUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFJLGlCQUFpQixHQUFXLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsRCxJQUFJLGdCQUFnQixHQUFXLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUN2RixJQUFJLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRS9DLHVCQUF1QjtJQUN2QixTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2IsSUFBSSxFQUFFLEdBQUc7UUFDVCxRQUFRLEVBQUUsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDO0tBQ25DLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxXQUFXLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRXRDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO0lBQ2pCLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7SUFDMUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN6QixhQUFhLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUU7SUFDMUMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQSJ9