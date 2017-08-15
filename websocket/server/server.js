const WebSocket = require('ws');
const wsServer = new WebSocket.Server({port: 8080});

wsServer.on("connection", function (ws) {
    console.log("Client connected");

    ws.on("message", function (data) {
        wsServer.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});
