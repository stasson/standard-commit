#!/usr/bin/env node
const importLocal = require('import-local');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const loudRejection = require('loud-rejection');

loudRejection(err => console.error('Internal Error:', err.message))

updateNotifier({pkg}).notify();
if (!importLocal(__filename)) {
  require('../dist/cli/commit.js')
}
