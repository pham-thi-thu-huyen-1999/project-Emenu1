import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";

import { name } from "./reducers";
import * as action from "./actions";
import { Main } from "./components";
import * as CONSTS from "./constants";
import { withRouter } from "react-router-dom";

class tableManagement extends Component {
  componentDidMount() {
    let page = CONSTS.PAGE;
    let limit = CONSTS.LIMIT;
    this.props.actions.getAreaList();
    this.props.actions.getTableType();
    this.props.actions.getTableListAll();
    this.props.actions.getTableList({ page, limit });
    this.props.actions.setPage(1);
    this.props.actions.getTableIcon();
    this.props.actions.getInfoPartner();
    this.props.actions.getInfoPartnerSetting();
  }

  render() {
    const { ...rest } = this.props;
    return <Main {...rest} />;
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
export default compose(withRouter, connect(
  mapStateToProps,
  mapDispatchToProps
))(withNamespaces()(tableManagement));
