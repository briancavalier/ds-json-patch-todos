#!/usr/bin/env node

var express = require('express');
var WebSocketServer = require('ws').Server;
var Memory = require('cola/data/Memory');
var jiff = require('jiff');

// Store todos in memory
var todos = new Memory([], byId);
var ids = Object.create(null);
var todoId = 1;

var clientId = 1;
var clients = {};

// Setup static file server for serving client app files
listen(8000);

// The real fun: Setup DS WebSocket server
var server = new WebSocketServer({port: 8080});
server.on('connection', initClient);

function initClient(ws) {
	var id = clientId++;
	var messageCounter = 1;
	var client = clients[id] = new ClientProxy(ws, id);
	console.log('client ' + id + ': connected');

	client.set(todos.get());

	ws.on('message', function(message) {
		var patch = JSON.parse(message);
		if(!patch.patch) {
			log(id, messageCounter++, ' empty patch');
			return;
		}

		patch = patch.patch;

		process.nextTick(function() {
			updateFromClient(client, patch, messageCounter);
		});
	});

	ws.on('close', function() {
		console.log('client ' + id + ': disconnected');
		delete clients[id];
	});
}

function updateFromClient (client, patch, messageCounter) {
	var id = client.id;

	client._shadow = jiff.patch(patch, client._shadow);
	todos.patch(patch);
	ids = todos.get().reduce(function (ids, todo) {
		if (todo.id === void 0) {
			todo.id = todoId++;
		}
		ids[todo.id] = todo;
		return ids;
	}, {});

	var returnPatch = todos.diff(client._shadow);
	client.patch(returnPatch);

	if (patch && patch.length > 0) {
		Object.keys(clients).forEach(function (clientId) {
			if (clientId != id) {
				var c = clients[clientId];
				var returnPatch = todos.diff(c.get());
				c.patch(returnPatch);
			}
		});
	}

	log(id, messageCounter++, '' + patch.length + ' patch ops applied');
}

function byId(todo) {
	return 'id' in todo ? todo.id : JSON.stringify(todo);
}

function log(cid, mid, msg) {
	console.log('client ' + cid + ' [' + mid + ']: ' + msg);
}

function ClientProxy(client, id) {
	this.client = client;
	this.id = id;
}

ClientProxy.prototype = {
	set: function(data) {
		this._shadow = jiff.clone(data);
		this.client.send(JSON.stringify({ data: data }));
	},

	get: function() {
		return this._shadow;
	},

	diff: function(data) {
		return jiff.diff(data, this._shadow, byId);
	},

	patch: function(patch) {
		if(!patch || patch.length === 0) {
			return;
		}

		try {
			this._shadow = jiff.patch(patch, this._shadow);
			this.send(patch);
		} catch(e) {
			console.error(e.stack);
		}
	},

	send: function(patch) {
		this.client.send(JSON.stringify({ patch: patch }));
	}
};

function listen (port) {
	var app = express();
	app.configure(function () {
		var cwd = process.cwd();
		console.log(cwd);
		app.use(express.static(cwd));
		app.use(express.directory(cwd));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	app.listen(port);
	console.log('Open http://localhost:' + port + ' in your browser');
}
