// jshint node:true
var fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');

var config = require('../config');
var validator = require('../validator/validator');

// Load schematron once at start
var schematronXml = fs.readFileSync(path.join(config.server.appDirectory,
                                              config.validator.baseDirectory,
                                              config.validator.schematronFileName), 'utf-8');

module.exports = function(logger){

	router.post('/', function(req, res) {
        var xml = req.body.toString();
        logger.info('Validating.. (size: ' + xml.length + ')');
        
        var resourceDirectory = path.join(config.server.appDirectory, config.validator.baseDirectory); // Where to look for resource files
        var xmlSnippetMaxLength = config.validator.xmlSnippetMaxLength;
        
        var results = validator.validate(xml, schematronXml, resourceDirectory, xmlSnippetMaxLength);
        
        res.json(results);
	});
	
	return router;
};
