'use strict';

var Sphero = require('./spheroApi.js'),
    sphero = new Sphero('/dev/cu.Sphero-RBW-RN-SPP'),
    exports = module.exports,
    pingPolling = function(){
        sphero.ping(function(){
        });
        if( sphero.isConnected ) {
            setTimeout(pingPolling, 30000);
        }
    };

sphero.on('notification', function(msg) {
    console.log('Notification: ' + JSON.stringify(msg));
});

sphero.on('message', function(msg) {
    console.log('Message: ' + JSON.stringify(msg));
});

exports.action = function(request, response) {
    console.log('New Request');
    var id = request.params.id,
        action = request.params.action,
        query = request.query,
        angle,
        speed,
        color = {},
        msgCallback = function(e){
            response.writeHead(200);
            if( e ) {
                response.end(JSON.stringify({data: 'Sphero fails to perform action'}));
                return;
            }
            sphero.isConnected = true;
            response.end(JSON.stringify({data: 'Sphero ' + action}));
        };

    if( action === 'connect' ) {
        if( !sphero.isConnected ) {
            sphero.connect(function(e){
                response.writeHead(200);
                if( e ) {
                    response.end(JSON.stringify({data: 'Sphero fails to connect :' + e}));
                    return;
                }
                sphero.isConnected = true;
                response.end(JSON.stringify({data: 'Sphero connected'}));
                sphero.setDataStreaming([sphero.sensors.gyro_z], 1, 1);
                pingPolling();
            });
        } else {
            response.status(200).send(JSON.stringify({data: 'Sphero connected'}));
        }
        return;
    }

    if( action === 'close' ) {
        if( sphero.isConnected ) {
            sphero.close(function(e){
                response.writeHead(200);
                if(e) {
                    response.end(JSON.stringify({data: 'Sphero fails to close :' + e}));
                    return;
                }
                sphero.isConnected = false;
                response.end(JSON.stringify({data: 'Sphero closed'}));
            });
        } else {
            response.status(200).send(JSON.stringify({data: 'Sphero closed'}));
        }
        return;
    }

    if( action && sphero.isConnected ) {
        switch (action) {
            case 'rotate':
                angle = parseInt(query.angle);
                if( angle && 0 <= angle && angle <= 360) {
                    sphero.setHeading(angle, function(){
                        sphero.setHeading(1, msgCallback);
                    });
                    return;
                }
                break;
            case 'color':
                color.r = parseInt(query.r);
                color.g = parseInt(query.g);
                color.b = parseInt(query.b);
                if( color.r && color.g && color.b && 0 <= color.r && color.r <= 255
                    && 0 <= color.g && color.g <= 255 && 0 <= color.b && color.b <= 255) {
                    sphero.setRGBLED(color.r, color.g, color.b, false, msgCallback);
                    return;
                }
                break;
            case 'move':
                angle = parseInt(query.angle);
                speed = parseInt(query.speed);
                console.log(angle);
                if( angle && speed && 0 <= angle && angle <= 360 && 0 <= speed && speed <= 100 ) {
                    sphero.roll(angle, speed/100, msgCallback);
                    return;
                }
                break;
        }
    }

    response.status(200).end(JSON.stringify({data: 'Command Not Valid'}));
};
