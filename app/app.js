'use strict';
var express = require('express'),
    router = require('./router'),
    http = require('http'),
    app = express();


var server = app.listen(8352,  function() {
    console.log('Listening on port %d', server.address().port);
});


app.get('/', router.rootHandler);
app.get('/sphero/:id/:action', router.spheroHandler);
app.get('/rccar/:id/:action', router.rccarHandler);
