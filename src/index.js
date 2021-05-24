import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import './i18n';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" component={App} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
serviceWorker.unregister();
serviceWorker.registerServiceWorker();
