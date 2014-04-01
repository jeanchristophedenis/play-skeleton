define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    return {
        TodoCtrl:['$scope', '$q', 'todoServices', 'appServices', function($scope, $q, todoServices, appServices){
            $scope.ctrlReady = false;
            $scope.newTodo = {done:false};
            $scope.todos = []
            $scope.isLoading = function(){ return !appServices.isReady(); }

            var loadTodos = function(){
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
            }

            $scope.create = function(){
                appServices.loading();
                todoServices.save(
                    $scope.newTodo,
                    function(success){
                        $scope.resetForm();
                        loadTodos()

                    },
                    function(error){
                        $scope.resetForm();
                        appServices.ready();
                    }
                );
            }

            $scope.resetForm = function(){
                $scope.newTodo = {done:false};
            }

            $scope.remove = function(todoIndex){
                var todo = $scope.todos[todoIndex];
                if(confirm('you going to remove todo ['+todo.name+'], ok ?')) {
                    appServices.loading();
                    todoServices.remove(
                        {id: todo.id},
                        function(success){
                            $scope.todos.splice(todoIndex,1);
                            appServices.ready();
                        },
                        function(error){
                            appServices.ready();
                        }
                    )
                }
            }

            $scope.updateStatus = function(todoIndex){
                var todo = $scope.todos[todoIndex];
                var action = todoServices.setToNotDone;
                if(todo.done) {
                    action = todoServices.setToDone;
                }
                appServices.loading();
                action(
                    {id: todo.id},
                    function(success){
                        appServices.ready();
                    },
                    function(error){
                        appServices.ready();
                    }
                );
            }

            loadTodos();
            $scope.ctrlReady = true;
        }]
    };

});