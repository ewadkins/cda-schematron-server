// jshint node:true
var config = {
    server: {
        port: 8080,
        routesDirectory: './routes',
        logDirectory: './logs',
        appDirectory: __dirname
    },
    validator: {
        baseDirectory: './schematron', // Contains schematron files and other necessary resource files (eg. 'voc.xml')
        schematronFileName: 'C-CDA_Schematron_1.1.sch', // Schematron filename in the baseDirectory
        
        includeWarnings: true,
        
        xmlSnippetMaxLength: 200 // set to 0 for no max length
    }
};

module.exports = config;
