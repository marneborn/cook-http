'use strict';

/**
 * @ngdoc function
 * @name cookHttpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cookHttpApp
 */
angular.module('cookHttpApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
