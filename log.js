'use strict';
const fs = require('fs');

// Source - https://stackoverflow.com/a/75276021
// Posted by Angelo II
// Retrieved 2026-02-02, License - CC BY-SA 4.0

const mylog = new console.Console(
  fs.createWriteStream('log/logger.log'),
  fs.createWriteStream('log/error.log'),
);

module.exports = mylog;
