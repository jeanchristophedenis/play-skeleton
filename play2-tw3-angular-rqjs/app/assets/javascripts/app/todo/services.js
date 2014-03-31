define(['angular', 'angular-resource'], function(angular) {

    var baseUrl = '/api/todos'

    return angular.module('todo.services', []).factory("todoServices", ["$resource", function($resource) {
        return $resource(
            baseUrl+'/:id/:optionalAction',
            {id:'@id', optionalAction: '@optionalAction'},
            {
                update: { method: 'PUT'},
                setToDone: { method: 'PUT', params: {optionalAction: 'done'} },
                setToNotDone: { method: 'PUT', params: {optionalAction: 'notdone'} },
                checkName: { method: 'GET', params: {id:'exists'} }
            }
        );
    }]);
});