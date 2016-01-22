'use strict';

var setIdentation = require('./setIdentation.js');

var flags = {
    prod: {
        start: '\n' + setIdentation(3) + '// Automatic AppKernel:prod injection',
        end: setIdentation(3) +  '// End automatic AppKernel:prod injection',
    },
    dev: {
        start: '\n' + setIdentation(3) + '// Automatic AppKernel:dev injection',
        end: setIdentation(3) + '// End automatic AppKernel:dev injection',
    },
};

module.exports = flags;
