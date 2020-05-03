import { Server, SocketIO } from 'mock-socket';
import { SOCKET_EVENT } from './socket-constants';

let server = null;
const defaultHandlers = { onRegister: jest.fn() };

function start(handlers = defaultHandlers) {
  const url = 'http://localhost:5000';
  server = new Server(url);

  server.on(SOCKET_EVENT.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENT.REGISTER, (data) => handlers.onRegister(socket, data));
  });

  const io = SocketIO;
  window.io = io;
  return new io(url);
}

function stop() {
  if (!server) return;
  server.stop();
}

export const SOCKET_OPEN = 1;
export default {
  start,
  stop,
};
