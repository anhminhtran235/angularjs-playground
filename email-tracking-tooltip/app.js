/// <reference path="../library/angular.min.js" />
const app = angular.module('myApp', []);

app.controller('mainController', ['$scope', function($scope) {
    $scope.name = 'Minh';
}])