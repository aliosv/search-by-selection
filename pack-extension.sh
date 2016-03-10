#!/usr/bin/env node

var PATH = require('path'),
    FS = require('fs'),
    spawn = require('child_process').spawn,

    pluginSourcePath = PATH.join(__dirname, 'desktop.bundles', 'plugin'),
    pluginKeySourcePath = PATH.join(__dirname, 'plugin.pem'),
    exist = function(path) {
        try {
            FS.accessSync(path, FS.F_OK);
            return true;
        } catch(e) {
            return false;
        }
    },
    chromePath = process.env.BROWSER || 'browser.exe';

spawn(chromePath, [
    '--pack-extension=' + pluginSourcePath
].concat(exist(pluginKeySourcePath) ? '--pack-extension-key=' + pluginKeySourcePath : []))
    .on('close', function() {
        var path = PATH.resolve(pluginSourcePath, '..');

        FS.renameSync(PATH.join(path, 'plugin.crx'), PATH.join(__dirname, 'plugin.crx'));
        exist(PATH.join(path, 'plugin.pem')) && FS.renameSync(PATH.join(path, 'plugin.pem'), pluginKeySourcePath);
    });
