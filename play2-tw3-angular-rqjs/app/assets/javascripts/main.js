(function(requirejs) {
    'use strict';

    requirejs.config({
      packages: ['app/sample'],
      shim: {
        'jquery': { exports: '$' },
        'underscore' : { exports: '_' },
        'jquery-cookie' : ['jquery'],
        'angular' : { exports : 'angular' },
        'ui-utils' : ['angular'],
        'angular-resource' : ['angular'],
        'angular-route': ['angular'],
        'angular-cookies' : ['angular'],
        'angular-animate' : ['angular'],
        'angular-i18-en' : ['angular'],
        'angular-i18-fr' : ['angular'],
        'angular-i18-de' : ['angular'],
        'angular-i18-pt' : ['angular'],
        'typeaheadjs' : ['jquery'],
        'bootstrap-dtp' : { deps: ['bootstrap', 'moment'], exports: 'datetimepicker' }
      },
      paths: {
        'modernizr' : '/webjars/modernizr/2.6.2/modernizr.min',
        'placeholders':'lib/placeholders.min',
        'jquery': ['//code.jquery.com/jquery-1.10.2.min', '/webjars/jquery/1.10.2/jquery.min'],
        'moment':['//cdnjs.cloudflare.com/ajax/libs/moment.js/2.3.1/moment.min', '/webjars/momentjs/2.3.1/min/moment.min'],
        'typeaheadjs' : ['//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.9.3/typeahead.min', 'lib/typeahead.min'],
        'angular': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min', '/webjars/angularjs/1.2.14/angular.min'],
        'angular-resource': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-resource.min', '/webjars/angularjs/1.2.14/angular-resource.min'],
        'angular-route': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min', '/webjars/angularjs/1.2.14/angular-route.min' ],
        'angular-cookies': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-cookies.min', '/webjars/angularjs/1.2.14/angular-cookies.min'],
        'angular-animate' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-animate.min', '/webjars/angularjs/1.2.14/angular-animate.min'],
        'angular-i18-fr' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_fr-fr',
        'angular-i18-de' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_de-de',
        'angular-i18-en' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_en',
        'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min', 'lib/underscore-min'],
        'ui-utils': 'lib/ui-utils.min',
        'bootstrap' : ['//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min','lib/bootstrap.min'],
        'bootstrap-dtp' : 'lib/bootstrap-datetimepicker.min'
      },
      priority: ['angular', 'jquery']
    });

    requirejs.onError = function(err) {
        console.log(err);
    };

    requirejs(['modernizr','angular','jquery', 'moment', 'placeholders'], function(m, angular, $, moment){
        var lang = 'fr';
        require(['bootstrap', 'bootstrap-dtp','angular-i18-'+lang, 'underscore', 'typeaheadjs', 'app/main' ]);
    });
})(requirejs);