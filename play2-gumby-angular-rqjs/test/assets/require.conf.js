(function(requirejs) {
    'use strict';

    requirejs.config({
      baseUrl: EnvJasmine.rootDir,
      packages: ['app/todo'],
      shim: {
        'jquery': { exports: '$' },
        'underscore' : { exports: '_' },
        'angular' : { exports : 'angular' },
        'angular-resource' : ['angular'],
        'angular-route' : ['angular'],
        'angular-animate' : ['angular'],
        'angular-cookies' : ['angular'],
        'angular-mock' : ['angular']
      },
      paths: {
        mocks:      EnvJasmine.mocksDir,
        specs:      EnvJasmine.specsDir,
        'jquery': ['http://code.jquery.com/jquery-1.10.2.min'],
        'moment':['http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.3.1/moment.min'],
        'angular': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min'],
        'angular-resource': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-resource.min'],
        'angular-route': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min'],
        'angular-cookies': ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-cookies.min'],
        'angular-animate' : ['http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-animate.min'],
        'angular-mock' : ['http://code.angularjs.org/1.2.14/angular-mocks'],
        'underscore': ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min', 'lib/underscore-min']
      },
      priority: ['angular', 'jquery']
    });

    requirejs.onError = function(err) {
        console.log(err);
    };

})(requirejs);