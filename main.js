var JsonPatchWS = require('cola/data/JsonPatchWS');
var TodosController = require('./TodosController');
var fluent = require('wire/config/fluent');

module.exports = fluent(function(context) {
	return context
		.add('todos@controller', TodosController)
		.add('todos@model', function() {
			return new JsonPatchWS('ws://localhost:8080/')
		});
});
