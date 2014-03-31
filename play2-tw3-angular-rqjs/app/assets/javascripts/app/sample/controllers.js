define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    var SampleCtrl = function($scope, $q, sampleServices, appServices) {
        $scope.message = "Hi there!";
        $scope.pageReady = function(){ return appServices.isReady(); }
        appServices.ready();
    }

    SampleCtrl.$inject = ['$scope', '$q', 'sampleServices', 'appServices']

    return {
      SampleCtrl: SampleCtrl
    };
});