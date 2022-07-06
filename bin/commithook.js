#!/usr/bin/env node
const importLocal = require('import-local');
const loudRejection = require('loud-rejection');

loudRejection(err => console.error('Internal Error:', err.message))

if (!importLocal(__filename)) {
  require('../dist/cli/commithook.js')
}
