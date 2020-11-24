/// <reference path="library/angular.min.js" />

const myApp = angular.module('myApp', ['select2CannedMessagesDirective']);

myApp.controller('mainController', [
  '$scope',
  function ($scope) {
    $scope.turnOn = false;
    $scope.messageExistsError = () => {
      alert('MESSAGE ALREADY EXISTS!!');
    };
    $scope.exceedLimitCb = () => {
      alert('EXCEED LIMIT!');
    };
    $scope.currentMessages = ['Message 1', 'Message 2', 'Message 3'];
    $scope.templateMessages = ['Template 1', 'Template 2', 'Template 3'];

    setInterval(() => {
      console.log($scope);
    }, 3000);
  },
]);
