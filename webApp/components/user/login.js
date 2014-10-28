angular.module('cookHttpApp')
.service
.controller('loginController', function ($scope, $http) {

	$scope.logout = function () {
		$http.get('auth/logout')
		.then(
				function ( resp ) { console.log("Logged out: "+resp); }
		);
	}
})
.controller('profileController', function ($scope) {
	
})
