import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faMoneyCheckAlt,
} from "@fortawesome/free-solid-svg-icons";

import { Dialog } from "../../../components/common";

export default class PopupPaymentMethods extends Component {
  render() {
    const { show, close, showPopupPayments, t } = this.props;
    return (
      <Dialog show={show} close={close} innerClass="popup-payment-method">
        <h2 className="main-lbl text-center"> {t("takeaway.paymentMethod")}</h2>
        <div className="flex-view btn-group">
          <div
            className="btn"
            onClick={() => {
              showPopupPayments();
              close();
            }}
          >
            <FontAwesomeIcon icon={faMoneyBill} /> {t("takeaway.cash")}
          </div>
          <div className="btn">
            <FontAwesomeIcon icon={faMoneyCheckAlt} /> {t("takeaway.card")}
          </div>
        </div>
      </Dialog>
    );
  }
}
