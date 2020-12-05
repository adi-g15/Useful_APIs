#!/usr/bin/env node

/**
 * @file_brief -> This file specifies error handlers, and mounts the express app on a node.js server (exported from ${REPO_ROOT}/app.js)
 */

const app = require("../app");
const http2 = require("http2");
const { readFileSync, existsSync } = require("fs");
const { exit } = require("process");

const PORT = process.env.PORT || "3000";
app.set("port", PORT);

const server = http2.createSecureServer({
	key: existsSync("../key.pem") ? readFileSync("../key.pem"): "",
	cert: existsSync("../cert.pem") ? readFileSync("../cert.pem"): ""
}, app);		// mounting the express app on the node server

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	const bind = typeof PORT === "string"
		? "Pipe " + PORT
		: "Port " + PORT;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case "EACCES":
		console.error(bind + " requires elevated privileges");
		return process.exit(1);
	case "EADDRINUSE":
		console.error(bind + " is already in use");
		return process.exit(1);
	default:
		throw error;
	}
}

function onListening () {
	const addr = server.address();
	const bind = typeof addr === "string"
		? "pipe " + addr
		: "port " + addr.port;
	console.log("Listening on " + bind);
}

function exitHandler(sig) {
	console.log(`Recieved ${sig}: Exiting gracefully`);
	server.close((err) => {
		console.log("Couldn't close server, due to ",err);
	});
	exit(0);
}

process.on("SIGTERM", exitHandler);
process.on("SIGINT", exitHandler);

server.on("error", onError);
server.listen(PORT, onListening);
