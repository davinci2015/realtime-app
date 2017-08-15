const express = require('express');
const http = require('http');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const constants = require('./utils/constants');
const corsMiddleware = require('./middlewares/cors');
const notFoundMiddleware = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const Socket = require('./utils/websockets/socket');
const db = require('./services/db');

const app = express();
const httpServer = http.createServer(app);
new Socket(httpServer);

app.use(corsMiddleware);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

require('./routes')(app);

// Connect to database
db.connect();

httpServer.listen(8080, 'localhost', function listening() {
    console.log('Listening on %d', httpServer.address().port);
});

// catch 404 and forward to error handler
app.use(notFoundMiddleware);
// error handler
app.use(errorMiddleware);

module.exports = app;
