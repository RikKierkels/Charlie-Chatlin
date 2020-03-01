const { getCurrentDate } = require('../utils');
const sessions = new Map();

function getSessions() {
  return sessions;
}

function hasSession(sessionId) {
  return sessions.has(sessionId);
}

function startSession(sessionId) {
  const session = sessions.get(sessionId);
  sessions.set(sessionId, { ...session, isActive: true });
}

function terminateSession(sessionId) {
  sessions.delete(sessionId);
}

function getUserBySessionId(id) {
  return (sessions.get(id) || {}).user;
}

function getActiveUsers() {
  return [...sessions.values()]
    .filter(s => s.user && s.isActive)
    .map(s => s.user);
}

function registerUser(sessionId, user) {
  const session = sessions.get(sessionId);
  sessions.set(sessionId, { ...session, user });
}

function isUsernameAvailable(user) {
  return [...sessions.values()]
    .filter(s => s.user)
    .map(s => s.user)
    .every(u => u.username !== user.username);
}

function markSessionAsInactive(sessionId) {
  const session = sessions.get(sessionId);

  sessions.set(sessionId, {
    ...session,
    isActive: false,
    disconnectedAt: getCurrentDate()
  });
}

module.exports = {
  getSessions,
  hasSession,
  startSession,
  terminateSession,
  getUserBySessionId,
  getActiveUsers,
  registerUser,
  isUsernameAvailable,
  markSessionAsInactive
};
