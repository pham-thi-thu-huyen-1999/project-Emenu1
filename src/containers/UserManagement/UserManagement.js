import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";

import "./UserManagement.scss";
import { Main } from "./components";
import { name } from "./reducers";
import * as action from "./actions";
import { withRouter } from "react-router-dom";

class UserManagement extends Component {
  componentDidMount() {
    this.props.actions.getAccountInfo();
    this.props.actions.getListArea();
    this.props.actions.getGroupUser();
    this.props.actions.getUserList({ index: 0, page_size: 5 });
    this.props.actions.getRoleList();
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
export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ))(withNamespaces()(UserManagement));
