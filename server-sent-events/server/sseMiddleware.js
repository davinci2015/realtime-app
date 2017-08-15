module.exports = (request, response, next) => {
    response.sseSetup = () => {
        response.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });
    };

    response.sseSend = data => {
        response.write("data: " + JSON.stringify(data) + "\n\n");
    };

    next()
};
