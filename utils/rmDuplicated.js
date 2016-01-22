'use strict';

/**
 * Utils to remove duplicated entry in arrays
 */
var rmDuplicated = function (arr) {
    return arr.filter(function (v, i, a) {
        return a.indexOf (v) === i;
    });
};

module.exports = rmDuplicated;
