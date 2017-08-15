const constants = require('../utils/constants');

module.exports = function (error, req, res, next) {
    const environment = req.app.get('env');
    const status = error.status || 500;
    res.status(status).send({
        status,
        error: environment === constants.environments.DEVELOPMENT ? {
            name: error.name,
            message: error.message
        } : {}
    });
}