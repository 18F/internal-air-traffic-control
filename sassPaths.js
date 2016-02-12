"use strict";
const path = require("path");

let paths = [ ];
paths = paths.concat(require('18f-contrib-web-design-standards').includePaths);
paths.push(path.join(path.dirname(require.resolve("react-select")), "../scss"));

console.log(paths.join(":"));
