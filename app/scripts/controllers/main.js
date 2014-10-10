'use strict';

/**
 * @ngdoc function
 * @name tmpyoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tmpyoApp
 */
angular.module('cookHttpApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
