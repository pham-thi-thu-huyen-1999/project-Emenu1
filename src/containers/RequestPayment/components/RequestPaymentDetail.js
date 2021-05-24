import React from "react";
import "../styles.scss";
import Swal from "../../../utils/sweetalert2";
import { withNamespaces } from "react-i18next";
import { get } from "../../../services/localStorage";
import * as apiReqPayment from "../../../api/requestPayment";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions"
import { name } from "../reducers";
import { withRouter } from "react-router-dom";
import CompReqPaymentDetail from "./CompDetailReqPayments/CompReqPaymentDetail"

class RequestPaymentDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemReqPayment: get("itemReqPayment"),
      isShowPopupProvisiVote: false
    }
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("requestPayment.cancelProvisiVoteSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  cancelRequest = item => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("requestPayment.confirmAgree")}`,
      text: `${t("requestPayment.textCancelReqPayment")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("requestPayment.agree")}`,
      cancelButtonText: `${t("requestPayment.cancel")}`,
    }).then(async (result) => {
      if (result.value) {
        const res = await apiReqPayment.deleteReqPayment({ order_id: item.order_id, payment_request_id: item.id })
        if (res.status === 200) {
          this.showSuccess();
          window.history.back();
        }
      }
    })
  }
  showPopupSendProvisi = () => {
    this.setState({
      isShowPopupProvisiVote: true
    })
  }
  componentDidMount() {
    const reqItem = get("itemReqPayment")
    this.props.actions.getDetailReqPayment({
      order_id: reqItem.order_id,
      payment_request_id: this.props.match.params.reqPaymentId
    })
  }
  render() {
    const { ...rest } = this.props
    return (
      <CompReqPaymentDetail
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
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps))
  (withNamespaces()(RequestPaymentDetail));