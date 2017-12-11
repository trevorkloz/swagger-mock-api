'use strict';

var yaml = require('js-yaml');

/**
 * @param {yamlDocHandler}
 *            docHandler
 */
var mockDataFromSwaggerYaml = function(docHandler) {
	/**
	 * @param {int}
	 *            id - incremented for each int value in mock response *
	 */
	var id = 1;

	/**
	 * @param {string}
	 *            pathName
	 * @param {string}
	 *            method
	 * @returns {*}
	 */
	this.getResponseCode = function(pathName, method) {

		var code = "500";
		
		var doc = docHandler.getDoc();

		var basePath = doc['basePath'];
		if (typeof doc['basePath'] === 'undefined') {
			basePath = '/';
		}
		
		var pathWithoutBasePath = "";
		if (('/' + pathName).indexOf(basePath) !== -1) {
			pathWithoutBasePath = ('/' + pathName).replace(basePath, '');
		}
		
		if (typeof doc['paths'][pathWithoutBasePath] === 'undefined') {
			console.log('getResponseCode:', 'Error: path "' + pathWithoutBasePath + '" is undefined');
			return code;
		}

		if (typeof doc['paths'][pathWithoutBasePath][method] === 'undefined') {
			console.log('getResponseCode:', 'Error: method "' + method + '" is undefined');
			return code;
		}
		
		code = 200;
		var responses = doc['paths'][pathWithoutBasePath][method]['responses'];
		if (typeof responses[code] === 'undefined') {
			code = Object.keys(responses)[0]; // using first
		}

		return code;
	}

	/**
	 * @param {string}
	 *            pathName
	 * @param {string}
	 *            method
	 * @returns {*}
	 */
	this.getMockData = function(pathName, method) {
		var doc = docHandler.getDoc();

		if (typeof method === 'undefined') {
			method = 'get';
		}

		var basePath = doc['basePath'];
		if (typeof doc['basePath'] === 'undefined') {
			basePath = '/';
		}
		
		console.log('getMockData:', "basepath: ", basePath);		
		
		var pathWithoutBasePath = "";
		if (('/' + pathName).indexOf(basePath) !== -1) {
			pathWithoutBasePath = ('/' + pathName).replace(basePath, '');
		}

		console.log('getMockData:', "pathWithoutBasePath: ", pathWithoutBasePath);
		
		if (typeof doc['paths'][pathWithoutBasePath] === 'undefined') {
			console.log('getMockData:', 'Error: path "' + pathWithoutBasePath + '" is undefined');
			return [];
		}

		if (typeof doc['paths'][pathWithoutBasePath][method] === 'undefined') {
			console.log('getMockData:', 'Error: method "' + method + '" is undefined');
			return [];
		}

		var code = "200";
		var responses = doc['paths'][pathWithoutBasePath][method]['responses'];
		if (typeof responses[code] === 'undefined') {
			code = Object.keys(responses)[0]; // using first
		}

		var rootRefObject = docHandler.getArrayForKey(code, responses);

		if (typeof rootRefObject['schema'] !== 'undefined') {
			var schema = docHandler.getArrayForKey("schema", rootRefObject);
			return [ getTestValuesForObject(schema['properties']) ];
		} else {
			return [ rootRefObject["description"] ];
		}
	};

	/**
	 * @param {*}
	 *            object
	 * @returns {{}}
	 */
	var getTestValuesForObject = function(object) {
		var response = {};
		for ( var key in object) {
			if (!object.hasOwnProperty(key))
				continue;

			var settings = docHandler.getArrayForKey(key, object);
			response[key] = getTestValueForType(key, settings);
		}
		return response;
	};

	/**
	 * @param {string}
	 *            key
	 * @param {*}
	 *            settings
	 * @returns {*}
	 */
	var getTestValueForType = function(key, settings) {
		switch (settings['type']) {
		case 'integer':
			return id++;
		case 'number':
			if (typeof settings['maximum'] !== 'undefined') {
				return settings['maximum'];
			} else if (typeof settings['format'] !== 'undefined'
					&& settings['format'] == 'float') {
				return 0.14159 + id++;
			}
			return id++;
		case 'string':
			return getStringFormats(key, settings);
		case 'boolean':
			return true;
		case 'array':
			return [ getTestValueForType(key, docHandler.getArrayForKey(
					'items', settings)) ];
		case 'object':
			return getTestValuesForObject(docHandler.getArrayForKey(
					'properties', settings));
		default:
			return 'unknown type: ' + key;
		}
	};

	var getStringFormats = function(key, settings) {
		var format = (typeof settings['format'] !== 'undefined') ? settings['format']
				: (typeof settings['description'] !== 'undefined') ? settings['description']
						: '';

		switch (format) {
		case 'date':
			return '2016-01-01';
		case 'date-time':
			return '2016-01-01T15:16:17.005Z';
		case 'time in format G:i':
			return '12:13';
		default:
			return 'test string for ' + key;
		}
	};
};

module.exports = mockDataFromSwaggerYaml;
