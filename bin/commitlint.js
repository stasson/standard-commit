#!/usr/bin/env node
const importLocal = require('import-local');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({pkg}).notify();
if (!importLocal(__filename)) {
  require('../dist/cli/commitlint.js')
}
