const express = require('express');
const sseMiddleware = require('../middlewares/serverSentEvent');
const router = express.Router();

module.exports = (subjectObserver) => {
    const controller = require('../controllers/users').getInstance(subjectObserver);
    router.get('/', controller.getMentors);
    router.post('/toggle-status', controller.toggleMentorOnlineStatus);
    router.post('/call-process', controller.callProcess);
    router.post('/request-feedback', controller.requestFeedback);
    router.post('/submit-feedback', controller.submitFeedback);
    router.get('/observe', sseMiddleware, controller.addObserver);
    return router;
};
