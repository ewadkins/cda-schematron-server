var express = require('express');
var router = express.Router();
var path = require('path');

var config = require('../config');
var validator = require('../validator/validator');

module.exports = function(logger){

	router.post('/', function(req, res, next) {
        var xml = req.body.toString();
        
        var schematronDirectory = path.join(config.server.appDirectory, config.validator.baseDirectory); // Where to look for resource files
        var schematronFilepath = path.join(schematronDirectory, config.validator.schematronFileName); // Where to find the schematron file
        var xmlSnippetMaxLength = config.validator.xmlSnippetMaxLength;
        
        var results = validator.validate(xml, schematronFilepath, schematronDirectory, xmlSnippetMaxLength);
        
        res.json(results);
	});
	
	return router;
}
