#!/usr/bin/env node
'use strict';

const DEBUG = true;

var express = require('express'),
    opts = require('commander')
        .version('0.0.2')
        .option('-f, --file [fileName]')
        .option('-p, --port <n>', 'port address - default is 8080', parseInt)
        .parse(process.argv),
    mockApi = require('./lib/mock-api'),
    fs = require('fs'),
    app = express(),
    filePath = (typeof opts.file !== 'undefined') ? opts.file : './swagger/swagger.yaml',
    delay = 0,
    port = (opts.port === parseInt(opts.port, 10)) ? opts.port : 8080,
    status = 200;


if (!fs.existsSync(filePath)) {
    console.log(filePath + ' does not exist');
    process.exit(1);
}

app.get('/', function (req, res) {
    setTimeout(function () {
        res.status(status);
        res.setHeader('Content-Type', 'application/json');
        res.send({"info": mockApi.getEmptyPathText()});
    }, opts.delay);
});

app.post('/', function (req, res) {
    setTimeout(function () {
        res.status(status);
        res.setHeader('Content-Type', 'application/json');
        res.send({"info": mockApi.getEmptyPathText()});
    }, opts.delay);
});

app.get('/_structure', function (req, res) {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockApi.getStructure(filePath)));
});

app.get(/^\/(.+)/, function (req, res) {
    setTimeout(function () {
		createResponse(filePath, 'get', req, res);
    }, delay);
});

app.post(/^\/(.+)/, function (req, res) {
    setTimeout(function () {
    	createResponse(filePath, 'post', req, res);
    }, delay);
});

app.listen(port, function () {
    console.log(
        'running on port ' + port
    );
});

function createProfileResponse(status, req, res){
	
	var doc = mockApi.getStructure(filePath);
	var xMock = doc["x-mock-api"];
	
	if(DEBUG)
		console.log("x-mock-api:", xMock);

	if (xMock && xMock["x-mock-api-profiles"]) {

		var profiles = xMock["x-mock-api-profiles"];
		var headers = req["headers"];

		if (headers) {
			
			if(DEBUG)
				console.log("request-header:", headers);
			
			for (var i = 0; i < profiles.length; i++) {
				var profile = profiles[0];
				if (headers[profile.header.key.toLowerCase()] == profile.header.value) {
					res.status(status);
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.parse(fs.readFileSync('./swagger/'
							+ profile.file, 'utf8')));

					return true;
				}
			}
		}
	}
	return false;
}

function createResponse(filePath, method, req, res) {
	var status = mockApi.getResponseCode(req.params[0], method, filePath);
	if(!createProfileResponse(status, req, res)){
		createGeneratedResponse(method, status, req, res);
	}
}

function createGeneratedResponse(method, status, req, res){
	var object = mockApi.getPathObject(req.params[0], method, filePath);
	res.status(status);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(object));
}