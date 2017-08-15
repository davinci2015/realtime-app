const httpStatusCodes = require('http-status-codes');

module.exports = (req, res, next) => {
    req.socket.setKeepAlive(true);
    req.socket.setTimeout(0);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.status(httpStatusCodes.OK);

    /**
     * Send message to client
     * @param message {*}
     * @param eventName {String}
     */
    res.pushMessage = function (message, eventName) {
        let composedMessage;
        if (eventName) {
            composedMessage = `event: ${eventName}\n`;
            composedMessage += `data: ${JSON.stringify(message)}\n\n`;
        } else {
            composedMessage = `data: ${JSON.stringify(message)}\n\n`;
        }

        res.write(composedMessage);
    };

    // keep the connection open by sending a comment every 20 seconds
    const keepAlive = setInterval(() => {
        res.write(':keep-alive\n\n');
    }, 20000);

    // cleanup on close
    res.on('close', () => {
        clearInterval(keepAlive);
    });

    next();
}