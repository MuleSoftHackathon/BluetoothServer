'use strict';
var express = require('express'),
    router = require('./router'),
    http = require('http'),
    bodyParser = require('body-parser'),
    app = express();

var server = app.listen(8352,  function() {
    console.log('-------------Local Server Start-------------');
    console.log('Listening on port %d', server.address().port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var accessKey = process.argv[4];

var options = {
    hostname: process.argv[2],
    port: process.argv[3],
    path: '/deviceserver/register',
    headers: {'Content-Type': 'application/json'},
    method: 'POST'
};

var req = http.request(options, function(res) {
    if( res.statusCode !== 200 ) {
        console.log('Fail to connect to central server, please make sure your access key is correct');
        process.exit();
        return;
    }
    console.log('Successfully connect to central server');
});

req.on('error', function(e) {
    console.log('Fail to connect to central server, please make sure the ip address and the port number is correct');
    console.log('running locally!');
});

// write data to request body
req.end(JSON.stringify({
    accessKey: accessKey,
	type : 'bluetooth',
	port : 8352
}));

app.use('/sphero/:id', checkAccessKey);
app.use('/rccar/:id', checkAccessKey);
app.use('/port/:id', checkAccessKey);

app.get('/', router.rootHandler);
app.get('/ports', router.portsHandler);
app.post('/port', router.portNameHandler);
app.get('/sphero/:id/:action', router.spheroHandler);
app.get('/rccar/:id/:action', router.rccarHandler);

function checkAccessKey(req, res, next) {
	var reqAccessKey = req.params.id;
	if(accessKey != null && accessKey !== reqAccessKey) {
		res.status(400).json({
			message : 'Invalid access key!'
		});
		console.log('invalid access key / id.')
		return;
	}
	next();
}