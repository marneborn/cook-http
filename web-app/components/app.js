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
})

angular.module('cookHttpApp')
.controller('loginController', function ($scope) {
	
})
.controller('SignInController', function ($scope, $document, googlePlusLogin) {
	// This flag we use to show or hide the button in our HTML.
	$scope.signedIn = false;

	$scope.onAuthX = function ( authResult ) {
		console.log("authed");
		return "1234";
	};
	
	$scope.tmpFn = function (v) { console.log ("tmp> "+v); };
	
//	$scope.googlePlusLoginRenderAttr = {
//			cookiepolicy : "controller",
//			clientid : "blah",
//	};
	
	// Here we do the authentication processing and error handling.
	// Note that authResult is a JSON object.
	$scope.processAuth = function(authResult) {
		console.log('e0 - '+scope.authResult);
		
		// Do a check if authentication has been successful.
		if(authResult['access_token']) {
			// Successful sign in.
			$scope.signedIn = true;
			//$scope.getUserInfo();
		} else if(authResult['error']) {
			// Error while signing in.
			$scope.signedIn = false;

			// Report error.
		}
	};

	// When callback is received, we need to process authentication.
	$scope.signInCallback = function(authResult) {
		//console.log("---auth---\n"+angular.toJson(authResult, true));
		$scope.$apply(function() {
			$scope.processAuth(authResult);
		});
	};

	// Render the sign in button.
	$scope.renderSignInButton = function() {
		return;
		console.log("rendering...");
		gapi.signin.render('signInButton',
				{
			'callback': $scope.signInCallback, // Function handling the callback.
			'clientid': '786732306424-vd674755dnughpmlo0slkve4o48ejb71.apps.googleusercontent.com', // CLIENT_ID from developer console which has been explained earlier.
			'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
			// as their explanation is available in Google+ API Documentation.
			//'scope': 'profile https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
			'scope': 'https://www.googleapis.com/auth/plus.login',
			//'scope': 'profile',
			'cookiepolicy': 'single_host_origin',
			'width' : 'wide' 
				}
		);
	}

	// Start function in this example only renders the sign in button.
	$scope.start = function() {
		googlePlusLogin.loadedAPI.then(
				$scope.renderSignInButton,
				function ( reason ) {
					console.err("Failed to load the google+ login API");
				}
		);
	};

	// Call start function on load.
	$scope.start();

	// Process user info.
	// userInfo is a JSON object.
	$scope.processUserInfo = function(userInfo) {
		// You can check user info for domain.
		if(userInfo['domain'] == 'mycompanydomain.com') {
			// Hello colleague!
		}

		// Or use his email address to send e-mails to his primary e-mail address.
		//sendEMail(userInfo['emails'][0]['value']);
	}

	// When callback is received, process user info.
	$scope.userInfoCallback = function(userInfo) {
		console.log("---userInfo---"+angular.toJson(userInfo, true));
		$scope.$apply(function() {
			$scope.processUserInfo(userInfo);
		});
		console.log('e9');
	};

	// Request user info.
	$scope.getUserInfo = function() {
		gapi.client.request(
				{
					'path':'/plus/v1/people/me',
					'method':'GET',
					'callback': $scope.userInfoCallback
				}
		);
	};
});

angular.module('cookHttpApp')
.controller('OtherController', function ($scope, $document, googlePlusLogin) {
})
.controller('MainCtrl', function($scope) {
  
  $scope.colors=['red','orange','green'];
  
  $scope.change=function(v){
	  console.log("cc> "+v);
    return $scope.colors[Math.floor((Math.random()*3))];
  }
  
})
.directive('helloWorld',function(){
  return{
    scope:{
      color:'=colorInt1',
      changeColor:'&',
    },
    restrict: 'AE',
    replace: true,
    template: '<p style="background-color:{{color}}">Hello World</p>',
    link: function(scope,elem,attrs){
      elem.bind('click',function(){
        scope.$apply(function(){
          scope.color="white";
        });
      });
      elem.bind('mouseover',function(){
        elem.css('cursor','pointer');
        scope.$apply(function(){
          scope.color=scope.changeColor("cc");
        });
      });
      scope.$watch('color',function(changedVal){
        console.log('changed detected');
      });
    }
  }
  
});
