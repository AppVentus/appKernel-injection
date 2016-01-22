'use strict';
var chalk = require('chalk');

var log = function(string, success) {
    if (success) {
        string = chalk.green(string);
    }

    console.log(chalk.yellow('[AppKernel Injection]') + ' ' + string);
};

module.exports = log;
