'use strict';

var prodExceptions = [
    'new Doctrine\\Bundle\\DoctrineBundle\\DoctrineBundle(),',
    'new Fixtures\\Bundles\\AnnotationsBundle\\AnnotationsBundle(),',
    'new Fixtures\\Bundles\\Vendor\\AnnotationsBundle\\AnnotationsBundle(),',
    'new Fixtures\\Bundles\\XmlBundle\\XmlBundle(),',
    'new Fixtures\\Bundles\\YamlBundle\\YamlBundle(),',
    'new Doctrine\\Bundle\\DoctrineCacheBundle\\DoctrineCacheBundle(),',
    'new Fixtures\\Bundles\\YamlBundle\\XmlBundle(),',
    'new Sensio\\Bundle\\FrameworkExtraBundle\\SensioFrameworkExtraBundle(),',
    'new Sensio\\Bundle\\DistributionBundle\\SensioDistributionBundle(),',
];

module.exports = prodExceptions;
