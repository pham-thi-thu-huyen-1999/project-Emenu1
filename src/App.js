import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import Routes from "./Routes";
import configureStore from "./stores";
import "./styles/style.css";
import "./styles/magnific-popup.css";
import "./styles/slick.css";
import "./styles/Poppins/poppins.css";
import "./styles/magnific-popup.css";
import "./styles/e-ui.scss";
import "./styles/table.scss";
import "./styles/scss/app.scss";
import "./styles/file-input.scss";
import "./styles/header.scss";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { withNamespaces } from 'react-i18next';
import { requestFirebaseNotificationPermission } from './services/firebaseInit';

const browserHistory = createBrowserHistory();
export const { store, history } = configureStore();


class App extends Component {

  render() {
    requestFirebaseNotificationPermission()
      .then((firebaseToken) => {
        // eslint-disable-next-line no-console
        // console.log(firebaseToken);
      })
      .catch((err) => {
        return err;
      });

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes history={browserHistory} />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default withNamespaces()(App);
