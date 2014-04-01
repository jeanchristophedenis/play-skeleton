define(['angular','jquery', 'underscore'], function(angular, $, _) {

    var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;

    var directives = angular.module('directives', ['app.services']);

    directives.directive('smartFloat', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    if (FLOAT_REGEXP.test(viewValue)) {

                        var f = parseFloat(viewValue.replace(',', '.'));

                        if(attrs.min) {
                            var min = parseFloat(attrs.min);
                            if(f<min) {
                                ctrl.$setValidity('float', false);
                                return undefined;
                            }
                        }

                        if(attrs.max) {
                            var max = parseFloat(attrs.max);
                            if(f>max) {
                                ctrl.$setValidity('float', false);
                                return undefined;
                            }
                        }

                        ctrl.$setValidity('float', true);
                        return f;
                    } else {
                        ctrl.$setValidity('float', false);
                        return undefined;
                    }
                });
            }
        };
    });

    return directives;
});
