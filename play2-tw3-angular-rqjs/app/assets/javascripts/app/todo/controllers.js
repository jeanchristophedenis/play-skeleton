define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    var TodoCtrl = function($scope, $q, todoServices, appServices) {

        $scope.ctrlReady = false;
        $scope.todos = []
        $scope.isLoading = function(){ return !appServices.isReady(); }

        appServices.loading();
        todoServices.query(
            {},
            function(todos){
                $scope.todos = todos
                appServices.ready();
            },
            function(error){
                $scope.todos = [];
                appServices.ready();
            }
        )

        $scope.ctrlReady = true;
    }

    TodoCtrl.$inject = ['$scope', '$q', 'todoServices', 'appServices']

    return {
      TodoCtrl: TodoCtrl
    };
});