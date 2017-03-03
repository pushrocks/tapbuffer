// This file gets executed beforehand in every child spawned
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const smartinject = require("smartinject");
let filesToInject = JSON.parse(process.env.SMARTINJECT);
let fileArray = [];
for (let key in filesToInject) {
    fileArray.push({
        path: key,
        contents: new Buffer(filesToInject[key])
    });
}
smartinject.injectFileArray(fileArray);
require('spawn-wrap').runMain();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25oZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc3Bhd25oZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDREQUE0RDs7O0FBRTVELDJDQUEwQztBQUUxQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDdkQsSUFBSSxTQUFTLEdBQTZCLEVBQUUsQ0FBQTtBQUM1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzlCLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDekMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFdEMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBIn0=