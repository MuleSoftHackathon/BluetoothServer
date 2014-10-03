'use strict';
var rccar = require('./rccar/rccar');
var sphero = require('./sphero/sphero');
var exports = module.exports;
var portsManager = require('./portsManager');

exports.sphero = sphero;

exports.rootHandler = function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	res.end('Welcome to Hackathon -- Bluetooth Devices Server!');
};

exports.portsHandler = function(req, res) {
	portsManager.listPorts(req,res);
};

exports.portNameHandler = function(req, res) {
	portsManager.setPortName(req, res);
}

exports.rccarHandler = function(req, res) {
	rccar.handle(req, res);
};

exports.spheroHandler = function(req, res) {
	sphero.action(req, res);
};
