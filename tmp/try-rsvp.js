let P        = require('bluebird');
let mongodb  = require('mongodb');
let utils    = require('utils');

let R        = require('../common/loadR');
let config   = require('../common/config.js');

let uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
+'@'+config.mongoLab.host+':'+config.mongoLab.port
+'/'+config.mongoLab.name+"s";

let connectDB = Q.nbind(mongodb.MongoClient.connect, mongodb.MongoClient);
