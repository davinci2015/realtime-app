const express = require("express");
const EventEmitter = require("events").EventEmitter;
const bodyParser = require("body-parser");
const corsMiddleware = require("./corsMiddleware");
const port = 8000;


const app = express();
const messageBus = new EventEmitter();
messageBus.setMaxListeners(100);

app.use(corsMiddleware);
app.use(bodyParser.json());

function addMessageListener(messageBus, response) {
	messageBus.once("message", function (data) {
		console.log("Sending data to client", data.message);
		response.status(200).send(data);
	});
}

app.get("/subscribe", function (request, response) {
	addMessageListener(messageBus, response);
});

app.post("/publish", function (request, response) {
	messageBus.emit("message", request.body);
	response.status(200).send();
});

app.listen(port, function () {
	console.log(`Server is listening on port ${port}`);
});