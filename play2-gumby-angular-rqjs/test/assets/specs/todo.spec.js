define(['angular-mock', 'jquery', 'app/main', EnvJasmine.mocksDir+'todos.js'], function() {

    var $httpBackend,
        $rootScope,
        $scope,
        createController;

    describe('Todo Controller', function() {

        beforeEach(function(){

            module('app.services');
            module('todo');
            module('todo.services');

            inject(function($injector) {
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();

                var $q = $injector.get('$q');
                var appServices = $injector.get('appServices');
                var todoServices = $injector.get('todoServices');
                var $controller = $injector.get('$controller');

                // backend definition common for all tests
                $httpBackend = $injector.get('$httpBackend');
                $httpBackend.when('GET', '/api/todos').respond(allTodos);

                createController = function() {
                    return $controller('TodoCtrl', {'$scope' : $scope, '$q' : $q, 'todoService': todoServices, 'appServices':appServices });
                };
            });
        });

        afterEach(inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

        it('should start with all todos from back-end in scope', function() {
            var controller = createController();

            // before back-end response, todos[] must be empty
            expect($scope.todos.length).toBe(0);

            // after back-end response, todos[] must contains all todos from back-end
            $httpBackend.flush();
            expect($scope.todos.length).toBe(2);
        });

    });

});