'use strict';

module.exports = function makeHandlers(
  client,
  sessionId,
  io,
  sessionManager,
  messageService,
  pushService
) {
  function handleUserRegister(user, callback) {
    if (!sessionManager.isUsernameAvailable(user)) {
      callback('User is not available.');
    }

    const existingUser = sessionManager.getUserBySessionId(sessionId);
    if (existingUser) io.emit('user-left', existingUser);

    sessionManager.registerUser(user, sessionId);
    client.join('chat room');
    io.emit('user-joined', user);

    callback(null, { user, chatHistory: messageService.getChatHistory() });
  }

  async function handleMessage(message, callback) {
    const user = sessionManager.getUserBySessionId(sessionId);

    if (!user) callback('No user registered for this session.');

    message = messageService.saveMessage(message, user);
    io.to('chat room').emit('message', message);

    await pushService.sendNotifications(
      sessionManager.getSubscriptions(),
      `${message.sender.username} - ${message.text}`
    );

    callback(null);
  }

  function handlePushSubscription(subscription) {
    sessionManager.saveSubscription(sessionId, subscription);
  }

  function handleGetActiveUsers(_, callback) {
    callback(null, sessionManager.getActiveUsers());
  }

  function handleDisconnect() {
    const user = sessionManager.getUserBySessionId(sessionId);

    if (user) {
      io.emit('user-left', user);
    }

    sessionManager.markSessionAsInactive(sessionId);
  }

  return {
    handleUserRegister,
    handleMessage,
    handlePushSubscription,
    handleGetActiveUsers,
    handleDisconnect
  };
};
