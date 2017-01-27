// jshint node:true
var config = require('./config');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

function create() {

	var app = express();
    
    // Create base directory, if it doesn't already exist
    var baseDirectory = path.join(__dirname, config.validator.baseDirectory);
	fs.existsSync(baseDirectory) || fs.mkdirSync(baseDirectory);

	// Configure logging
	var winston = require('winston');
	var morgan = require('morgan');
	var logDirectory = path.join(__dirname, config.server.logDirectory);
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
	var logger = new winston.Logger({
	    transports: [
            new winston.transports.File({
                level: 'info',
                filename: logDirectory + '/all-logs.log',
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
	});
	logger.stream = {
        write: function(message){
            logger.info(message);
        }
	};
	app.use(morgan('dev', { stream: logger.stream }));

    // Set up data pipeline
    app.use(bodyParser.raw({ type: '*/*', limit: '50mb' }));
    
    // Log incoming requests
    app.use(function(req, res, next) {
        logger.info(((req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress) + ' ' + req.method + ' ' + req.path);
        next();
    });
	
	// Configure paths
	app.use('/', require(path.join(__dirname, config.server.routesDirectory, 'index'))(logger));
	
	// Catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

    app.use(function(err, req, res) {
    	if (!err.status) {
    		logger.error(err);
    		throw err;
    	}
    	res.status(err.status || 500);
    	res.send('<b>' + err.status + ':</b> ' + err.message);
    });
    
	return [app, logger];

}

module.exports = create;
