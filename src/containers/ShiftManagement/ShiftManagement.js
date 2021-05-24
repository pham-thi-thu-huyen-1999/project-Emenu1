import React from "react";
import { Main } from "./components"
import "./styles.scss";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import * as action from "./actions";
import { name } from "./reducers";
import { withRouter } from "react-router-dom";

class ShiftManagement extends React.Component {
  componentDidMount() {
    this.props.actions.getListShift();
  }
  render() {
    const { ...rest } = this.props
    return (
      <Main
        {...rest}
      />
    )
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
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(withNamespaces()(ShiftManagement))
