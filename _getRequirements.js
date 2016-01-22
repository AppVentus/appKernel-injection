'use strict';
var fs = require('fs-extra');
var chalk = require('chalk');

var getClosestComposer = require('./utils/getClosestComposer.js');
var rmDuplicated = require('./utils/rmDuplicated.js');
var doFileExists = require('./utils/doFileExists.js');

/**
 * Watch dog method to make sure this dependency is not treaten yet into the
 * getRequirementsAll() method
 */
var dependencyAlreadyHandled = function(require, dependency) {
    for (var i = 0; i < require.length; i++) {

        if (require[i] === dependency) {
            return true;
        }
    }

    return false;
};

var addInRequirements = function(require, type, dependency) {
    if (!dependencyAlreadyHandled(require[type], dependency)) {
        require[type] = rmDuplicated(require[type].concat(dependency));

        var dependencyPath = './vendor/' + dependency;
        if (doFileExists(dependencyPath)) {
            var dependencyComposerPath = getClosestComposer(dependencyPath);
            return getRequirements(require, dependencyComposerPath);
        }
    }

    return require;
};

/**
 * Recursive method to read a composer.json and extract the required
 * dependencies
 */
var getRequirements = function(require, composerPath) {
    if (typeof(require) === 'undefined') {
        require = {
            prod: [],
            dev: []
        };
    }

    // Search into the project composer.json by default
    if (typeof(composerPath) === 'undefined') {
        composerPath = getClosestComposer();
    }

    var composer = JSON.parse(fs.readFileSync(composerPath, 'utf8'));

    if (composer.require) {
        for (var prod_dependency in composer.require) {
            require = addInRequirements(require, 'prod', prod_dependency);
        }
    }

    if (composer['require-dev']) {
        for (var dev_dependency in composer['require-dev']) {
            require = addInRequirements(require, 'dev', dev_dependency);
        }
    }

    return require;
};

module.exports = getRequirements;
