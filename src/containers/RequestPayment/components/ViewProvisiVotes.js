import React from "react";
import "../styles.scss";
import { withNamespaces } from "react-i18next";
import { get } from "../../../services/localStorage";
import { withRouter } from "react-router-dom";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions"
import { name } from "../reducers";
import ShowProvisiVotes from "./CompDetailReqPayments/ShowProvisiVotes";
class ViewProvisiVotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemReqPayment: get("itemReqPayment")
    }
  }
  componentDidMount() {
    const { itemReqPayment } = this.state;
    this.props.actions.getInfoDetailProvisiVote({
      order_id: itemReqPayment.order_id,
      payment_request_id: itemReqPayment.id,
      payment_request_detail_id: this.props.match.params.paymentReqDetailId
    })
  }
  render() {
    const { ...rest } = this.props
    return (
      <ShowProvisiVotes {...rest} />
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
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps))(withNamespaces()(ViewProvisiVotes));
