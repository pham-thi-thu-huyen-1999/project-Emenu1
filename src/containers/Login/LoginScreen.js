import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import "./login.scss";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { history } from "../../App";
import { name } from "./reducers";
import * as action from "./actions";
import iconUser from "../../images/userIcon.png";
import iconLock from "../../images/lockIcon.png";
import {Base64} from "../../consts/constants";
const iconEye = <FontAwesomeIcon icon={faEye} />;
const iconEyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
const iconArrowRight = <FontAwesomeIcon icon={faArrowRight} />;

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtusername: "",
      txtpassword: "",
      hidePassword: true,
      savelogin: false,
    };
    this.onLoginWithParam();
  }

  setHidePassword = () => {
    this.setState({
      hidePassword: !this.state.hidePassword,
    });
  };

  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };
  onSubmit = () => {
    var { txtpassword, txtusername, savelogin } = this.state;

    const { login } = this.props.actions;
    login({ username: txtusername, password: txtpassword, savelogin });
  };

  onLoginWithParam = () => {
    let { savelogin } = this.state;
    let username = Base64.decode(this.getDataFromParam(null, "u"));
    let password = Base64.decode(this.getDataFromParam(null, "p"));
    //let index = document.referrer ? document.referrer.indexOf(window.location.hostname) : 0;
    let index = -1;
    if (username && password && index === -1) {
      const { login } = this.props.actions;
       login({ username, password, savelogin });
    }
  }
  getDataFromParam = (url, name, type) => {
    let result = type === 'array' ? [] : '';
    const query = (url || window.location.href).split("?");
    const params = (query[1] || '').split("&");
    params.forEach((item) => {
      const key = item.split("=")[0];
      const value = item.split("=")[1];
      if (key === name && type === 'array') {
        result = [...result, decodeURIComponent(value)];
      } else if (key === name) {
        result = decodeURIComponent(value);
      }
    });
    return result;
  }

  render() {
    const { login, hidePassword } = this.state;
    const { isError, errorMessage, t } = this.props;
    var messenger = !isError ? "" : errorMessage;
    if (login) {
      return <Redirect to="/"></Redirect>;
    } else {
      return (
        <div
          id="page-wrapper"
          className="use-bg"
          style={{ backgroundPosition: "center" }}
        >
          <div className="cardlogin">
            <img src={require("../../images/logo-loadding.svg")} alt="" />
            <div className="h3 login title-welcome">
              <b>{t("login.welcome")}</b>
            </div>
            <div className="h4 mlr005card loginname">{t("login.user")}</div>
            <div className="mlr005card field-input inputname">
              <span className="iconLogin">
                <img src={iconUser} alt="" />
              </span>
              <input
                type="text"
                className="inputlogin"
                onChange={this.onChange}
                name="txtusername"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    this.refs.loginBtn.focus();
                  }
                }}
              />
            </div>
            <div className="h4 mlr005card loginpass">{t("login.password")}</div>
            <div className="mlr005card field-input inputpass">
              <span className="iconLogin">
                <img src={iconLock} alt="" />
              </span>
              <input
                type={hidePassword ? "password" : "text"}
                className="inputlogin"
                onChange={this.onChange}
                name="txtpassword"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    this.refs.loginBtn.focus();
                  }
                }}
              ></input>
              <span
                className="icon-showpass eyeAction"
                onClick={this.setHidePassword}
              >
                {hidePassword ? iconEyeSlash : iconEye}
              </span>
            </div>
            <div className="h5 mlr005card password">
              <span style={{ color: "#fd7e0d" }}>{t("login.forgot")}.</span>
            </div>
            <div className="h5 mlr005card messen">
              {
                messenger ? <b>{messenger}!</b> : ""
              }
            </div>
            <div className="btn-login-text-savelogin e-flex">
              <div className="text-contact e-flex item-center content-start">
                <label className="checksave flex">
                  <input
                    type="checkbox"
                    className="checksave"
                    onChange={this.onChange}
                    value={true}
                    name="savelogin"
                  />
                  <span className="checkSaveMark"></span>
                  <span className="h4 mlr005card savelogin">{t("login.save")}</span>
                </label>
              </div>
              <div className="content-btn-right">
                <div className="btn-sub-login">
                  <button className="bntlogin" onClick={this.onSubmit} ref="loginBtn">
                    {!this.props.isLoading ? (
                      <div>
                        {t("login.login")} <span>{iconArrowRight}</span>
                      </div>
                    ) : (
                        <div className="loader ">Loading...</div>
                      )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(LoginScreen));
