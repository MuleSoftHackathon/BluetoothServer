use 'strict';
var express = require('express'),
    router = require('./router'),
    http = require('http'),
    app = express();

var server = app.listen(8352,  function() {
    console.log('-------------Local Server Start-------------');
});

var options = {
    hostname: process.argv[2],
    port: process.argv[3],
    path: '/remoteDevice',
    headers: {'Content-Type': 'application/json'},
    method: 'POST'
};

var req = http.request(options, function(res) {
    if( res.statusCode !== 200 ) {
        console.log('Fail to connect to central server, please make sure your access key is correct');
        return;
    }
    console.log('Successfully connect to central server');
});

req.on('error', function(e) {
    console.log('Fail to connect to central server, please make sure the ip address and the port number is correct');
});

// write data to request body
req.end(JSON.stringify({device_id: process.argv[4], device_type: 'bt', port: 8352}));

app.get('/', router.rootHandler);
app.get('/sphero/:id/:action', router.spheroHandler);
app.get('/rccar/:id/:action', router.rccarHandler);
