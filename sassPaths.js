'use strict';
const path = require('path');

let paths = [ ];
paths = paths.concat(require('18f-contrib-web-design-standards').includePaths);

console.log(paths.join(':'));
