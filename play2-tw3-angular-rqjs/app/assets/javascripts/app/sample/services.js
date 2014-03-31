define(['angular', 'angular-resource'], function(angular) {
    return angular.module('sample.services', []).factory("sampleServices", ["$resource", function($resource) {
        return $resource();
    }]);
});