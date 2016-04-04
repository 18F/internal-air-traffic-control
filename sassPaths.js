'use strict';
const path = require('path');

let paths = [ ];
paths = paths.concat(require('18f-contrib-web-design-standards').includePaths);
paths.push(path.join(path.dirname(require.resolve('react-select')), '../scss'));
paths.push(path.dirname(require.resolve('c3')));

console.log(paths.join(':'));
