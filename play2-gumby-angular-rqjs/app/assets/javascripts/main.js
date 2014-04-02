(function(requirejs) {
    'use strict';

    requirejs.config({
      packages: ['app/todo'],
      shim: {
        'jquery': { exports: '$' },
        'underscore' : { exports: '_' },
        'angular' : { exports : 'angular' },
        'angular-resource' : ['angular'],
        'angular-route': ['angular'],
        'angular-cookies' : ['angular'],
        'angular-animate' : ['angular'],
        'angular-i18-en' : ['angular'],
        'angular-i18-fr' : ['angular'],
        'angular-i18-de' : ['angular'],
        'angular-i18-pt' : ['angular']
      },
      paths: {
        'modernizr' : 'lib/gumby/libs/modernizr-2.6.2.min',
        'jquery': ['//code.jquery.com/jquery-1.10.2.min', '/webjars/jquery/1.10.2/jquery.min'],
        'moment':['//cdnjs.cloudflare.com/ajax/libs/moment.js/2.3.1/moment.min', '/webjars/momentjs/2.3.1/min/moment.min'],
        'angular': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min', '/webjars/angularjs/1.2.14/angular.min'],
        'angular-resource': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-resource.min', '/webjars/angularjs/1.2.14/angular-resource.min'],
        'angular-route': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min', '/webjars/angularjs/1.2.14/angular-route.min' ],
        'angular-cookies': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-cookies.min', '/webjars/angularjs/1.2.14/angular-cookies.min'],
        'angular-animate' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-animate.min', '/webjars/angularjs/1.2.14/angular-animate.min'],
        'angular-i18-fr' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_fr-fr',
        'angular-i18-de' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_de-de',
        'angular-i18-en' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_en',
        'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min', 'lib/underscore-min']
      },
      priority: ['angular', 'jquery']
    });

    requirejs.onError = function(err) {
        console.log(err);
    };

    requirejs(['modernizr', 'angular','jquery', 'moment'], function(m, angular, $, moment){
        var lang = 'en';
        require(['angular-i18-'+lang, 'underscore', 'app/main', 'gumby-init']);
    });
})(requirejs);