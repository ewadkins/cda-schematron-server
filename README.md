# cda-schematron-server
A server wrapper for C-CDA schematron validation in Node.js using the npm package [cda-schematron](https://github.com/ewadkins/cda-schematron).

### Install
Clone the repo:
```
git clone https://github.com/ewadkins/cda-schematron-server
```
Set your current directory to the cloned repo and install the required modules:
```
cd cda-schematron-server
npm install
```
Try to start the app:
```
node app
```
You should see a message asking you to add a schematron file to a certain directory. Example:
```
ERROR: A schematron file (.sch) could not be found in the following directory:
/<some path>/cda-schematron-server/schematron

Please add one and try again.
```
Add a schematron file, as well as other files that the schematron might require (eg. voc.xml), to the displayed directory.

### Starting the server
Once you add a schematron file, run ```node app``` to start the server.

You should see the following, which means the server started successfully:
```
Using <schema name>.sch
info: HTTP server listening on port 8080
========================================
```

### Validating xml
Once you have the server running, validating xml against the schematron is as simple as posting the xml as raw data to ```localhost:8080```, or to whichever port is configured in ```config.js```. The server should respond within a few seconds (depending on the size of the posted xml) with the results.

### Results
The response is a JSON object containing arrays  ```errors```, ```warnings```, and ```ignoreds```.

**Errors** and **warnings** are reported as determined by the schematron and test descriptions. They are of the following form:
```javascript
{
    type: type,                     // "error" or "warning"
    test: test,                     // xpath test
    simplifiedTest: simplifiedTest, // xpath test with resource values included, if applicable, null otherwise
    description: description,       // schematron description of the test case
    line: line,                     // line number of the violating context
    path: path,                     // xpath path of the violating context
    patternId: patternId,           // schematron-assigned pattern id
    ruleId: ruleId,                 // schematron-assigned rule id
    assertionId: assertionId,       // schematron-assigned assertion id
    context: context,               // xpath context of the rule
    xml: xml                        // xml snippet of the violating context
}
```

**Ignored** tests are those that resulted in an exception while running (eg. the test is invalid xpath and could not be parsed properly) and require manual inspection. They are of the following form:
```javascript
{
    errorMessage: errorMessage,     // reason for the exception/ignoring the test
    type: type,                     // "error" or "warning"
    test: test,                     // xpath test
    simplifiedTest: simplifiedTest, // xpath test with resource values included, if applicable, null otherwise
    description: description,       // schematron description of the test case
    patternId: patternId,           // schematron-assigned pattern id
    ruleId: ruleId,                 // schematron-assigned rule id
    assertionId: assertionId,       // schematron-assigned assertion id
    context: context,               // xpath context of the rule
}
```

---
## License (MIT)

Copyright &copy; 2017 [Eric Wadkins](http://www.ericwadkins.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
