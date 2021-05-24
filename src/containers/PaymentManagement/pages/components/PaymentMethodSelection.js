import React, { Component } from "react";
import Styles from  '../PaymentManagement.module.scss';
import _ from "lodash";
import { PAYMENT_METHODS } from "../PaymentContants";
import PaymentMethodModal from "./PaymentMethodModal";
import IconSource from "./PaymentMethodIcon";
class PaymentMethodSelection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowPaymentMethod: false
    }
  }

  editPaymentMethod = () => {
    this.setState({ isShowPaymentMethod: true })
  }

  /**
   * Render selected method
   */
  renderSelectedMethod = () => {
    const Icon = IconSource[this.props.selectedPaymentMethod || PAYMENT_METHODS[0]]
    return (
      <div className={Styles["selected-payment-method"]}>
        <div className={Styles["feature-icon"]} style={{display: "flex", marginRight: '10px'}}>
          <Icon color={"#2699FB"} />
        </div>
        {this.props.selectedPaymentMethod
          ? this.props.t(
              `payment:payment_order.payment_methods.${this.props.selectedPaymentMethod}`
            )
          : this.props.t(
              `payment:payment_order.payment_methods.${PAYMENT_METHODS[0]}`
            )}
      </div>
    );
  }

  render() {
    const trans = this.props.t;
    return (
      <div className={`${Styles["money-caculation-block"]} ${Styles["payment-selection"]}`}>
        <div className={Styles["money-calculation-wrapper"]}>
          <div className={Styles["title"]}>
            {trans("payment:payment_order.payment_selection.title")}
          </div>
          <div className={Styles["process"]}>
            <div style={{display: 'flex'}}>
              { this.renderSelectedMethod() }
              {/* <div onClick={this.editPaymentMethod} className={Styles["button-edit-method"]}>
                <span className="icon-pencil"></span>
              </div> */}
            </div>
          </div>
          {
            this.state.isShowPaymentMethod ?
            <PaymentMethodModal onClose={() => this.setState({ isShowPaymentMethod: false })} {...this.props} /> :
            null
          }
        </div>
      </div>
    );
  }
}

export default PaymentMethodSelection;
