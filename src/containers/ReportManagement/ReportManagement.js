import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { name } from "./reducers";
import * as action from "./actions";
import { Main } from "./components";
import { withNamespaces } from "react-i18next";


class ReportManagement extends Component {
  componentDidMount() {
    this.props.actions.getPartnerSetting();
    this.props.actions.getReportOverview();
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(ReportManagement));
