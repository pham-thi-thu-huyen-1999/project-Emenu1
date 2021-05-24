import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as action from "./actions";
import { name } from "./reducers";
import { Main } from "./components";
class SettingScreen extends Component {
  componentDidMount() {
    this.props.actions.getInfoTaxSetting();
    this.props.actions.getPartnerById();
  }
  render() {
    const { ...rest } = this.props
    return <Main {...rest} />;
  }
}
var mapStateToProps = state => {
  return {
    ...state[name]
  }
}
var mapDispatchToProps = dispatch => {
  const actions = { ...action }
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(SettingScreen))

