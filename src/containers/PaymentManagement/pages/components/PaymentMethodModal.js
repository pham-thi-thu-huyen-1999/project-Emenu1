import React, { Component } from "react";
import Styles from "../PaymentManagement.module.scss";
import * as paymentActions from "../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { PaymentReducerName } from "../../reducers";
import IconSource from "./PaymentMethodIcon";
import { PAYMENT_METHODS } from "../PaymentContants";

class PaymentMethodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowOrderModal: false,
      isShowButtonFeature: true,
      isShowConbineInfoModal: false,
      paymentMethods: PAYMENT_METHODS,
      hoverMethod: null,
      selectedMethod: null,
    };
  }

  onMouseEnterPaymentMethod = (method) => {
    this.setState({
      hoverMethod: method,
    });
  };

  onMouseLeavePaymentMethod = () => {
    this.setState({
      hoverMethod: null,
    });
  };

  /**
   * Render payment method
   */
  renderPaymentMethods = () => {
    return this.state.paymentMethods.map((paymentMethod, index) => {
      const Icon = IconSource[paymentMethod];
      return (
        <div
          key={index}
          className={`${Styles["feature-button"]} ${
            this.state.selectedMethod === paymentMethod
              ? Styles["active"]
              : null
          }`}
          style={{ margin: "10px" }}
          onClick={this.onSelectPaymentMethod.bind(this, paymentMethod)}
          onMouseLeave={this.onMouseLeavePaymentMethod}
          onMouseEnter={this.onMouseEnterPaymentMethod.bind(
            this,
            paymentMethod
          )}
        >
          <span>
            {this.props.t(
              `payment:payment_order.payment_methods.${paymentMethod}`
            )}
          </span>
          <div className={Styles["feature-icon"]}>
            <Icon
              color={
                this.state.hoverMethod === paymentMethod ||
                this.state.selectedMethod === paymentMethod
                  ? "#fff"
                  : null
              }
            />
          </div>
        </div>
      );
    });
  };

  /**
   * On select payment method
   */
  onSelectPaymentMethod = (paymentMethod) => {
    this.setState({ selectedMethod: paymentMethod });
  };

  /**
   * On confirm selected
   */
  onConfirmSelected = () => {
    if (this.state.selectedMethod) {
      this.props.paymentActions.selectPaymentMethod({
        payment_method: this.state.selectedMethod,
      });
      this.props.onClose();
    }
  };

  render() {
    const trans = this.props.t;
    return (
      <div
        className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}
      >
        <div
          className={`mfp-content ${Styles["modal-wrapper"]}`}
          style={{ width: "644px", height: "500px" }}
        >
          <div style={{ height: "calc(100% - 50px)" }}>
            <div
              className={Styles["button-close"]}
              onClick={this.props.onClose}
            ></div>
            <div className={Styles["modal-header-title"]}>
              <span>{trans("payment:payment_order.payment_method.title")}</span>
            </div>
            <div
              className={`${Styles["modal-content-wrapper"]} ${Styles["modal-features"]}`}
            >
              {this.renderPaymentMethods()}
            </div>
            <div className={Styles["note"]}>
              <p className={Styles["note-title"]}>
                {trans("payment:payment_order.payment_method.note")}
              </p>
              <p>{trans("payment:payment_order.payment_method.pay_by_cash")}</p>
              <p>{trans("payment:payment_order.payment_method.pay_by_atm")}</p>
              <p>
                {trans("payment:payment_order.payment_method.pay_by_e_wallet")}
              </p>
            </div>
          </div>
          <div className={`${Styles["group-button"]}`}>
            <button
              className={`${Styles["button"]}`}
              type="button"
              onClick={this.onConfirmSelected}
            >
              {trans("payment:payment_order.ok")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[PaymentReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...paymentActions }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodModal);
