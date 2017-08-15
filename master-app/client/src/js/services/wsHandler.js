class WsHandler {
    constructor(url) {
        this._socket = new WebSocket(url);
    }

    attachHandlers({onMessage, onOpen}) {
        this._socket.onmessage = function (e) {
            try {
                const message = JSON.parse(e.data);
                onMessage(null, message);
            } catch (error) {
                onMessage(error);
            }
        }

        this._socket.onopen = function () {
            onOpen();
        }
    }

    closeSocket() {
        if (this._socket) {
            console.log(this._socket);
            this._socket.close();
        }
    }

    sendMessage(message) {
        this._socket.send(JSON.stringify(message));
    }
}

export default WsHandler;