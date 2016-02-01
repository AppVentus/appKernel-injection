# appKernel-injection
Node.js module to inject Symfony 2 bundles into appKernel from composer.json file

## Download
You can download the node package via [npm](https://github.com/npm/npm)
```sh
npm install --save-dev appkernel-injection
```

## Usage
The module will inject into the `app/AppKernel.php` file all the bundles required by your vendors.

### Flags
Before running the module, you have to add into your `AppKernel.php` file what we call 'flags'. Flags are just comment line, that will designate where the bundles must be injected. There is two types of flags :

* The flag for the bundles that will be used in production : `// Automatic AppKernel:prod injection`
* The flag for the bundles only used in development :  `// Automatic AppKernel:dev injection`

So your `AppKernel.php` file must look like this :

```php
<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),

            // Automatic AppKernel:prod injection
        );

        if (in_array($this->getEnvironment(), array('dev', 'test'), true)) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();

            // Automatic AppKernel:dev injection
        }

        return $bundles;
    }

    ...
}
```

### Injection
Once the flags are in the `AppKernel.php`, you can just run the module as any node.js module

```js
'use strict';
 var akInjection = require('appkernel-injection');

 var make = function() {
    akInjection();
 }
```
