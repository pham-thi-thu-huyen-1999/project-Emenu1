import React from "react";
import "./styles.scss";
import { Main } from "./components/index";
import { withNamespaces } from "react-i18next";
import * as action from "./actions"
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { name } from "./reducers";
import { LIMITREQPAYMENT, PAGEINIT } from "./consts";
import { withRouter } from "react-router-dom";

class PaymentRequest extends React.Component {
  componentDidMount = () => {
    this.props.actions.getListReqPayment({ page: PAGEINIT, limit: LIMITREQPAYMENT });
  }
  render() {
    const { ...rest } = this.props;
    return (
      <Main {...rest} />
    )
  }
}
var mapStateToProps = state => {
  return {
    ...state[name]
  }
}

var mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...action }, dispatch)
  }
}
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(PaymentRequest));