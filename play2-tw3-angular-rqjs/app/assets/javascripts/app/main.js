define(['jquery','angular', 'angular-resource','angular-route', 'angular-cookies', 'angular-animate', 'ui-utils', './directives', 'app/sample'],function($, angular){

    'use strict';

    angular.module('app.services', []).factory("appServices", ['$rootScope', function($rootScope) {
        var timer;
        return {
            loading : function() {
                clearTimeout(timer);
                $rootScope.status = 'loading';
                if(!$rootScope.$$phase) $rootScope.$apply();
            },
            ready : function(delay) {

                function ready() {
                    $rootScope.status = 'ready';
                    if(!$rootScope.$$phase) $rootScope.$apply();
                }

                clearTimeout(timer);
                delay = delay == null ? 500 : false;
                if(delay) {
                    timer = setTimeout(ready, delay);
                }
                else {
                    ready();
                }
            },
            isReady : function() {
                return $rootScope.status === 'ready';
            }
        };
    }]);

    angular.bootstrap(document, ['ngResource', 'ngRoute', 'ngCookies', 'ngAnimate', 'ui.utils', 'directives', 'app.services', 'sample']);
});