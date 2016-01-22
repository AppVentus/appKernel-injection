'use strict';
var getRequirements = require('./_getRequirements.js');
var formatInjections = require('./_formatInjections.js');
var injector = require('./_injector.js');
var log = require('./utils/log.js');

var autoAppKernel = function() {
    log('Getting all the dependencies required...');
    var requirements = getRequirements();
    var bundlesInjections = formatInjections(requirements);
    var injection = injector(bundlesInjections);

    log('...Injection done !', true);
    return injection;
};

module.exports = autoAppKernel;
