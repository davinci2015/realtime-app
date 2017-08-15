const express = require("express");
const corsMiddleware = require("./corsMiddleware");
const sseMiddleware = require("./sseMiddleware");
const utils = require("./utils");

const port = 8000;
const app = express();

app.use(corsMiddleware);
app.use(sseMiddleware);

app.get("/stream", (request, response) => {
    response.sseSetup();
    setInterval(function () {
        response.sseSend(utils.generateRandomResponse());
    }, 1000);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});