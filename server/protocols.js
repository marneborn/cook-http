"use strict";

let util = require('util');
module.exports = require('./protocols/R.json');

let protocols = {
		tcp : require('./protocols/tcp.js')
};

module.exports.getCookFunction = function ( recipe ) {

	if ( protocols[recipe.protocol] !== undefined )
		return protocols[recipe.protocol].getFn(recipe);

	return null;
};

module.exports.getRespondFunction = function ( protocol ) {

	if ( protocols[protocol] !== undefined )
		return protocols[protocol].resond;

	return null;
};

