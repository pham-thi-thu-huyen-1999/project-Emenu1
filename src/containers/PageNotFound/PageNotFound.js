import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Button } from "../../components/common";
import { Redirect } from "react-router-dom";
import "./pageNotFound.scss";

class PageNotFound extends Component {
  state = {
    statusClick: false
  }
  GoHome = () => {
    this.setState({
      statusClick: true
    })
  }
  render() {
    const { t } = this.props;
    if (this.state.statusClick === true) {
      return <Redirect exact to="/"></Redirect>
    } else {
      return (
        <div
          id="page-wrapper"
          className="use-bg"
          style={{ backgroundPosition: "center" }}
        >
          <div className="card-page-not-found">
            <img src={require('../../images/logo-omenu.png')} alt="Không có hình ảnh***" />
            <div className="page-not-found">
              <div className="number-404">404</div>
              <div className="OOPS">OOPS!...</div>
              <div className="res-noti-page-not-found">
                <b>{t("pageNotFound.notiPageNotFound")}</b>
              </div>
              <Button className="go-home-page" onClick={this.GoHome}>{t("pageNotFound.goHome")}</Button>
            </div>
          </div>
          <div className="copy-right-midota-not-found">Copyright © Midota Corporation. All Rights Reserved.</div>
        </div>

      );
    }
  }
}
export default withNamespaces()(PageNotFound);
