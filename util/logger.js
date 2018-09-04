'use strict';
var fs = require('fs');
var dateFormat = require('./date');
var Logger = exports.Logger = {};

Logger.info = function(msg) {
    var infoLog = 'logs/info/'+dateFormat.format(new Date(),"yyyy-mm-dd")+'.log';
    var message = dateFormat.format() + " : " + msg + "\n";
    fs.appendFile(infoLog, message, function (err) {});
};
Logger.debug = function(msg) {
    var debugLog = 'logs/debug/'+dateFormat.format(new Date(),"yyyy-mm-dd")+'.log';
    var message = dateFormat.format() + " : " + msg + "\n";
    fs.appendFile(debugLog, message, function (err) {});
};
Logger.error = function(msg) {
    var errorLog = 'logs/error/'+dateFormat.format(new Date(),"yyyy-mm-dd")+'.log';
    var message = dateFormat.format() + " : " + msg + "\n";
    fs.appendFile(errorLog, message, function (err) {});
};