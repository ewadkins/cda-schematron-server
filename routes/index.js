// jshint node:true
var fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');
var validator = require('cda-schematron');

var config = require('../config');

// Where to look for resource files
var baseDirectory = path.join(config.server.appDirectory, config.validator.baseDirectory);

// Load schematron once at start, using path in arguments or in config
var schematron = null;
var contents = fs.readdirSync(baseDirectory);
for (var i = 0; i < contents.length; i++) {
    if (contents[i].slice(-4) === '.sch') {
        schematron = fs.readFileSync(path.join(baseDirectory, contents[i]), 'utf-8').toString();
        console.log('Using ' + contents[i]);
        break;
    }
}
if (!schematron) {
    console.log('\nERROR: A schematron (.sch) could not be found in the following directory:');
    console.log(baseDirectory);
    console.log('\nPlease add one and try again.\n');
    process.exit();
}

module.exports = function(logger){

	router.post('/', function(req, res) {
        var xml = req.body.toString();
        logger.info('Validating.. (size: ' + xml.length + ')');
                
        var results = validator.validate(xml, schematron, {
            includeWarnings: config.validator.includeWarnings,
            resourceDir: baseDirectory,
            xmlSnippetMaxLength: config.validator.xmlSnippetMaxLength
        });
        
        res.json(results);
	});
	
	return router;
};
