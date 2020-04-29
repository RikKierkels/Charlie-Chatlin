import React from 'react';
import ReactDOM from 'react-dom';
import theme from './design/theme';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './design/global-styles';
import { Provider } from 'react-redux';
import store from './store/store';
import chat from './shared/chat';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Register from './containers/Register/register';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/chat">
              <div>Hello from chat</div>
            </Route>
            <Redirect to={{ pathname: '/register' }} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// Learn more about service workers: https://bit.ly/CRA-PWA
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.unregister();
chat.connect();
