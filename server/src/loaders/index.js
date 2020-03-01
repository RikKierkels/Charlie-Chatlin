const dependencyInjectionLoader = require('./dependency-injector');
const expressLoader = require('./express');
const socketLoader = require('./socket');
const sessionExpiredLoader = require('./session-expired');

module.exports = (app, io) => {
  dependencyInjectionLoader();
  expressLoader(app);
  socketLoader(io);
  sessionExpiredLoader();
};
