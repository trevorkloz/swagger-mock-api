#!/usr/bin/env node
'use strict';

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
    setTimeout(function () {
        res.status(status);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockApi.getStructure(filePath)));
    }, delay);
});

app.get(/^\/(.+)/, function (req, res) {
    setTimeout(function () {
        res.status(status);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockApi.getPathObject(req.params[0], 'get',  filePath)));
    }, delay);
});

app.post(/^\/(.+)/, function (req, res) {
    setTimeout(function () {
        res.status(status);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockApi.getPathObject(req.params[0], 'post', filePath)));
    }, delay);
});

app.listen(port, function () {
    console.log(
        'running on port ' + port
    );
});
