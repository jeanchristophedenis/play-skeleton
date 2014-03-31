define(['angular', './controllers', './services'], function(angular, controllers, services) {
  return angular.module('sample', ['ngResource', 'sample.services'])
    .controller('SampleCtrl', controllers.SampleCtrl);
});