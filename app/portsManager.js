'use strict';
var serialPort = require('serialport');
var rccar =require('./rccar/rccar.js');

exports.listPorts = function(req, res) {
	serialPort.list(function(err, ports) {
		res.json(ports);
	});
}

exports.setPortName = function(req, res) {
	var device = req.body.device;
	var port = req.body.port;
	if (port == null) {
		res.status(400).json({
			message : 'port cannot be null'
		});
		return;
	}
	var oldPort;
	if ('rccar' == device) {
		oldPort = rccar.getPortName();
		rccar.setPortName(port);
//	} else if ('sphero' == device ) {
//		oldPort = sphero.getPortName();
//		sphero.setPortName(port);
	} else {
		res.json({
			message : 'no such device'
		});
		return;
	}
	res.json({
		oldPortName : oldPort,
		newPortName : port,
		message : 'port name updated'
	});
}