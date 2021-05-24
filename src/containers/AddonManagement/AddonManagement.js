import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { withNamespaces } from "react-i18next";
import * as CONSTS from "./constants";
import { Main } from "./components";
import "./addonStyles.scss";
import { withRouter } from "react-router-dom";

class AddonManagement extends Component {

  componentDidMount() {
    const page = CONSTS.PAGE;
    const limit = CONSTS.LIMIT;
    const dataGetAddons = {
      page,
      limit
    }
    this.props.actions.getAddonList({data: dataGetAddons});
    this.props.actions.getInfoVatSetting();
  }

  render() {
    const { ...rest } = this.props;
    return <Main {...rest} />;
  }

}

const mapStateToProps = state => {
  return {
    ...state[name]
  };
};

const mapDispatchToProps = dispatch => {
  const actions = {
    ...action
  };
  return { actions: bindActionCreators(actions, dispatch) };
};

export default compose(withRouter, connect(
  mapStateToProps,
  mapDispatchToProps
)) (withNamespaces()(AddonManagement));
