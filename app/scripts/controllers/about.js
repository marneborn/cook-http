'use strict';

/**
 * @ngdoc function
 * @name cookHttpApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cookHttpApp
 */
angular.module('cookHttpApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
