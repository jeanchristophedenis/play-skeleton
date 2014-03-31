define(['angular','jquery', 'underscore', 'typeaheadjs', 'bootstrap-dtp'], function(angular, $, _, typeaheadjs) {

    var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;

    var ENGINE = {
        cache: {},
        generate: function (str, data) {
            // based on https://gist.github.com/padolsey/6008842
            str = str.replace(/%% *([\w_]+) *%%/g, function (str, key) {
                return '" + o["' + key + '"]' + (typeof data[key] === 'function' ? '(o)' : '') + ' + "';
            });
            // jshint evil: true
            // render function is required
            return { render: new Function('o', 'return "' + str + '";') };
        },
        compile: function (str, data) {
            data = data || {};
            var t = this.cache[str];
            if (t) {
                return t;
            }
            t = this.generate(str, data);
            return this.cache[str] = t;
        }
    };

    var directives = angular.module('directives', ['app.services']);

    // TypeaheadJs directive base on https://github.com/twitter/typeahead.js, version 0.9.3
    directives.directive('typeahead', ['$parse','appServices', function($parse, appServices) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ctrl) {

                if (!ctrl) return; // do nothing if no ng-model
                var getter = $parse(attrs.ngModel),       // accessor for ng-model assign to input value (string value)
                    setter = getter.assign;


                var datumGetter = $parse(attrs.datumModel), // accessor for ng-model assign to datum object (complex value)
                    datumSetter = datumGetter.assign;

                element.on('$destroy', function () {
                    try {
                        $(element).typeahead('destroy');
                    } catch (e) {
                    }
                });

                var elementId = $(element).id;
                var opts = {};

                var buildOpts = function(){

                    opts = {
                        name: elementId, // local cache name for dataset is linked to element ID
                        valueKey: attrs['typeahead'],
                        engine: ENGINE
                    };

                    if(attrs.typeaheadLimit) {
                        opts.limit = attrs.typeaheadLimit;
                    }

                    if(attrs.urlPrefetch) {
                        opts.prefetch = { url: attrs.urlPrefetch, filter: transform, ttl:21600000 };
                    }

                    if(attrs.urlRemote) {

                        var urlOptions = ""
                        if(attrs.urlOptions) {
                            urlOptions = attrs.urlOptions
                        }

                        opts.remote = {
                            url:  attrs.urlRemote + '?query=%QUERY'+urlOptions, cache:false, filter: transform,
                            beforeSend : function(jqXhr, settings){
                                appServices.loading();
                                return true;
                            }
                        };
                    }

                    if(attrs.taTemplate) {
                        opts.template = attrs.taTemplate;
                    }

                }

                scope.$watch(getter, function(newModel, oldModel) { // to reset typeahead internal query when the ngModel is set to undefined or string empty.
                    if(!newModel || newModel === '') {
                        $(element).typeahead('setQuery', '');
                    }
                })

                var initTypeahead = function() {
                    $(element).typeahead(opts);
                    $(element).bind('typeahead:selected', function (obj, datum) {
                        $(element).blur();
                        scope.$apply(function () {
                            setter(scope, datum[attrs['typeahead']]);
                            if(attrs.datumModel) {
                                datumSetter(scope, datum);
                            }

                        });
                    });
                }

                buildOpts();
                initTypeahead();

                // as typeaheadjs does not support dynamic change of options (like remote url...), we need to destroy and re-init to support dynamic url.
                // to support this behavior, the data attribute "depends-on" allow to create a dependency on a scope attribute change.
                // i.e: data-depends-on="myvalue" will destroy the typeahead on any change of myvalue. The typeahead will be re-initialized if myvalue is not undefined
                if(attrs.dependsOn) {
                    var dependency = $parse(attrs.dependsOn);
                    scope.$watch(dependency, function(newDeps, oldDeps) {
                        try {
                            $(element).typeahead('destroy');
                        } catch (e) {
                        }
                        if(newDeps) {
                            buildOpts();
                            initTypeahead();
                        }
                    })
                }

                /**
                * Sample transform function implementation
                * Uses underscore.js
                */
                function transform(parsedResponse) {
                    appServices.ready();
                    return _.map(parsedResponse, function (item) {
                        if (!item.tokens) {
                            var inputs = _.values(item),
                                results = [];
                            _.each(inputs, function (inp) {
                                results = _.union(results, tokenize(inp));
                            });

                            item.tokens = results;
                        }
                        return item;
                    });
                }

                /**
                * Split sentences into tokens so each word
                * is searcheable as well
                */
                function tokenize(str) {
                    return $.trim(str).toLowerCase().split(/[\s\-_]+/);
                }
            }
        };
    }]);

    /**
    * directive Datetime picker : 'dtp'
    * required attributes :
    *  - ngModel
    * optional attributes :
    *  - dtp-format (string) : define date parsing format. i.e : DD/MM/YYYY
    *  - dtp-placeholder (string) : define input placeholder value
    *  - dtp-disabled (expression) : scope boolean value watched to disable/enable the date time picker
    *  - required : if present, form value will be validated (form validation)
    *  - dtp-required (expression) : watch expression to know if validation is required or not
    *  - dtp-reset-on-disabled : if present, on disable the input value & scope model is reset.
    *  - dtp-start-date (expression) : watch expression to set start date
    *  - dtp-end-date (expression) : watch expression to set end date
    **/
    directives.directive('dtp', ['$parse', function($parse){
        return {
            restrict: 'A',
            require: '?ngModel',
            template:'<div class="input-group date"><input type="text" class="form-control" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>',
            replace: true,
            link: function(scope, element, attrs, ctrl) {

                if (!ctrl) return; // do nothing if no ng-model
                var getter = $parse(attrs.ngModel),       // accessor for ng-model assign to input value (string value)
                    setter = getter.assign;

                var isRequired = false;

                if(attrs.required == true) {
                    isRequired = true;
                }

                if(attrs.dtpRequired) {
                    scope.$watch(attrs.dtpRequired, function(newValue, oldValue){
                        if(newValue==true) {
                            isRequired = true;
                        }
                        if(newValue==false) {
                            isRequired = false;
                        }

                        var currentDate = $(element).data('DateTimePicker').getDate(); // we force validation by applying current date on the calendar
                        $(element).data('DateTimePicker').setDate(currentDate);
                    });
                }

                if(attrs.dtpStartDate) {
                    scope.$watch(attrs.dtpStartDate, function(newValue, oldValue){
                        if(newValue) {
                            $(element).data('DateTimePicker').setStartDate(newValue);
                        }
                    });
                }

                if(attrs.dtpEndDate) {
                    scope.$watch(attrs.dtpEndDate, function(newValue, oldValue){
                        if(newValue) {
                            $(element).data('DateTimePicker').setEndDate(newValue);
                        }
                    });
                }

                var input = $(element).find('input');
                if(attrs.dtpFormat) {
                    $(input).data("format", attrs.dtpFormat);
                }

                if(attrs.dtpPlaceholder) {
                    $(input).attr('placeholder', attrs.dtpPlaceholder);
                }

                var opts = {
                    pickTime: false
                }

                $(element).datetimepicker(opts);

                scope.$watch(getter, function(newDate, oldDate) {
                    if(newDate) {
                        $(element).data('DateTimePicker').setDate(moment(newDate));  // we use moment() constructor to allow binding from model that contains date as string
                    } else {
                        $(input).val("");
                    }
                });

                if(attrs.dtpDisabled) {
                    scope.$watch(attrs.dtpDisabled, function(newValue, oldValue) {
                        if(newValue == true) {
                            if(attrs.dtpResetOnDisabled != undefined) {
                                setter(scope, undefined);
                                $(input).val("");
                            }
                            $(element).data("DateTimePicker").disable();
                        }
                        if(newValue == false) {
                            $(element).data("DateTimePicker").enable();
                        }
                    });
                }

                $(element).on('change.dp',function (e) {  // change.dp is also fired after error.dp, so we need to check if we have a valid date.
                    scope.$apply(function () {
                        var selectedDate = $(element).data('DateTimePicker').getDate();
                        if(selectedDate) {
                            if(isRequired) {
                                ctrl.$setValidity('dtp', true);
                            }
                            $(input).addClass('ng-valid ng-dirty');
                            $(input).removeClass('ng-invalid');
                            setter(scope, selectedDate);
                        }
                    });
                });

                $(element).on('error.dp', function(e) {
                    ctrl.$setValidity('dtp', !isRequired);
                    if(isRequired) {
                        $(input).addClass('ng-invalid ng-dirty');
                        $(input).removeClass('ng-valid');
                    } else {
                        $(input).removeClass('ng-invalid');
                    }
                    setter(scope, undefined);
                });

            }
        }
    }]);

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
