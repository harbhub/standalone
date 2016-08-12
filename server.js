// Scaffold
'use strict';
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	generatePath = require('path').join,
	pathToApp = generatePath(__dirname, '/app/app.html'),
	fs = require('fs');

server.listen(8888, function () {
	console.log('Server Port', server.address().port);
});

// Build
app.all('*', function (request, response, next) {
	console.log('Incoming Request', request.method.toUpperCase(), request.url);
	next();
});

app.get('/', function (request, response, next) {
	response.sendFile(pathToApp);
});

app.get('/html/*', function (request, response, next) {
	response.sendFile(generatePath(__dirname, 'app', request.url));
});

app.get('/css/*', function (request, response, next) {
	response.sendFile(generatePath(__dirname, request.url));
});

app.get('/js/*', function (request, response, next) {
	response.sendFile(generatePath(__dirname, request.url));
});

app.get('/app/*', function (request, response, next) {
	response.sendFile(generatePath(__dirname, request.url));
});

app.get('/bin/app/*', function (request, response, next) {
	response.sendFile(generatePath(__dirname, request.url));
});

io.on('connection', function (socket) {
	console.log('Socket ' + socket.id + ' connected');

	fs.watch(generatePath(__dirname), {}, function (event, name) {
		console.log('Watch UI directory', event, name);
		socket.emit('refresh', {});
	});

	socket.on('auth', function (data) {
		console.log('Authorizing', data);
		socket.emit('auth', {
			success: true
		});
	});

});