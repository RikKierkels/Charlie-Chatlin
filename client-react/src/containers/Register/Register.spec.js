import React from 'react';
import { screen } from '@testing-library/react';
import { renderContainer } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import Register from './index';
import { waitFor } from '@testing-library/dom';
import chat from '../../shared/chat';
import mockServer, { SOCKET_OPEN } from '../../shared/mock-server';

beforeEach(() => {
  mockServer.stop();
  handleRegister.mockClear();
});

const handleRegister = jest.fn((socket, data) => {
  socket.emit('register-success', { user: data, chatHistory: [] });
});

const usernameInput = () => screen.getByLabelText(/username/i);
const registerButton = () => screen.getByRole('button', { name: /register/i });
const randomAvatar = () => {
  const avatars = screen.getAllByRole('button', { name: /avatar/i });
  return avatars[Math.floor(Math.random() * avatars.length)];
};

test('cannot register without selecting an avatar and a username', async () => {
  const { store } = renderContainer(<Register />);
  const socket = mockServer.start({ onRegister: handleRegister });
  chat.connect(socket, store);
  await waitFor(() => expect(socket.readyState).toBe(SOCKET_OPEN));

  userEvent.click(registerButton());

  expect(handleRegister).toHaveBeenCalledTimes(0);
});

test('cannot register without selecting an avatar', async () => {
  const { store } = renderContainer(<Register />);
  const socket = mockServer.start({ onRegister: handleRegister });
  chat.connect(socket, store);
  await waitFor(() => expect(socket.readyState).toBe(SOCKET_OPEN));

  await userEvent.type(usernameInput(), 'Dog');
  userEvent.click(registerButton());

  expect(handleRegister).toHaveBeenCalledTimes(0);
});

test('cannot register without entering a username', async () => {
  const { store } = renderContainer(<Register />);
  const socket = mockServer.start({ onRegister: handleRegister });
  chat.connect(socket, store);
  await waitFor(() => expect(socket.readyState).toBe(SOCKET_OPEN));

  userEvent.click(randomAvatar());
  userEvent.click(registerButton());

  expect(handleRegister).toHaveBeenCalledTimes(0);
});
