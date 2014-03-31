define(['angular', './controllers', './services'], function(angular, controllers, services) {
  return angular.module('todo', ['ngResource', 'todo.services'])
    .controller('TodoCtrl', controllers.TodoCtrl);
});