import React, { Component } from "react";
import iconCheckOut from "../images/CheckInOut/logo_header_checkout.png";
import { history } from "../App";

class CheckOut extends Component {
  clickCheckOut = () => {
    history.push("/checkout");
  };
  render() {
    return (
      <div className="checkout-button-group" onClick={this.clickCheckOut}>
        <div className="checkout-icon-container">
          <img className="checkout-icon" src={iconCheckOut} alt="logout" />
        </div>
        <span>Check Out</span>
      </div>
    );
  }
}

export default CheckOut;
