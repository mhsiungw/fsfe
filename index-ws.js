const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
	// { root: __dirname } to locate the file
	res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('Listening on 3000'));

/** Websocket **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
	const numClients = wss.clients.size;

	console.log('Clients connected', numClients);

	wss.broadcast(`Current visitors: ${numClients}`);

	if (ws.readyState === ws.OPEN) {
		ws.send('welcome!');
	}

	ws.on('close', function close() {
		wss.broadcast(`Current visitors: ${wss.clients.size}`);
		console.log('A client has disconnected');
	})

	ws.on('error', function error () {

	});
});

wss.broadcast = function broadcast(data) {
	console.log('Broadcasting:', data);
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};