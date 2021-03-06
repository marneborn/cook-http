"use strict";

module.exports = {
		
		// Generic codes
		"NOK"         :  0,
		"OK"          :  1,
		"UNSUPPORTED" :  2,
		
		// PROTOCOLS :
		"PROTOCOL" : {
			"TCP"   : 100,
			"HTTP"  : 101,
			"HTTPS" : 102
		},

		// TCP methods:
		"TCP" : {
			"SEND_AND_FORGET"  : 200,
			"PACKETIZE_STRING" : 201
		},

		// response types
		"RESPONSE" : {
			"ATTACH"      :  300,
			"HTML"        :  301,
			"HTML_IFRAME" :  302
		},

		// cook error codes
		"COOK" : {
			"NORECIPE"    :  500,
			"NOT_UNIQUE"  :  501,
			"NOID"        :  502
		},

		// error codes related to parsing the recipe
		"BLAH" : {
			"WRONG_PROTOCOL" : 600,
			"NO_METHOD"      : 602
		}

};

