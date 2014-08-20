'use strict';
var express = require('express'),
    router = require('./router'),
    http = require('http'),
    app = express();

var server = app.listen(8352,  function() {
    console.log('-------------Local Server Start-------------');
});

var options = {
    hostname: process.argv[2],
    port: 8080,
    path: '/remoteDevice',
    headers: {'Content-Type': 'application/json'},
    method: 'POST'
};

var req = http.request(options, function(res) {
    console.log('Connect to central server');
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.end(JSON.stringify({device_id: process.argv[3], device_type: 'bt', port: 8352}));

app.get('/', router.rootHandler);
app.get('/sphero/:id/:action', router.spheroHandler);
app.get('/rccar/:id/:action', router.rccarHandler);
