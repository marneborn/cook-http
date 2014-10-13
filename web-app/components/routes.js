'use strict';

angular.module('cookHttpApp')
.config(function ($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'components/user/login.partial.html',
	})
	.when('/main', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	})
	.when('/about', {
		templateUrl: 'views/about.html',
		controller: 'AboutCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
})
