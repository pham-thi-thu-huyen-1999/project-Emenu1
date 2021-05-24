import React from "react";
import "./compPrintBillCasher.scss";
import utilsFormat from "../../../../utils/formats";
export default class CompPrintBillCasher extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      /* orderDetail: this.props.orderDetailTemp, */
      /* isCheckBox: this.props.isCheckBox ? this.props.isCheckBox : {} */
    }
  }

  render() {
    const { isCheckBox, infoPartner, t, infoAreaSelected, idAreaSelected, orderDetail } = this.props;
    /* const { isCheckBox } = this.state; */
    /* const { orderDetail } = this.state; */
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + ' ' + time;
    return (
      <div className={`e-m-top-${isCheckBox && isCheckBox.leTren}
       e-m-left-${isCheckBox && isCheckBox.leTrai}
       e-m-bottom-${isCheckBox && isCheckBox.leDuoi}
       e-m-right-${isCheckBox && isCheckBox.lePhai}`}>{orderDetail ? <div className="PDFContentSCSS-bill-printer-setting-casher">
        <div className="container-print-provisi">
          {isCheckBox && isCheckBox && isCheckBox.isShowRestaurant === true ? <><div className="header-logo">
            <div className="logo">
              <img src={require("../../../../images/black-logo-omenu.png")} />
            </div>
            <div className="content-text-res">
              {infoPartner && JSON.stringify(infoPartner) !== JSON.stringify({})
                ? <><h5>{infoPartner.name}</h5>
                  <span>{t("user.phone")}: {infoPartner.tel}</span>
                  <div>{t("user.address")}: {infoPartner.address}</div>
                  <div>Web: {infoPartner.website}</div></>
                : ""}
            </div>
          </div>
          <div className="e-flex content-center">
            <img src={require("../../../../images/line-black.png")} />
          </div></> : null}
          <div className="title-content-bill">
            <h5>{t("takeaway.invoice")}</h5>
            <div className="content-bill">
              <div className="info-table-order">
                <div className="table-name-staff-left">
                  {isCheckBox && isCheckBox && isCheckBox.isShowTableNumber === true ? <div>{t("foodProcessing.tableNumber")} {orderDetail.table.name}</div> : null}
                  {isCheckBox && isCheckBox && isCheckBox.isShowNoBill === true ? <div>{t("takeaway.order_no")}: {orderDetail.order_no}</div> : null}
                </div>
                <div className="order-date-right">
                  {isCheckBox && isCheckBox && isCheckBox.isShowStaffCasher === true ? <div>{t("takeaway.cashier")} : {orderDetail.order_users.length > 0
                    ? orderDetail.order_users[0].user.full_name : "Master"}</div> : null}
                  {isCheckBox && isCheckBox && isCheckBox.isShowDate === true ? <div>{t("requestPayment.date")} : {dateTime}</div> : null}
                </div>
                {isCheckBox && isCheckBox && isCheckBox.isShowStaffWaiter === true ? (<div>
                  <div>{t("settingPrint.serve")}: {orderDetail.order_users.length > 0
                  ? orderDetail.order_users[0].user.full_name : "Master"}</div>
              </div>): null}
              </div>
              <div className="table-bill">
                <div className="header-bill e-row">
                  <div className="e-col-3 ">{t("requestPayment.name")}</div>
                  <div className="e-col-3 content-center">{t("requestPayment.amount")}</div>
                  <div className="e-col-3 ">{t("requestPayment.unitPrice")}</div>
                  <div className="e-col-3 e-flex content-end">{t("requestPayment.intoMoney")}</div>
                </div>
                {orderDetail.order_items && orderDetail.order_items.length > 0 ?
                  orderDetail.order_items.map((item, index) => (
                    <div className="row-item e-row" key={index}>
                      <div className="e-col-3 ">{item.item_name}</div>
                      <div className="e-col-3 ">{item.qty}</div>
                      <div className="e-col-3 ">{utilsFormat.moneyFormat(Math.ceil(item.price))}</div>
                      <div className="e-col-3 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(item.total_money))}</div>
                    </div>
                  )) : <div>{t("requestPayment.noDish")}</div>
                }
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 ">{t("requestPayment.total")}</div>
                  <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money ? orderDetail.total_money : 0))}</div>
                </div>
                <div className="info-order e-row">
                  <div className="e-col-6 ">{t("requestPayment.surchange")}</div>
                  <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.surcharge_value ? orderDetail.surcharge_value : 0))}</div>
                </div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6  ">{t("requestPayment.moneyBefTax")}</div>
                  <div className="e-col-6 e-flex content-end">0</div>
                </div>
                <div className="info-order e-row">
                  <div className="e-col-6 ">{t("requestPayment.tax")} ({orderDetail.vat_per}%)</div>
                  <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.vat_value ? orderDetail.vat_value : 0))}</div>
                </div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 ">{t("requestPayment.intoMoney")}</div>
                  <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money ? orderDetail.total_money : 0))}</div>
                </div>
                <div className="info-order e-row">
                  <div className="e-col-6 ">Voucher</div>
                  <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.discount_voucher_value ? orderDetail.discount_voucher_value : 0))}</div>
                </div>
                <div className="hr-setting-print"></div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 ">{t("requestPayment.totalPayment")}</div>
                  <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_payment ? orderDetail.total_payment : 0))}</div>
                </div>
                {
                  orderDetail.order_status.id === 2 ?
                    <>
                      <div className="info-order e-row">
                        <div className="e-col-6 ">{t("takeaway.cash")}</div>
                        <div className="e-col-6 e-flex content-end">0</div>
                      </div>
                      <div className="info-order e-row">
                        <div className="e-col-6 ">{t("takeaway.leftMoney")}</div>
                        <div className="e-col-6 e-flex content-end">0</div>
                      </div>
                    </> : ""
                }
                <div className="hr-setting-print"></div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-7 ">{t("billOrder.billWasPromotional")}</div>
                  <div className="e-col-5 e-flex content-end">0</div>
                </div>
              </div>
              <div className="footer-bill">
                <div className="wishes">{t("billOrder.discountVoucher")} {orderDetail.discount_voucher_per ? orderDetail.discount_voucher_per : 0}%</div>
                <div className="text-wishes">{t("billOrder.thanksYou")}!</div>
              </div>
            </div>
          </div>
        </div>
      </div> :
        <div className="no-data-table e-p-50 e-flex content-center item-center">
          <div>
            <img src={require("../../../../images/no-data.png")} />
            <div className="text">
              <span>{t("requestPayment.noDataOrder")}</span>
            </div>
          </div>
        </div>
      }
      </div>
    )
  }
}