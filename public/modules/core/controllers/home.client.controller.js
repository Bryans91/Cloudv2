'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Races',
    function($scope, Authentication, Races) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        // Check if user is logged in and has admin role
        $scope.isAdmin = ($scope.authentication.user.roles && $scope.authentication.user.roles.indexOf('admin') !== -1 ? true : false);
        // Query all races
        $scope.races = Races.query();
    }
]);
