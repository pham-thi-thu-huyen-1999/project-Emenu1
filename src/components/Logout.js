import React, { Component } from "react";
import iconLogout from "../images/logout.png";
import { remove, clearAll, get } from "../services/localStorage";
import { history } from "../App";
import * as apiAccount from "../api/account";
import { call } from "redux-saga/effects";
import common from '../utils/common';


class Logout extends Component {
  clickLogout = async () => {
    let infoToken = common.decodeToken(get('accessToken'));
    let rsData = await apiAccount.logout({
      "user_id" : `${infoToken.partner_id}`
    }, get("deviceId"))
    remove("accessToken");
    remove("refreshToken");
    remove("is_table");
    history.push("/login");
  };
  render() {
    return (
      <div className="logout-button-group" onClick={this.clickLogout}>
        <div className="logout-icon-container">
          <img className="logout-icon" src={iconLogout} alt="logout" />
        </div>
        <span>Logout</span>
      </div>
    );
  }
}

export default Logout;
