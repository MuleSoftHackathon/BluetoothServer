'use strict';
exports.handle = function (req, res) {
  var id = req.params.id;
  var action = req.params.action;

  var controller = carController[action];
  var port = getSerialPort(id);
  if (controller == null) {
    res.json(new jsonResponse(FAILURE, 'no such action!'));
  } else if (port == null) {
    res.json(new jsonResponse(FAILURE, 'no port found!'));
  } else {
    serialDataAvailable = false;
    serialOutput = null;
    controller(port, req, res);
  }
};

var SUCCESS = 'ok';
var FAILURE = 'error';

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var serialPort = init();

var serialDataAvailable = false;
var serialOutput;
var defaultSerialTtl = 5;

function getSerialPort(id){
    return serialPort;
}

function jsonResponse(status, message) {
  this.status = status;
  this.message = String(message);
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

var defaultPower = 191;
var carController = {
  open: function(port, req, res){
    port.open(function(error){
      var ret;
      if (error) {
        res.json(new jsonResponse(FAILURE, error));
        console.log(error);
      } else {
        res.json(new jsonResponse(SUCCESS, 'port opened'));
        serialPort.on('data', function(data) {
          try {
            serialOutput = JSON.parse(data);
            serialDataAvailable = true;
          } catch (error) {
            serialOutput = new jsonResponse(FAILURE, error);
            console.error(error);
          }
        });
      }
    });
  },
  close: function(port, req, res){
    port.close(function(error){
      if (error) {
        res.json(new jsonResponse(FAILURE, error));
        console.log(error);
      } else {
        res.json(new jsonResponse(SUCCESS, 'port closed'));
      }
    });
  },
  forward: function(port, req, res){
    _do(port, 'FG', res, 'go forwards');
    _stop(port, req);
  },
  backward: function(port, req, res){
    _do(port, 'BG', res, 'go backwards');
    _stop(port, req);
  },
  stop: function(port, req, res){
    _do(port, 'S', res, 'stop');
  },
  left: function(port, req, res){
    _do(port, 'LG', res, 'go left');
    _stop(port, req);
  },
  right: function(port, req, res){
    _do(port, 'RG', res, 'go right');
    _stop(port, req);
  },
  power: function(port, req, res){
    var power = parseInt(req.query.power);
    if (isNaN(power)) {
      power = defaultPower;
    }
    _do(port, 'V' + power, res, 'set power');
  },
  sensing: function(port, req, res) {
    _do(port, 's', res, 'get sensing');
  }
};

function _do(port, command, res, message) {
  port.write(command, function(error) {
    if(error) {
      if (res) {
        res.json(new jsonResponse(FAILURE, error));
      }
      console.log(error);
    }
    if (res) {
      _listen(res, defaultSerialTtl, message);
    }
  });
}

function _listen(res, ttl, message) {
  if(!serialDataAvailable) {
    setTimeout(_listen, 500, res, --ttl, message);
  } else {
    serialOutput.message = message;
    res.json(serialOutput);
  }
}

var defaultTime = 500;
function _stop(port, req) {
    var time = req.query.time | defaultTime;
    setTimeout(function(){
      _do(port, 'S');
    }, time);
}


