const constants = {
    apiMethods: {
        GET: 'GET',
        POST: 'POST',
        DELETE: 'DELETE',
        PUT: 'PUT'
    },
    drawActions: {
        start: 'start',
        draw: 'draw',
        stop: 'stop'
    },
    sseMessageType: {
        CALL: 'CALL',
        MENTOR_STATUS: 'MENTOR_STATUS'
    },
    socketMessageType: {
        AUTHENTICATION: 'AUTHENTICATION',
        DRAWING: 'DRAWING',
        CONNECTION_CLOSED: 'CONNECTION_CLOSED'
    },
    callRequestType: {
        REQUEST: 'CALL_REQUEST',
        ACCEPT: 'CALL_ACCEPT',
        DECLINE: 'CALL_DECLINE'
    },
    storageKeys: {
        USER_TOKEN: 'USER_TOKEN',
        USER_DATA: 'USER_DATA'
    },
    socketStatus: {
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3
    },
    userTypes: {
        MENTOR: 0,
        BASIC_USER: 1
    },
    routes: {
        ROOT: '/',
        LOGIN: '/login',
        REGISTER_MENTOR: '/register-mentor',
        REGISTER_USER: '/register-user',
        MENTORSHIP: '/mentorship',
        RATING: '/rating',
        MENTOR_PROFILE: '/mentor-profile',
        PANEL: '/panel',
        PANEL_WITH_PARAMS: '/panel/:channelId',
    }
}

export default constants;