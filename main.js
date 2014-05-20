var JsonPatchWS = require('cola/data/JsonPatchWS');
var fluent = require('wire/config/fluent');

var TodosController = require('./TodosController');

module.exports = fluent(function(context) {
	return context
		.add('todos@controller', TodosController)
		.add('todos@model', function() {
			return new JsonPatchWS('ws://localhost:8080/', function(todo) {
				return 'id' in todo ? todo.id : JSON.stringify(todo);
			});
		});
});
