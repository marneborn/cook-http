'use strict';

/**
 * @ngdoc function
 * @name tmpyoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the tmpyoApp
 */
angular.module('cookHttpApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
