define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    return {
        TodoCtrl:['$scope', '$q', 'todoServices', 'appServices', function($scope, $q, todoServices, appServices){
            $scope.ctrlReady = false;
            $scope.todos = []
            $scope.isLoading = function(){ return !appServices.isReady(); }

            $scope.remove = function(todoIndex){

                var todo = $scope.todos[todoIndex];
                if(confirm('you going to remove todo ['+todo.name+'], ok ?')) {
                    appServices.loading();
                }
            }

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
            );
            $scope.ctrlReady = true;
        }]
    };

});