'use strict';
exports.handle = function (req, res) {
  var id = req.params.id;
  var action = req.params.action;

  var controller = carController[action];
  var port = getSerialPort(id);
  if (controller == null) {
    var ret = {};
    ret.status = FAILURE;
    ret.message = 'no such action!';
    res.json(ret);
  } else if (port == null) {
    var ret = {};
    ret.status = FAILURE;
    ret.message = 'no port found';
    res.json(ret);
  } else {
    controller(port, res);
  }
};

var SUCCESS = 'success';
var FAILURE = 'failure';

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var serialPort = init();

function getSerialPort(id){
    return serialPort;
}

function init() {
  //'/dev/tty.HC-06-DevB'
  //'/dev/tty.usbmodem1421'
  var port = new SerialPort('/dev/tty.HC-06-DevB', {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
  }, false); 
  return port;
}

var carController = {
  open: function(port, res){
    port.open(function(error){
      var ret = {};
      if (error) {
        ret.status = FAILURE;
        console.log(error);
      } else {
        ret.status = SUCCESS;
        ret.message = 'port opened';
        serialPort.on('data', function(data) {
          console.log(data);
        });
      }
      res.json(ret);
    });
  },
  close: function(port, res){
    port.close(function(error){
      var ret = {};
      if (error) {
        ret.status = FAILURE;
        console.log(error);
      } else {
        ret.status = SUCCESS;
        ret.message = 'port closed';
      }
      res.json(ret);
    });
  },
  forward: function(port, res){
    _do(port, 'F', res, 'go forwards');
  },
  backward: function(port, res){
    _do(port, 'B', res, 'go backwards');
  },
  stop: function(port, res){
    _do(port, 'S', res, 'stop');  
  },
  left: function(port, res){
    _do(port, 'L', res, 'left');  
  },
  right: function(port, res){
    _do(port, 'R', res, 'right');  
  },
  high: function(port, res){
    _do(port, 'h', res, 'high speed');  
  },
  medium: function(port, res){
    _do(port, 'm', res, 'medium speed');  
  },
  low: function(port, res){
    _do(port, 'l', res, 'low speed');  
  }
};

function _do(port, command, res, message) {
  port.write(command, function(error) {
    var ret = {};
    ret.command = command;
    if(error) {
      ret.status = FAILURE;
      console.log(error);
    } else {
      ret.status = SUCCESS;
      ret.message = message;
    }
    res.json(ret);
  });
}


