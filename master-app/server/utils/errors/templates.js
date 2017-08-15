const httpStatusCodes = require('http-status-codes');
const appStrings = require('../appStrings');

/**
 * Create error
 * @param status
 * @param message
 * @returns {{status: *, message: *}}
 */
function createError(status, message) {
    return { status, message };
}

module.exports = {
    general: {
        get badRequest() {
            return createError(httpStatusCodes.BAD_REQUEST, appStrings.errors.BAD_REQUEST);
        },
        get unauthorized() {
            return createError(httpStatusCodes.UNAUTHORIZED, appStrings.errors.UNAUTHORIZED);
        },
        get notFound() {
            return createError(httpStatusCodes.NOT_FOUND, appStrings.errors.NOT_FOUND);
        }
    },

    auth: {
        get invalidCredentials() {
            return createError(httpStatusCodes.BAD_REQUEST, appStrings.errors.INVALID_CREDENTIALS);
        },
        get emailAlreadyExists() {
            return createError(httpStatusCodes.BAD_REQUEST, appStrings.errors.EMAIL_ALREADY_EXISTS);
        }
    }
};