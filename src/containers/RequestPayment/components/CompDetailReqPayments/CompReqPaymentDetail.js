import React from "react";
import { Button, Dialog } from "../../../../components/common/index";
import { NavLink } from "react-router-dom";
import Swal from "../../../../utils/sweetalert2";
import { get } from "../../../../services/localStorage";
import * as apiReqPayment from "../../../../api/requestPayment";
import { STATUS } from "../../consts";
import ProvisionalVotes from "../ProvisionalVotes";
import { ViewProvisiVotes } from "../../..";
import Time from "../../../../components/common/Moment";

class CompReqPaymentDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reqPaymentDetail: this.props.reqPaymentDetail,
      isShowPopupProvisiVote: false,
      orderDetail: {},
      itemReqPayment: get("itemReqPayment"),
      isShowDetailProvisiVotes: false
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
        const res = await apiReqPayment.deleteReqPayment({
          order_id: item.order_id,
          payment_request_id: item.id
        })
        if (res.status === 200) {
          this.showSuccess();
          window.history.back();
        }
      }
    })
  }
  /**
   * get data detail provisional votes
   * @param {*} item
   */
  detailProviVotes = (item) => {
    const paymentReqDetailId = item.id;
    this.props.history.push(`/request-payment/${paymentReqDetailId}/provisi-detail`);
  }
  showPopupSendProvisi = () => {
    this.setState({
      isShowPopupProvisiVote: true
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.orderDetail) !== JSON.stringify(prevState.orderDetail)) {
      return {
        orderDetail: nextProps.orderDetail
      }
    }
    return null
  }
  backPage = () => {
    this.props.history.push("/request-payment")
  }
  changeToOrderList = () => {
    const orderId = this.state.itemReqPayment.order_id;
    this.props.history.push(`/request-payment/${orderId}`)
  }
  render() {
    const { t, lng, reqPaymentDetail } = this.props;
    const { isShowPopupProvisiVote, orderDetail, isShowDetailProvisiVotes, itemReqPayment } = this.state;
    return (
      <>{JSON.stringify(reqPaymentDetail) !== JSON.stringify({}) ?
        <div className="detail-req-payment">
          <div className="content-detail">
            <h2 className="title-detail">{t("requestPayment.reqPayment")} {orderDetail.table.name}</h2>
            <div className="status"><span>{t("requestPayment.getRedBill")}</span></div>
            <div className="lst-info-detail">
              <div className="time-recived-req row-detail">
                <span className="title">{t("requestPayment.timeSendReq")}</span>
                <span className="flex">
                  <Time format="HH:mm" date={reqPaymentDetail.created_at} />
                </span>
              </div>
              <div className="time-recived-req row-detail">
                <span className="title">{t("requestPayment.orderCode")}</span>
                <span className="flex">{orderDetail.order_no}</span>
              </div>
              <div className="time-recived-req row-detail">
                <span className="title">{t("requestPayment.paymentType")}</span>
                <span className="flex">{reqPaymentDetail.payment_type.name_vn}</span>
              </div>
              <div className="time-recived-req row-detail">
                <span className="title">{t("requestPayment.status")}</span>
                <span className="flex" style={{
                  color: reqPaymentDetail.payment_request_status_id === STATUS.WAITING_HANDLE ? "#3aa0fa"
                    : reqPaymentDetail.payment_request_status_id === STATUS.SEND_BILL ? "#FF9800"
                      : reqPaymentDetail.payment_request_status_id === STATUS.COMPLETED_HANDLED ?
                        "rgb(75, 209, 89)" : "#fb443c"
                }}>
                  {lng === "vi" ? reqPaymentDetail.payment_request_status.name_vn :
                    lng === "en" ? reqPaymentDetail.payment_request_status.name_en :
                      reqPaymentDetail.payment_request_status.name_jp
                  }
                </span>
              </div>
            </div>
            {
              JSON.stringify(reqPaymentDetail) !== JSON.stringify({})
                && itemReqPayment.payment_request_details.length > 0 ?
                <div className="list-provisivote">
                  {
                    reqPaymentDetail.payment_request_details.map((item, index) => {
                      return (
                        <div className="row-info-err e-flex" key={index}>
                          <div className="time text"><span>
                            <Time format="HH:mm" date={item.created_at} />
                          </span></div>
                          <div className="times text"><span>{t("requestPayment.sttSendProvisiVote")} {index + 1}</span></div>
                          <div className="status text">
                            <span style={{
                              color: item.payment_request_status_id === STATUS.WAITING_HANDLE ? "#3aa0fa"
                                : item.payment_request_status_id === STATUS.SEND_BILL ? "#FF9800"
                                  : item.payment_request_status_id === STATUS.COMPLETED_HANDLED ?
                                    "rgb(75, 209, 89)" : "#fb443c"
                            }}>
                              {lng === "vi" ? item.payment_request_status.name_vn :
                                lng === "en" ? item.payment_request_status.name_en :
                                  item.payment_request_status.name_jp
                              }
                            </span></div>
                          <div className="total-money text">
                            <span>{t("requestPayment.totalMoney")} {item.total_payment}
                              <span className="unit">đ</span>
                            </span></div>
                          <div className="detail text">
                            <a onClick={this.detailProviVotes.bind(this, item)}>
                              {t("requestPayment.detail")}
                            </a></div>
                        </div>
                      )
                    })
                  }
                </div> : <div className="e-flex content-center no-data">
                  <span>{t("requestPayment.noProvisiVote")}</span></div>
            }
            <div className="lst-btn e-flex content-center">
              <Button className="s3 back e-m-right-5" onClick={this.backPage.bind(this)}>{t("requestPayment.back")}
              </Button>
              <Button className="lst-food-called e-m-right-5"
                onClick={this.changeToOrderList}>
                {t("requestPayment.listOrderedFood")}
              </Button>
              <Button className="cancel-req e-m-right-5"
                disabled={itemReqPayment.payment_request_status_id === STATUS.CANCEL_REQPAYMENT}
                onClick={() => this.cancelRequest(itemReqPayment)}
              >
                {t("requestPayment.cancelReq")}</Button>
              <Button className="send-cal"
                onClick={() => this.showPopupSendProvisi()}>{t("Tạm tính")}
              </Button>
            </div>
          </div>
          <Dialog
            show={isShowPopupProvisiVote}
            innerClass="popup-detail-reqPayment"
            close={() => this.setState({ isShowPopupProvisiVote: false })}
          >
            <ProvisionalVotes
              {...this.props}
              hide={() => this.setState({ isShowPopupProvisiVote: false })}
            />
          </Dialog>
        </div> : JSON.stringify(reqPaymentDetail) !== JSON.stringify({})}
        <Dialog
          show={isShowDetailProvisiVotes}
        >
          <ViewProvisiVotes />
        </Dialog>
      </>
    )
  }
}
export default CompReqPaymentDetail;