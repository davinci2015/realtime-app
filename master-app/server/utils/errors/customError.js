const templates = require('./templates');

class CustomError extends Error {
    /**
     * Custom error constructor
     * @param data {Object}
     * @param data.message {String} - Error description
     * @param data.status {Number} - HTTP status code
     * @param [data.name='CustomError'] {String} - Error name (optional)
     */
    constructor(data) {
        super(data.message);
        this.status = data.status;
        this.name = data.name || 'CustomError';
    }
}

CustomError.templates = templates;
module.exports = CustomError;