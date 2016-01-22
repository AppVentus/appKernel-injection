'use strict';
var fs = require('fs-extra');
var finder = require('fs-finder');
var chalk = require('chalk');
var log = require('./utils/log.js');
var flags = require ('./utils/flags.js');

var cleanPreviousInjection = function(appKernelContent, flags) {
    if (appKernelContent.indexOf(flags.end) === -1) {
        return appKernelContent;
    } else {
        log('...Cleaning the previous automatic injections...');
    }

    var start = 0;
    var end = appKernelContent.length;
    var gapStart = appKernelContent.indexOf(flags.start) + flags.start.length;
    var gapEnd = appKernelContent.indexOf(flags.end) + flags.end.length;

    return appKernelContent.substr(start, gapStart) + appKernelContent.substr(gapEnd, end);
};

var injection = function(bundlesInjections) {
    log('...finding the appKernel.php...');
    var appKernelPath = finder.in('./app').findFiles('AppKernel.php')[0];
    var appKernelContent = fs.readFileSync(appKernelPath, 'utf8');

    log('...Injecting into the appKernel...');
    for (var key in bundlesInjections) {
        var injections = bundlesInjections[key];
        var targetLine = flags[key].start;

        if (appKernelContent.indexOf(targetLine) >= 0) {
            appKernelContent = cleanPreviousInjection(appKernelContent, flags[key]);
            appKernelContent = appKernelContent.replace(targetLine, targetLine + '\n' + injections);
        } else {
            throw 'The AppKernel file must have the following line:\n' + targetLine;
        }
    }

    return fs.writeFileSync(appKernelPath, appKernelContent);
};

module.exports = injection;
