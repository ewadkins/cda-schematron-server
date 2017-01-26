var fs = require('fs');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

var parseSchematron = require('./parseSchematron');
var testAssertion = require('./testAssertion');

module.exports = { validate: validate };

function validate(xml, schematron, externalDir, xmlSnippetMaxLength) {
    externalDir = externalDir || './';
    xmlSnippetMaxLength = xmlSnippetMaxLength || 200;
    
    // If not valid xml, might be file path
    if (xml[0] !== '<') {
        xml = fs.readFileSync(xml, 'utf-8').toString();
    }
    if (schematron[0] !== '<') {
        schematron = fs.readFileSync(schematron, 'utf-8').toString();
    }
        
    // Load xml doc
    var xmlDoc = new dom().parseFromString(xml);
    
    // Load schematron doc
    var schematronDoc = new dom().parseFromString(schematron);
    
    // Parse schematron
    var s = parseSchematron(schematronDoc);
    var namespaceMap = s.namespaceMap;
    var patternLevelMap = s.patternLevelMap;
    var patternRuleMap = s.patternRuleMap;
    var ruleAssertionMap = s.ruleAssertionMap;
        
    // Create selector object, initialized with namespaces
    var select = xpath.useNamespaces(namespaceMap);    
    
    var results = [];
    var errors = [];
    var warnings = [];
    var ignored = [];
    for (var pattern in patternRuleMap) {
        if (patternRuleMap.hasOwnProperty(pattern)) {
            var patternId = pattern;
            var type = patternLevelMap[pattern] || null;
            var rules = patternRuleMap[pattern];
            for (var i = 0; i < rules.length; i++) {
                if (!ruleAssertionMap[rules[i]].abstract) {
                    var ruleId = rules[i];
                    var context = ruleAssertionMap[rules[i]].context;
                    var assertionResults = checkRule(rules[i]);                    
                    for (var j = 0; j < assertionResults.length; j++) {
                        var assertionId = assertionResults[j].assertionId;
                        var test = assertionResults[j].test;
                        var description = assertionResults[j].description;
                        var typeOverride = null;
                        if (type === 'warning' && description.indexOf('SHALL') !== -1
                            && (description.indexOf('SHOULD') === -1 || description.indexOf('SHALL') < description.indexOf('SHOULD'))) {
                            typeOverride = 'error';
                        }
                        var results = assertionResults[j].results;
                        if (!results.ignored) {
                            for (var k = 0; k < results.length; k++) {
                                var result = results[k].result;
                                var line = results[k].line;
                                var path = results[k].path;
                                var xml = results[k].xml;
                                var modifiedTest = results[k].modifiedTest;
                                if (!result) {
                                    var obj = {
                                        type: typeOverride || type,
                                        test: test,
                                        modifiedTest: modifiedTest,
                                        description: description,
                                        line: line,
                                        path: path,
                                        patternId: patternId,
                                        ruleId: ruleId,
                                        assertionId: assertionId,
                                        context: context,
                                        xml: xml
                                    }
                                    if (type === 'error') {
                                        errors.push(obj);
                                    }
                                    else {
                                        warnings.push(obj);
                                    }
                                }
                            }
                        }
                        else {
                            var obj = {
                                errorMessage: results.errorMessage,
                                type: type,
                                test: test,
                                description: description,
                                patternId: patternId,
                                ruleId: ruleId,
                                assertionId: assertionId,
                                context: context
                            }
                            ignored.push(obj);
                        }
                    }
                }
            }
        }
    }
    
    return {
        errors: errors,
        warnings: warnings,
        ignored: ignored
    };
    
    function checkRule(rule, contextOverride) {
        var results = [];
        var assertionsAndExtensions = ruleAssertionMap[rule].assertionsAndExtensions;
        var context = contextOverride || ruleAssertionMap[rule].context;
        for (var i = 0; i < assertionsAndExtensions.length; i++) {
            if (assertionsAndExtensions[i].type === 'assertion') {
                results.push({
                    assertionId: assertionsAndExtensions[i].id,
                    test: assertionsAndExtensions[i].test,
                    description: assertionsAndExtensions[i].description,
                    results: testAssertion(assertionsAndExtensions[i].test, context, select, xmlDoc, externalDir, xmlSnippetMaxLength)
                });
            }
            else {
                results = results.concat(checkRule(assertionsAndExtensions[i].rule, context));
            }
        }
        return results;
    }
}
