'use strict';

var setIdentation = function(number, singleIndent) {
    var indentation = '';

    if (typeof(singleIndent) === 'undefined') {
        singleIndent = '    ';
    }

    for (var i = 0; i < number; i++) {
        indentation += singleIndent;
    }

    return indentation;
};

module.exports = setIdentation;
