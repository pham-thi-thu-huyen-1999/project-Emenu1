import React from "react";
import { Button } from "../../../../components/common/index";
import { get } from "../../../../services/localStorage";
import Time from "../../../../components/common/Moment";
class ShowProvisiVotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemReqPayment: get("itemReqPayment"),
      detailProviVotes: this.props.detailProviVotes
    }
  }
  changeToOrderList = () => {
    const orderId = this.state.itemReqPayment.order_id;
    this.props.history.push(`/request-payment/${orderId}`)
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.detailProviVotes) !== JSON.stringify(prevState.detailProviVotes)) {
      return {
        detailProviVotes: nextProps.detailProviVotes
      }
    }
    return null
  }
  render() {
    const { t } = this.props;
    const { itemReqPayment, detailProviVotes } = this.state;
    return (
      <>{detailProviVotes !== undefined ?
        <div className="view-provisi-votes">
          <div className="container">
            <h3>{t("requestPayment.provisionalVotes")}</h3>
            <div className="content e-flex">
              <div className="content-left">
                <div className="table-code e-flex">
                  <div className="name-table"><span>{detailProviVotes.table.name}</span></div>
                  <div className="flex e-flex content-end"><span>{t("requestPayment.orderCode")}: {itemReqPayment.order.order_no}</span></div>
                </div>
                <div className="table-code e-flex">
                  <div className="name-table"><span>{t("requestPayment.staff")} : {detailProviVotes.order_users[0].user.full_name}</span></div>
                  <div className="flex e-flex content-end">
                    <span>{t("requestPayment.date")} : <Time format="DD/MM/YYYY" date={detailProviVotes.work_date} /></span>
                  </div>
                </div>
                <div className="table-lst">
                  <div className="head e-row">
                    <div className="e-col-4">
                      <span>{t("requestPayment.name")}</span>
                    </div>
                    <div className="e-col-2 e-flex content-center">
                      <span>{t("requestPayment.amount")}</span>
                    </div>
                    <div className="e-col-3 e-flex content-center">
                      <span>{t("requestPayment.unitPrice")}</span>
                    </div>
                    <div className="e-col-3 e-flex content-center">
                      <span>{t("requestPayment.intoMoney")}</span>
                    </div>
                  </div>
                  <div className="table-content type-food">
                    {
                      detailProviVotes.order_items.map((item, index) => {
                        return (
                          <div key={index} className="e-row">
                            <div className="e-col-4 row-inf">
                              <span>{item.item_name}</span>
                            </div>
                            <div className="e-col-2 row-inf e-flex content-center">
                              <span>{item.qty}</span>
                            </div>
                            <div className="e-col-3 row-inf e-flex content-center">
                              <span>{item.price}</span>
                            </div>
                            <div className="e-col-3 row-inf e-flex content-center">
                              <span>{item.total_money}</span>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="content-right flex">
                <div className="detail-info">
                  <div className="total-all row-inf e-flex">
                    <div className="title">
                      <span>{t("requestPayment.total")}</span>
                    </div>
                    <div className="flex e-flex content-end">
                      <span>{detailProviVotes.total_payment}</span>
                    </div>
                  </div>
                  <div className="surchage row-inf e-flex">
                    <div className="title">
                      <span>{t("requestPayment.surchange")}</span>
                    </div>
                    <div className="flex e-flex content-end">
                      <span>{detailProviVotes.surcharge_per}</span>
                    </div>
                  </div>
                  <div className="e-flex row-inf">
                    <div className="title">
                      <span>{t("requestPayment.moneyBefTax")}</span>
                    </div>
                    <div className="flex e-flex content-end">
                      <span></span>
                    </div>
                  </div>
                  <div className="e-flex row-inf">
                    <div className="title">
                      <span>{t("requestPayment.tax")}({detailProviVotes.vat_per}%)</span>
                    </div>
                    <div className="flex e-flex content-end"><span>{detailProviVotes.vat_value}</span></div>
                  </div>
                  <div className="e-flex row-inf">
                    <div className="title">
                      <span>{t("requestPayment.intoMoney")}</span>
                    </div>
                    <div className="flex e-flex content-end"><span>{detailProviVotes.total_payment}</span></div>
                  </div>
                  <div className="e-flex row-inf">
                    <div className="title">
                      <span>Voucher</span>
                    </div>
                    <div className="flex e-flex content-end">
                      <span>{detailProviVotes.discount_voucher_value}</span>
                    </div>
                  </div>
                </div>
                <div className="total">
                  <div className="e-flex total-payment row-inf">
                    <div className="title">
                      <span>{t("requestPayment.totalPayment")}</span>
                    </div>
                    <div className="flex e-flex content-end">
                      <span>{detailProviVotes.total_payment}</span>
                    </div>
                  </div>
                  <div className="e-flex payment-method row-inf">
                    <div className="title">
                      <span>{t("requestPayment.paymentMethod")}</span>
                    </div>
                    <div className="flex e-flex content-end">
                      <span>{this.state.itemReqPayment.payment_type.name_vn}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-lst e-flex item-center content-center">
              <Button type="s3" className="e-m-right-10" onClick={() => window.history.back()}>{t("requestPayment.back")}</Button>
              <Button onClick={this.changeToOrderList}>{t("requestPayment.listOrderedFood")}</Button>
            </div>
          </div>
        </div> : ""
      }</>
    )
  }
}

export default (ShowProvisiVotes);
