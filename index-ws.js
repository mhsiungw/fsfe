const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
	// { root: __dirname } to locate the file
	res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('Listening on 3000'));

process.on('SIGINT', () => {
	wss.clients.forEach(client => client.close());
	server.close(() => {
		shutdownDB();
	});
})

/** Websocket **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
	const numClients = wss.clients.size;

	console.log('Clients connected', numClients);

	db.run(
		`INSERT INTO visitors (count, time) VALUES (?, datetime('now'))`,
		numClients
	)

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

// database
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database(':memory:');


// to make sure the table is set up before running any query
db.serialize(() => {
	db.run(`
		CREATE TABLE IF NOT EXISTS visitors (
			count INTEGER,
			time TEXT
		)
	`)
});

function getCounts() {
	db.each("SELECT * FROM visitors", (err, row) => {
		console.log('row', row);
	})
}

function shutdownDB() {
	getCounts();
	console.log('shutting down...');
	db.close();
}
