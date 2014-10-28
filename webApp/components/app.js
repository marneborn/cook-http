'use strict';

/**
 * @ngdoc overview
 * @name cookHttpApp
 * @description
 * # cookHttp
 *
 * Main module of the application.
 */
angular
.module('cookHttpApp', [
                        'ngAnimate',
                        'ngCookies',
                        'ngResource',
                        'ngRoute',
                        'ngSanitize',
                        'ngTouch',
                        'googlePlusLogin'	
                        ]
)

var app = angular
.module('cookHttpApp')
.run( function ($rootScope) {
	$rootScope.isLoggedIn = false;
})
.config(function (googlePlusLoginProvider) {
	googlePlusLoginProvider.clientid    = '786732306424-vd674755dnughpmlo0slkve4o48ejb71.apps.googleusercontent.com';
});

