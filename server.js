const express = require('express');
const app = express();
var bodyParser = require('body-parser');

// PORT=2000 node listener.js | pm2 start app.js --watch
//var port = process.env.PORT || 3000;
var port = 2018;

// allow from cross domain ajax
var methodOverride = require('method-override');
app.use(methodOverride());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // intercept OPTIONS method
    ('OPTIONS' == req.method) ? res.sendStatus(200) : next();
};
app.use(allowCrossDomain);

// global object
global.logger = require('./util/logger').Logger;
global.curl = require('./util/mycurl');
global.string = require('./util/string');
global.request = require('request');

app.use(bodyParser.json());

app.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.sendStatus(500);
})

require('./app/routers')(app);

app.listen(port, () => console.log('Elastic API listening on port '+port));