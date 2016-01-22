'use strict';
var fs = require('fs-extra');

/*
 * Method that return true or false, depending if a file passed as param exist
 * or not. This method is deprecated, but no other synchronous way convince for
 * now
 */
var doFileExists = function(path) {
    if (fs.existsSync(path)) {
        return true;
    }

    return false;
};

module.exports = doFileExists;
