'use strict';

var mockDataProvider = require('./mock-data-from-swagger-yaml'),
    yamlDocHandler = require('./yaml-doc-handler'),
    fs = require('fs');

var mockApi = function() {
    /**
     * @returns {string}
     */
    this.getEmptyPathText = function () {
        return 'Mock api is running, but there\s nothing here!'
            + ' try an api path from your swagger file e.g. "/vendor"';
    };

    /**
     */
    this.getStructure = function (filePath) {
        var yamlString = fs.readFileSync(filePath, 'utf8'),
            docHandler = new yamlDocHandler(yamlString);
        return docHandler.getDoc();
    }
    
    /**
     * @param {string} apiName
     * @param {string} method
     * @param {string} filePath
     * @returns {{count: number, data: *}}
     */
    this.getPathObject = function (apiName, method, filePath) {
        var yamlString = fs.readFileSync(filePath, 'utf8'),
            docHandler = new yamlDocHandler(yamlString),
            dataProvider = new mockDataProvider(docHandler);
        return dataProvider.getMockData(apiName, method)
    }

};

module.exports = new mockApi();
