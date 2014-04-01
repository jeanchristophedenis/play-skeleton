requirejs.config({
    packages: ['app/todo'],
    shim: {
        'jquery': { exports: '$' },
        'jquery-cookie' : ['jquery'],
        'angular' : { exports : 'angular' },
        'angular-resource' : ['angular'],
        'angular-route': ['angular'],
        'angular-cookies' : ['angular'],
        'angular-animate' : ['angular'],
        'angular-i18-en' : ['angular'],
        'angular-i18-fr' : ['angular'],
        'angular-i18-de' : ['angular'],
        'angular-i18-pt' : ['angular'],
        'underscore' : { exports: '_' }
    },
    paths: {
        'jquery': 'empty:',
        'jquery-cookie' : 'lib/jquery.cookie.min',
        'modernizr': 'empty:',
        'moment':'//cdnjs.cloudflare.com/ajax/libs/moment.js/2.3.1/moment.min',
        'placeholders':'lib/placeholders.min',
        'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min',
        'angular-resource': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-resource.min',
        'angular-route': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min',
        'angular-cookies': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-cookies.min',
        'angular-animate' : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-animate.min',
        'angular-i18-fr' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_fr-fr',
        'angular-i18-de' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_de-de',
        'angular-i18-en' : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.10/angular-locale_en',
        'underscore': 'lib/underscore-min'
    },
    priority: ['angular', 'jquery']
});