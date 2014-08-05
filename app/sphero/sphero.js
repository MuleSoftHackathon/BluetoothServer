'use strict';

var Sphero = require('./spheroApi.js'),
    sphero = new Sphero('/dev/cu.Sphero-RBW-RN-SPP'),
    exports = module.exports;

function color() {
    var r = Math.random()*255;
    var g = Math.random()*255;
    var b = Math.random()*255;
    return [r, g, b];
}


exports.action = function(request, response) {
    sphero.on('open', function(){
        if( !response.statusCode ) {
            sphero.isConnected = true;
            response.writeHead(200);
            response.end('Sphero connected');
        }
    });

    sphero.on('error', function(e){
        if( !response.statusCode ) {
            response.writeHead(200);
            response.end('ERROR: Can not connect to the sphero, please make sure the bluetooth is connected\n' + e);
        }
    });

    sphero.on('close', function(){
        if( !response.statusCode ) {
            sphero.isConnected = false;
            response.status(200).send('Sphero closed');
        }
    });

    var id = request.params.id,
        action = request.params.action,
        query = request.query,
        direction = parseInt(query.direction),
        speed = parseInt(query.speed),
        rgb;

    if( action === 'connect' ) {
        if( !sphero.isConnected ) {
            sphero.connect();
        } else {
            response.status(200).send('Sphero connected');
        }
        return;
    }

    if( action === 'close' ) {
        console.log(sphero.isConnected);
        if( sphero.isConnected ) {
            sphero.close();
        } else {
            response.status(200).send('Sphero closed');
        }
        return;
    }

    if( action && sphero.isConnected ) {
        switch (action) {
            case 'q':
                sphero.close();
                break;
            case 'c':
                rgb = color();
                sphero.setRGBLED(rgb[0], rgb[1], rgb[2], false);
                break;
            case 'move':
                if( direction && speed && 0 <= direction && direction <= 360 && 0 <= speed && speed <= 100 ) {
                    sphero.roll(direction, speed/100);
                }
                break;
            default:
                break;
        }

        response.status(200).send('Sphero Move-> direction: ' + direction + ', speed: ' + speed);

    }

    response.status(404).end();
};
