import React from "react";
import { TableData, Input, Button } from "../../../components/common/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheck } from "@fortawesome/free-solid-svg-icons";
import Swal from "../../../utils/sweetalert2";
import { withNamespaces } from "react-i18next";
import "../styles.scss";
import { get } from "../../../services/localStorage";
import { STATUS } from "../consts";

class ProvisionalVotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDiscountVoucher: true,
      infoOrderByOrderId: get("infoOderByOrderId"),
      itemReqPayment: get("itemReqPayment")
    }
  }

  cancelVoucher = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("requestPayment.confirmAgree")}?`,
      text: `${t("requestPayment.textCancelDiscountVoucher")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("requestPayment.agree")}`,
      cancelButtonText: `${t("requestPayment.cancel")}`,
    }).then(async (result) => {
      if (result.value) {
        this.setState({
          isDiscountVoucher: false
        })
      }
    })
  }
  /**
   * send and save provisional vote
   * and
   * push noti send provisional vote
   */
  sendProvisional = async () => {
    const { t, orderDetail } = this.props;
    const { itemReqPayment } = this.state;
    const dataPar = JSON.stringify(orderDetail)
    const data = {
      bill_tmp_info: dataPar,
      total_payment: 9
    }
    Swal.fire({
      title: `${t("requestPayment.confirmAgree")}?`,
      text: `${t("requestPayment.validSendProviVote")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("requestPayment.agree")}`,
      cancelButtonText: `${t("requestPayment.cancel")}`,
    }).then(async (result) => {
      if (result.value) {
        this.props.actions.sendProvisiVote({
          order_id: itemReqPayment.order_id,
          payment_request_id: itemReqPayment.id,
          data,
          sendSuccess: this.showSuccess
        })
        this.props.hide()
      }
    })
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("requestPayment.sendProvisiVotesSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("requestPayment.errProviVoteErr")}!`,
      text: `${t("promotions.reqCheckAgain")}!`
    })
  }
  render() {
    const { t, orderDetail } = this.props;
    const { isDiscountVoucher, itemReqPayment } = this.state
    const OPTIONS = {
      heads: [
        {
          text: `${t("requestPayment.stt")}`,
          width: "10%"
        },
        {
          text: `${t("requestPayment.nameFood")}`,
          width: "20%"
        },
        {
          text: `${t("requestPayment.status")}`,
          width: "20%"
        },
        {
          text: `${t("requestPayment.amount")}`,
          width: "15%"
        },
        {
          text: `${t("requestPayment.takeaway")}`,
          width: "15%"
        },
        {
          text: `${t("requestPayment.price")}`,
          width: "20%"
        }
      ],
      columns: [
        {
          key: "id",
          width: "10%",
          render: (item, index) => {
            return index + 1
          }
        },
        {
          key: "item_name",
          width: "20%"
        },
        {
          key: "status",
          width: "20%",
          render: (item) => {
            return <span>{item.order_item_status.name_vn}</span>
          }
        },
        {
          key: "amount",
          width: "15%"
        },
        {
          key: "is_takeaway",
          width: "15%",
          render: (item) => {
            return item.is_takeaway ? <span className="check"><FontAwesomeIcon icon={faCheck} /></span> : ""
          }
        },
        {
          key: "price",
          width: "20%"
        }
      ]
    }
    return (
      <div className="provisional-votes">
        <h4 className="title-provisi">
          {t("requestPayment.provisionalVotes")} {orderDetail.table.name}
        </h4>
        <div className="table-lst-provisi">
          <TableData
            dataSources={orderDetail.order_items}
            option={OPTIONS}
          />
        </div>
        <div className="info-provisional-votes">
          <div className="content">
            <div className="total e-flex item-inf">
              <div className="title">
                <span>{t("requestPayment.total")}</span>
              </div>
              <div className="input-text e-flex content-end">
                <span>{orderDetail.total_payment} <span className="unit">đ</span></span>
              </div>
            </div>
            <div className="surcharge e-flex item-inf item-center">
              <div className="title"><span>{t("requestPayment.surchange")}</span></div>
              <div className="input-text e-flex content-end item-center">
                <Input
                  defaultValue={orderDetail.surcharge_per}
                  onChange={() => { }} /><span className="e-m-left-10 unit">đ</span>
              </div>
            </div>
            <div className="surcharge e-flex item-inf">
              <div className="title"><span>{t("requestPayment.tax")}</span></div>
              <div className="input-text e-flex content-end">
                <span>{orderDetail.vat_value} <span className="unit">%</span></span>
              </div>
            </div>
            <div className="surcharge e-flex item-inf">
              <div className="title title-blue"><span>{t("requestPayment.promotion")}</span></div>
              <div className="input-text e-flex content-end">
                <span className="unit">%</span>
              </div>
            </div>
            {
              isDiscountVoucher ?
                <div className="surcharge e-flex item-inf item-center">
                  <div className="title title-blue">
                    <span>{t("requestPayment.voucherDiscount")}</span></div>
                  <div className="input-text e-flex content-end item-center">
                    <span>{orderDetail.discount_voucher_value} <span className="unit">đ</span></span>
                    <div className="icon">
                      <FontAwesomeIcon onClick={() => this.cancelVoucher()} icon={faTimesCircle} />
                    </div>
                  </div>
                </div> : ""
            }
            <div className="total-money e-flex item-inf">
              <div className="title">
                <span>{t("requestPayment.totalMoney")} </span>
              </div>
              <div className="input-text e-flex content-end">
                <span>{orderDetail.total_money} <span className="unit">đ</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="lst-btn e-flex content-center">
          <Button className="s3 e-m-right-5"
            onClick={() => this.props.hide()}>{t("requestPayment.back")}
          </Button>
          <Button
            onClick={this.sendProvisional}
            disabled={itemReqPayment.payment_request_status_id === STATUS.CANCEL_REQPAYMENT}
          >{t("requestPayment.sendProvisional")}</Button>
        </div>
      </div>
    )
  }
}
export default (withNamespaces()(ProvisionalVotes))