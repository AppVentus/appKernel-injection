'use strict';
var fs = require('fs-extra');
var finder = require('fs-finder');

var doFileExists = require('./utils/doFileExists.js');
var rmDuplicated = require('./utils/rmDuplicated.js');
var setIdentation = require('./utils/setIdentation.js');
var log = require('./utils/log.js');
var flags = require ('./utils/flags.js');

var prodExceptions = require('./exceptions/prod.js');
var devExceptions = require('./exceptions/dev.js');

/**
 * Method that will return array of Bundles declarations paths for each
 * dependencies
 */
var bundlesFilter = function(dependencies) {
    var bundles = [];

    for (var key in dependencies) {
        var dependency = dependencies[key];
        var dependencyPath = './vendor/' + dependency;

        if (doFileExists(dependencyPath)) {
            var dependencyBundles = finder.from(dependencyPath).findFiles('*Bundle.php');
            bundles = bundles.concat(dependencyBundles);
        }
    }

    return bundles;
};

var isBundle = function(file) {
    return file.indexOf('use Symfony\\Component\\HttpKernel\\Bundle\\Bundle') > -1;
};

/**
 * Method that will return array of string to include into appKernel.php from
 * an array of bundles.
 */
var appKernelInjections = function(bundles) {
    var injections = {
        prod: [],
        dev: [],
    };

    for (var key in bundles) {
        var bundle = bundles[key];
        var file = fs.readFileSync(bundle, 'utf8');

        if (isBundle(file)) {
            var injection = getClassInjection(file);
            var isDev = isBundleDevException(injection);

            if (isDev) {
                injection = getClassInjection(file, isDev);
                injections.dev = injections.dev.concat(injection);
            } else {
                injections.prod = injections.prod.concat(injection);
            }
        }
    }

    injections.prod = rmDuplicated(injections.prod).filter(appKernelFilter).sort();
    injections.dev = rmDuplicated(injections.dev).filter(appKernelFilter).sort();

    return injections;
};

/**
 * Format the injection
 */
var getClassInjection = function(file, dev) {
    if (typeof(dev) === 'undefined') {
        dev = false;
    }

    var namespace = file.match(/namespace\s(.*)\;/)[1];
    var bundleClass = file.match(/class\s(.*)\sextends/)[1];

    var prefix = 'new ';
    if (dev) {
        prefix = '$bundles[] = new ';
    }

    var suffix = '(),';
    if (dev) {
        suffix = '();';
    }

    if (namespace === 'JMS\\DiExtraBundle' && bundleClass === 'JMSDiExtraBundle') {
        suffix = '($this)';

        if (dev) {
            suffix = suffix + ';';
        } else {
            suffix = suffix + ',';
        }
    }

    return prefix + namespace + '\\' + bundleClass + suffix;
};


/**
 * Method that will return true if an injection must be insert into the dev env
 * condition into the appKernel
 */
var isBundleDevException = function(injection) {
    if (devExceptions.indexOf(injection) >= 0) {
        return true;
    }

    return false;
};

/**
 * Fuction designed for the js filter() method in order to sort bundles we don't
 * want to inject via the module
 */
var appKernelFilter = function(injection) {
    var regexFilter = /(Test)|(^new\sSymfony)|(^new\sAcme\\DemoBundle)/;

    if (prodExceptions.indexOf(injection) >= 0 || injection.match(regexFilter)) {
        return false;
    }

    return true;
};

/**
 * Method that will format into a single string all the bundles injections;
 */
var stringifyBundleInjection = function(bundlesInjections) {
    var injections = {
        prod: '',
        dev: '',
    };
    var indentation = setIdentation(3);

    for (var type in injections) {
        for (var key in bundlesInjections[type]) {
            var injection = bundlesInjections[type][key];
            injections[type] += indentation + injection + '\n';
        }

        injections[type] += flags[type].end;
    }

    return injections;
};

var formatInjections = function(requirements) {
    log('...Sorting between bundles and non-bundle dependencies...');
    var bundles = bundlesFilter(requirements);

    log('...Formating the injection...');
    var bundlesInjections = appKernelInjections(bundles);

    return stringifyBundleInjection(bundlesInjections);
};

module.exports = formatInjections;
