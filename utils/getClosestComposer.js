'use strict';
var finder = require('fs-finder');

/**
 * Method to get a composer.json from a base root;
 */
var getClosestComposer = function (rootSearch) {
    // Search at the rootPath by default
    if (typeof(rootSearch) === 'undefined') {
        rootSearch = './';
    }

    return finder.from(rootSearch).findFiles('composer.json')[0];
};


module.exports = getClosestComposer;
