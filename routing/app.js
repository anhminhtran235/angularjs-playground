/// <reference path="../library/angular.min.js" />

const app = angular.module('routingApp', ['ngRoute']);

app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'pages/main.html',
        controller: 'mainController',
      })
      .when('/first', {
        templateUrl: 'pages/first.html',
        controller: 'firstController',
      })
      .when('/second', {
        templateUrl: 'pages/second.html',
        controller: 'secondController',
      });
  },
]);
