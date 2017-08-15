const express = require('express');
const router = express.Router();

module.exports = (subjectObserver) => {
    const controller = require('../controllers/auth').getInstance(subjectObserver);
    router.post('/login', controller.login);
    router.post('/logout', controller.logout);
    router.post('/register', controller.register);
    router.post('/authorize-token', controller.getUserFromToken);
    return router;
};
