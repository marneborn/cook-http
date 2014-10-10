
(function () {
	var R = {
			NOK              :  0,
			OK               :  1,
			MISSING_REQUIRED :  2
	};

	//---------------------------------------------------------------------------
	/**
	 * Defines things passed to the render function to create the button.
	 * @constant
	 * @type {Array}
	 * @default
	 * 
	 * Each thing has these properties
	 *   name     - the name of the property
	 *   from     - where the user can set the value.
	 *                attribute - an attribute in the DOM element
	 *                controller - a property on $scope in the controller, will get through scope.$parent.googlePlusLoginRenderAttr
	 *   required - is/isn't required
	 *   possible - How to check correct values
	 *                null - anything is OK
	 *                function - either return a boolean for true->OK/false->NOK or return a valid R code.
	 *                array    - must be one of the values given.
	 */
	var buttonProperties = [
	                        // class - is required, but if null, gets a default from google, not sure how to make sure it's OK.
	                        { name : 'clientid'      , from : 'controller', required : true , possible : null },
	                        { name : 'cookiepolicy'  , from : 'controller', required : true , possible : ['single_host_origin', 'none'], default : 'single_host_origin' },
	                        { name : 'accesstype'    , from : 'controller', required : false, possible : ['online', 'offline' ] },
	                        { name : 'apppackagename', from : 'controller', required : false, possible : null },
	                        { name : 'approvalprompt', from : 'controller', required : false, possible : ['auto', 'force'] },
	                        //callback - always through directive for on-auth/on-fail
	                        { name : 'includegranted', from : 'controller', required : false, possible : [true, false] },
	                        { name : 'requestvisibleactions'
	                        	                     , from : 'controller', required : false, possible : angular.isString, default : 'http://schemas.google.com/AddActivity' },
	                        { name : 'scope'         , from : 'controller', required : false, possible : angular.isString, default : 'https://www.googleapis.com/auth/plus.login' },
	                        { name : 'height'        , from : 'element'   , required : false, possible : ['short', 'standard', 'tall' ] },
	                        { name : 'theme'         , from : 'element'   , required : false, possible : ['light', 'dark' ] },
	                        { name : 'width'         , from : 'element'   , required : false, possible : ['iconOnly', 'standard', 'wide'] },
	                        ];

	//---------------------------------------------------------------------------
	/*
	 * Check that the value is OK by the object from buttonProperties
	 */
	/**
	 * @function
	 * @param   {String} value The thing being checked (probably a string or a boolean)
	 * @param   {Boolean} value The thing being checked (probably a string or a boolean)
	 * @param   {Object} obj object to check against, should be from buttonProperties
	 * @returns {Number} R code defining how the check went. (R.OK, R.NOK, R.MISSING_REQUIRED)
	 */

	function checkProp ( value, obj ) {

		// if there is no value (null or undefined) then check if this is required.
		if ( value == null ) {
			return obj.required ? R.MISSING_REQUIRED : R.OK;
		}
	
		// if we got here then there is a value.
		// so check against the possibles.
		// if the possible field is null, then don't check anything, any value is OK.
		if ( obj.possible == null )
			return R.OK;
		
		// if possible is a function execute that.
		// If the return is a boolean, return R.OK or R.NOK.
		// otherwise return the return
		if ( angular.isFunction(obj.possible) ) {
			var ret = obj.possible(value);
			if ( ret === true  ) return R.OK;
			if ( ret === false ) return R.NOK;
			return ret;
		}
		
		// if possible is an array check that the value is exactly one of them
		if ( angular.isArray(obj.possible) ) {
			var found = false;
			for (var i=0; i<obj.possible.length; i++ ) {
				if ( value === obj.possible[i] ) {
					found = true;
					break;
				}
			}
			return found ? R.OK : R.NOK;
		}
	
		// not sure what to do with anything else yet.
		console.err(">> Not sure how to check this \"possible\": "+angular.toJson(obj.possible));
		return R.NOK;
	}
	
	//---------------------------------------------------------------------------
	/**
	 * @function
	 * @param   {Object} attrs any number of objects to get values from, decreasing priority
	 * @returns {Object} Object containing properties to pass to the render function.
	 */
	function prepToRender () {
		
		var toRender = {};
		
		for ( var i=0; i<buttonProperties.length; i++ ) {
			
			var obj   = buttonProperties[i];
			var value = null;
 			for ( var j=0; j<arguments.length; j++ ) {
				if ( arguments[j][obj.name] != null ) {
					value = arguments[j][obj.name];
					break;
				}
			}
			var code  = checkProp(value, obj);
			
			// only set if the value is non-null, null will go to google default.
			// even set for illegal things, in case this is out of date.
			if ( value != null )
				toRender[obj.name] = value;
			
			if ( code === R.OK ) continue;
			
			if ( code === R.MISSING_REQUIRED ) {
				console.error("You're missing a required googlePlusLogin attribute: %s", obj.name);
			}

			else {
				var errStr = '???';
				if ( angular.isFunction(obj.possible) ) {
					errStr = obj.possible.name;
					if ( errStr ) errStr = 'anonymous function';
				}

				// if possible is an array check that the value is exactly one of them
				else if ( angular.isArray(obj.possible) ) {
					errStr = obj.possible.join(', ');
				}

				console.error("You're using a value for the googlePlusLogin attribute %s that isn't allowed.\nValue: %s.\nPossiblities: %s",
						obj.name,
						value,
						errStr
				);
			}
		}

		return toRender;
	}		 

	//---------------------------------------------------------------------------
	function getFromElementAttributes (attrs) {
		var toRender = {};
		if ( !attrs ) return toRender;
		for ( var i=0; i<buttonProperties.length; i++ ) {
			var obj = buttonProperties[i];
			if ( obj.from !== 'element' ) continue;
			if ( attrs[obj.name] == null  ) continue;
			toRender[obj.name] = attrs[obj.name];
		}
		return toRender;
	}

	//---------------------------------------------------------------------------
	function getFromController (scope) {
		var toRender = {};
		
		if ( !scope.$parent.googlePlusLoginRenderAttr )
			return toRender;
		
		var attrs    = scope.$parent.googlePlusLoginRenderAttr;
		for ( var i=0; i<buttonProperties.length; i++ ) {
			var obj = buttonProperties[i];
			if ( obj.from !== 'controller' ) continue;
			if ( attrs[obj.name] == null  ) continue;
			toRender[obj.name] = attrs[obj.name];
		}
		
		return toRender;
	}

	//---------------------------------------------------------------------------
	function getFromProvider ( provider ) {
		var toRender = {};
		var attrs    = provider;
		if ( !attrs ) return toRender;
		for ( var i=0; i<buttonProperties.length; i++ ) {
			var obj = buttonProperties[i];
			if ( attrs[obj.name] == null  ) continue;
			toRender[obj.name] = attrs[obj.name];
		}
		return toRender;
	}

	//---------------------------------------------------------------------------
	angular.module('googlePlusLogin', [])
	.provider('googlePlusLogin', function () {
		buttonProperties.forEach( function (obj) {
			this[obj.name]  = (obj.default ? obj.default : null);
		}, this);
		
		this.$get     = function ($q, $document) {
			var defer = $q.defer();

			// load the api script and create a promise for it's completion.
			var po = $document[0].createElement('script');
			po.onload = po.onreadystatechange =
				function (e) { defer.resolve(e); }
			po.onerror = function (e) { defer.reject(e); };
			po.type  = 'text/javascript';
			po.async = true;
			po.src   = 'https://apis.google.com/js/client:plusone.js';
			var s = $document[0].getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);

			var attrs = { loadedAPI : defer.promise };
			
			buttonProperties.forEach( function (obj) {
				attrs[obj.name] = this[obj.name]
			}, this);
			
			return attrs;
		}
	})
	
	//---------------------------------------------------------------------------
	// after the config, check any of the values that are set.
	// but, don't check MISSING_REQUIRED, because the value can be set in the directive.
	.run(function (googlePlusLogin) {
		
		for (var i=0; i<buttonProperties.length; i++) {

			var obj = buttonProperties[i]
			var code = checkProp(googlePlusLogin[obj.name], obj);
			
			if ( code === R.MISSING_REQUIRED || code === R.OK ) continue;
			
			var errStr = '???'
			
			if ( angular.isFunction(obj.possible) ) {
				errStr = obj.possible.name;
				if ( errStr )
					errStr = 'anonymous function';
			}
			
			// if possible is an array check that the value is exactly one of them
			else if ( angular.isArray(obj.possible) ) {
				errStr = obj.possible.join(', ');
			}
			
			console.error("You're using a value for the googlePlusLogin attribute %s that isn't allowed.\nValue: %s.\nPossiblities: %s",
					obj.name,
					googlePlusLogin[obj.name],
					errStr
			);
			
		}
	})
	
	//---------------------------------------------------------------------------
	.directive('googlePlusLoginButton', function ( googlePlusLogin, $parse ) {

		return {
			restrict : 'E',
			template : '<span></span>',
			scope : {
				onAuthCallback   : '=',
				onFailCallback   : '='
			},
			link : function (scope, element, attrs) {
				
				var toRender = prepToRender(getFromElementAttributes(attrs), getFromController(scope), getFromProvider(googlePlusLogin));

				toRender.callback = function ( authResult ) {
					// most of this is straight from google, but for errors connecting
					// the authResult is an error, which googles code didn't handle
					if ( authResult instanceof Error ) {
						console.error("Sign in error: "+authResult.toString());
						if ( scope.onFailCallback ) scope.onFailCallback( authResult );
					}
					else if ( authResult['status']['signed_in']) {
						// Update the app to reflect a signed in user
						// Hide the sign-in button now that the user is authorized, for example:
						if ( scope.onAuthCallback ) scope.onAuthCallback( authResult );
					}
					else if ( authResult['error'] ){
						// Update the app to reflect a signed out user
						// Possible error values:
						//   "user_signed_out" - User is signed-out
						//   "access_denied" - User denied access to your app
						//   "immediate_failed" - Could not automatically log in the user
						console.log('Sign-in state: ' + authResult['error']);
						if ( scope.onFailCallback ) scope.onFailCallback( authResult );
					}
				};
				
				googlePlusLogin.loadedAPI.then(
						function (        ) { gapi.signin.render(element.children()[0], toRender); },
						function ( reason ) { console.err("Failed to load the google+ login API"); }
				);

			}
		}
	});
})();
