module.exports = {
    sseMessageType: {
        CALL: 'CALL',
        MENTOR_STATUS: 'MENTOR_STATUS'
    },
    socketMessageType: {
        AUTHENTICATION: 'AUTHENTICATION',
        DRAWING: 'DRAWING',
        CONNECTION_CLOSED: 'CONNECTION_CLOSED'
    },
    userTypes: {
        MENTOR: 0,
        BASIC_USER: 1
    },
    environments: {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        TEST: 'test',
        STAGING: 'staging'
    }
};