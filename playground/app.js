/// <reference path="../library/angular.min.js"/>

const app = angular.module('myApp', []);
app.controller('mainController', ['$scope', function ($scope) {
  $scope.colors = [
    { name: 'yellow' },
    { name: 'red' },
    { name: 'green' },
    { name: 'blue' }
  ];
  $scope.defaultColor = $scope.colors[0].name;
}])