const SubjectObserver = require('../utils/subjectObserver');
const subjectObserver = new SubjectObserver();

const users = require('./users')(subjectObserver);
const auth = require('./auth')(subjectObserver);

module.exports = function (app) {
  app.use('/users', users);
  app.use('/auth', auth);
};