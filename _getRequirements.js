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

/**
 * Recursive method to read a composer.json and extract the required
 * dependencies
 */
var getRequirements = function(require, composerPath, deepness) {
    if (typeof(deepness) === 'undefined') {
        deepness = 0;
    }

    // Search into the project composer.json by default
    if (typeof(composerPath) === 'undefined') {
        composerPath = getClosestComposer();
    }

    var composer = JSON.parse(fs.readFileSync(composerPath, 'utf8'));

    if (composer.require) {
        for (var dependency in composer.require) {
            if (!dependencyAlreadyHandled(require, dependency)) {
                require = rmDuplicated(require.concat(dependency));

                var dependencyPath = './vendor/' + dependency;
                if (doFileExists(dependencyPath)) {
                    var dependencyComposerPath = getClosestComposer(dependencyPath);
                    require = getRequirements(require, dependencyComposerPath, deepness++);
                }
            }
        }
    }

    return require;
};

module.exports = getRequirements;
