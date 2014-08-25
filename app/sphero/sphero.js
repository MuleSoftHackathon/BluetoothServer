'use strict';


/**
 * import modules
 * sphero should be a singleton instance per bluetooth server
 */
var Sphero = require('./spheroApi.js'),
    sphero = new Sphero('/dev/cu.Sphero-RBW-RN-SPP'),
    exports = module.exports;


/**
 * declare other variables
 */
var pingPolling = function(){
        sphero.ping(function(){
        });
        if( sphero.isConnected ) {
            setTimeout(pingPolling, 30000);
        }
    }, // periodically ping the sphero to prevent it going to sleeping mode
    preAction, // record the previous action (have to sethead before rolling)
    notification = [], // notification message from sphero
    message; // message from sphero (ex. angle)

/**
 * register listeners
 */
sphero.on('notification', function(msg) {
    notification = [];
    for( var i = 0; i < msg.DATA.length; i++ ) {
        notification.push(msg.DATA[i]);
    }
});

sphero.on('message', function(msg) {
    console.log('MSG: ' + JSON.stringify(msg));
    message = msg;
});

sphero.on('close', function(msg) {
    console.log('Sphero Close');
    sphero.isConnected = false;
    connectSphero();
});

sphero.on('error', function(msg) {
    console.log('Sphero Error');
    sphero.isConnected = false;
    connectSphero();
});



function connectSphero() {
    if( !sphero.isConnected ) {

        sphero.connect(function(e){
            if(e) {
                sphero.isConnected = false;
                //console.log(e);
                sphero.close(function() {
                    setTimeout(connectSphero, 3000);
                });
                return;
            }
            //console.log('Connection Success');
            sphero.isConnected = true;
            sphero.setDataStreaming([sphero.sensors.gyro_z], 1, 1);
            pingPolling();
        });
    }
}
connectSphero();


/**
 * @param request
 * @param response
 * perform the corresponding request
 */
exports.action = function(request, response) {
    console.log('Sphero request: ' + request.path);

    var id = request.params.id,
        action = request.params.action,
        query = request.query,
        angle,
        speed,
        color = {},
        onFinished = function(e){
            response.writeHead(200);
            if(e) {
                console.log(request.query);
                response.end(JSON.stringify({status:'error', message: 'Sphero fails to perform action'}));
                return;
            }
            sphero.isConnected = true;
            response.end(JSON.stringify({status:'ok', message: 'Sphero ' + action}));
        };


    /**
     * connecting to sphero
     */
    if( action === 'connect' ) {
        if( sphero.isConnected ) {
            response.status(200).send(JSON.stringify({status: 'ok', message: 'Sphero connected'}));
        } else {
            response.status(200).send(JSON.stringify({status: 'error', message: 'Sphero is disconnected'}));
        }
    }

    /**
     * closing sphero
     */
    if( action === 'close' ) {
        if( sphero.isConnected ) {
            sphero.close(function(e){
                response.writeHead(200);
                if(e) {
                    response.end(JSON.stringify({status:'error', message: 'Sphero fails to close :' + e}));
                    return;
                }
                sphero.isConnected = false;
                response.end(JSON.stringify({status:'ok', message: 'Sphero closed'}));
            });
        } else {
            response.status(200).send(JSON.stringify({status:'ok', message: 'Sphero closed'}));
        }
        return;
    }


    /**
     * actions is valid only if the connection is on
     */
    if( action && sphero.isConnected ) {
        switch (action) {
            case 'rotate':
                angle = parseInt(query.angle) + 180;
                if( angle !== undefined && 0 <= angle && angle < 360) {
                    preAction = 'rotate';
                    sphero.setHeading(angle, onFinished);
                    return;
                }
                break;

            case 'color':
                color.r = parseInt(query.r);
                color.g = parseInt(query.g);
                color.b = parseInt(query.b);
                if( color.r !== undefined && color.g !== undefined && color.b !== undefined && 0 <= color.r && color.r < 256
                    && 0 <= color.g && color.g < 256 && 0 <= color.b && color.b < 256) {
                    sphero.setRGBLED(color.r, color.g, color.b, false, onFinished);
                    return;
                }
                break;

            case 'move':
                angle = parseInt(query.angle);
                speed = parseInt(query.speed);
                if( angle !== undefined && speed !== undefined && 0 <= angle && angle < 360 && 0 <= speed && speed < 100 ) {
                    if( preAction === 'rotate' ) {
                        sphero.setHeading(0, function(){
                            sphero.roll(angle, speed/100, onFinished);
                        });
                        preAction = '';
                    }else {
                        sphero.roll(angle, speed / 100, onFinished);
                    }
                    return;
                }
                break;

            case 'sensing':
                response.status(200).send(JSON.stringify({status:'ok', message: 'Sphero ' + action, data: notification}));
                return;
        }
    }

    /**
     * if the action is not valid
     */
    response.status(200).end(JSON.stringify({status:'error', message: 'Command Not Valid'}));
};
