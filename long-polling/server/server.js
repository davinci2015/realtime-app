const express = require("express");
const EventEmitter = require("events").EventEmitter;
const bodyParser = require("body-parser");
const corsMiddleware = require("./corsMiddleware");
const port = 8000;

const app = express();
const messageBus = new EventEmitter();

app.use(corsMiddleware);
app.use(bodyParser.json());

setInterval(function () {
    console.log("Total listeners", messageBus.listeners('message').length);
}, 2000);

app.get("/subscribe", function (request, response) {
    function addMessageListener (response) {
        messageBus.prependOnceListener("message", function (data) {
            console.log("Sending data to client", data.message);
            response.status(200).send(data);
        });
    }
	addMessageListener(response);
});

app.post("/publish", function (request, response) {
	messageBus.emit("message", request.body);
	response.status(200).send();
});

app.listen(port, function () {
	console.log(`Server is listening on port ${port}`);
});