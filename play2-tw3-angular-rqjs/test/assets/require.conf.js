(function(requirejs) {
    'use strict';

    requirejs.config({
      baseUrl: EnvJasmine.rootDir,
      packages: [],
      shim: {
        'jquery': { exports: '$' },
        'angular' : { exports : 'angular' },
        'ui-utils' : ['angular'],
        'angular-resource' : ['angular'],
        'angular-cookies' : ['angular'],
        'angular-mock' : ['angular']
      },
      paths: {
        mocks:      EnvJasmine.mocksDir,
        specs:      EnvJasmine.specsDir,
        'jquery': ['http://code.jquery.com/jquery-1.10.2.min', '/webjars/jquery/1.10.2/jquery.min'],
        'angular': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min', '/webjars/angularjs/1.2.14/angular.min'],
        'angular-resource': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-resource.min', '/webjars/angularjs/1.2.14/angular-resource.min'],
        'angular-cookies': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-cookies.min', '/webjars/angularjs/1.2.14/angular-cookies.min'],
        'angular-mock' : ['http://code.angularjs.org/1.2.14/angular-mocks'],
        'ui-utils': 'lib/ui-utils.min'
      },
      priority: ['angular', 'jquery']
    });

    requirejs.onError = function(err) {
        console.log(err);
    };

})(requirejs);