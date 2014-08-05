'use strict';
//var rccar = require('./rccar/rccar');
var sphero = require('./sphero/sphero'),
    exports = module.exports;

exports.sphero = sphero;

exports.rootHandler = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Hackathon!');
};


exports.rccarHandler = function(req, res) {
	//rccar.handle(req, res);
};

exports.spheroHandler = function(req, res) {
    res.statusCode = null;
    sphero.action(req, res);
};
