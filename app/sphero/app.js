'use strict';

var Sphero = require('./spheroApi.js'),
    sphero = new Sphero();

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    chunk = chunk.substring(0, chunk.length - 1);
    if (chunk !== null) {

        if( chunk === 'connect' ) {
            sphero.connect();
        }else if ( chunk === 'close' ) {
            sphero.close();
        }
    }
});
