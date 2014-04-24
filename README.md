# Differential Sync using JSON Patch

This is a simple demo Todos app that uses Differential Sync and JSON Patch over WebSocket to synchronize data between the server and any number of connected clients, in near-real-time.

## Try it

1. `npm install`
1. `bower install`
1. `npm start`
1. Open http://localhost:8080 in a browser window
1. Add/remove/edit/etc some todos
1. Open http://localhost:8080 in a second browser window
1. Add/remove/edit/etc some todos
1. Open http://localhost:8080 in a third browser window
1. Add/remove/edit/etc some todos
1. ...
1. Be sure to try the shiny, candy-like button. It does a bunch of things in one "transaction", ie in a single websocket message:
	1. Doubles the number of todos
	1. Completes every 3rd todo
	1. Appends "!!!!" to every 5th todo
	1. Removes every other todo

You can use Chrome's network tab to watch the websocket frames, and the server will log patching events to the console.
