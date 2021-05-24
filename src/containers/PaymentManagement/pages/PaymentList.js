import React, { Component } from "react";
import Styles from "./PaymentManagement.module.scss";
import { withNamespaces } from "react-i18next";

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main id="site-main" className="nofooter">
        <div
          className={`${Styles["e-main-content"]} ${Styles["center"]}`}
        ></div>
      </main>
    );
  }
}

export default withNamespaces()(PaymentList);
