module.exports = TodosController;

function TodosController() {}

TodosController.prototype = {
	add: function(todos, todo) {
		todo.id = nextId();
		todos.push(todo);
	},

	remove: function(todos, todo) {
		todos.splice(todos.indexOf(todo), 1);
	},

	completeAll: function(todos) {
		todos.forEach(function(todo) {
			todo.complete = true;
		});
	},

	removeCompleted: function(todos) {
		return todos.filter(function(todo) {
			return !todo.complete;
		});
	},

	generate: function(todos, data) {
		var n;
		try {
			n = parseInt(data.n, 10);
		} catch(e) {}
		return todos.concat(generateTodos(isNaN(n) ? 200 : n));
	}
};

var id = 1;
function nextId() {
	return '' + Date.now() + (id++);
}

function generateTodos(n) {
	var todos = [];
	for(var i=0; i<n; i++) {
		var id = nextId();
		todos.push({
			id: id,
			description: 'todo ' + id,
			complete: false
		});
	}
	return todos;
}