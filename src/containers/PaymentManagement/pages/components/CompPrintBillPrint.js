import React from "react";
import QRCodeR from "qrcode.react";
import "../stylePrintOrder.scss";
import utilsFormat from "../../../../utils/formats";
import { get } from "../../../../services/localStorage";
import _ from "lodash";
export default class CompPrintBillPrint extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orderDetail: this.props.orderDetail,
      pageStyleFromApi: this.props.pageStyleFromApi ? this.props.pageStyleFromApi : {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pageStyleFromApi !== prevState.pageStyleFromApi) {
      return {
        pageStyleFromApi: nextProps.pageStyleFromApi
      };
    }
    return null;
  }
  render() {
    const {
      infoPartner, t, orderDetail,
      additionalFeeAmount,
      isCheckPayment,
      unit_price, voucher,
      foodList, postTotal } = this.props;
    const { pageStyleFromApi } = this.state;
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + ' ' + time;
    var indexOfQuestion = window.location.href.indexOf("=");
    var check = window.location.href.substring(indexOfQuestion + 1, indexOfQuestion + 5);
    const vat = orderDetail ? orderDetail.is_vat_surcharge
      ? ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) + (10 * parseInt(additionalFeeAmount ? additionalFeeAmount : get('Phu-Thu')) / 100)
      : ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) : null;
    let total = 0;
    const discount = orderDetail ? orderDetail.discount_drink_value +
      orderDetail.discount_food_value +
      orderDetail.discount_bill_value : 0
    if (orderDetail) {
      total = orderDetail.total_money + parseInt(additionalFeeAmount ? additionalFeeAmount : get('Phu-Thu')) + vat
        - discount
    }
    return (
      <div className={`e-m-top-${pageStyleFromApi && pageStyleFromApi.top_margin}
       e-m-left-${pageStyleFromApi && pageStyleFromApi.left_margin}
       e-m-bottom-${pageStyleFromApi && pageStyleFromApi.bottom_margin}
       e-m-right-${pageStyleFromApi && pageStyleFromApi.right_margin}`}>{orderDetail ? <div className="PDFContentSCSS-bill-printer">
          <div className="container-print-provisi">
            {pageStyleFromApi && pageStyleFromApi.is_show_partner === true ? <><div className="header-logo">
              <div className="logo">
                <img src={require("../../../../images/black-logo-omenu.png")} />
              </div>
              <div className="content-text-res">
                {infoPartner && JSON.stringify(infoPartner) !== JSON.stringify({})
                  ? <><h5>{infoPartner.name}</h5>
                    <span>{t("user.phone")}: {infoPartner.tel}</span>
                    <div>{t("user.address")}: {infoPartner.address}</div></>
                  : ""}
              </div>
            </div>
              <div className="e-flex content-center">
                <img src={require("../../../../images/line-black.png")} />
              </div></> : null}
            <div className="title-content-bill">
              <h5>{check === "true" || isCheckPayment === true ? t("takeaway.invoice") : t("billOrder.provisionalBill")}</h5>
              <div className="content-bill">
                <div className="info-table-order">
                  <div className="table-name-staff-left">
                    {pageStyleFromApi && pageStyleFromApi.is_show_table ? <div>{t("foodProcessing.tableNumber")} {orderDetail.table.name}</div> : null}
                    {pageStyleFromApi && pageStyleFromApi.is_show_bill_no ? <div>{t("takeaway.order_no")}: {orderDetail.order_no}</div> : null}
                  </div>
                  <div className="order-date-right">
                    {pageStyleFromApi && pageStyleFromApi.is_show_cashier ? <div>{t("takeaway.cashier")} : {orderDetail.order_users.length > 0
                      ? orderDetail.order_users[0].user.full_name : "Master"}</div> : null}
                    <div>{t("requestPayment.date")} : {dateTime}</div>
                  </div>
                </div>
                <div className="table-bill">
                  <div className="header-bill e-row">
                    <div className="e-col-4 ">{t("requestPayment.name")}</div>
                    <div className="e-col-2 ">{t("requestPayment.amount")}</div>
                    <div className="e-col-3 ">{t("requestPayment.unitPrice")}</div>
                    <div className="e-col-3 e-flex content-end">{t("requestPayment.intoMoney")}</div>
                  </div>
                  {foodList && foodList.length > 0 ?
                    foodList.map((item, index) => (
                      <div className="row-item e-row" key={index}>
                        <div className="e-col-4 ">{item.item_name}</div>
                        <div className="e-col-2 ">{item.qty}</div>
                        <div className="e-col-3 ">{utilsFormat.moneyFormat(Math.ceil(item.price))}{unit_price}</div>
                        <div className="e-col-3 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(item.qty * item.price))}{unit_price}</div>
                      </div>
                    )) : <div>{t("requestPayment.noDish")}</div>
                  }
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-6 ">{t("requestPayment.total")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.sub_total))} {unit_price}</div>
                  </div>
                  <div className="info-order e-row">
                    <div className="e-col-6 ">{t("requestPayment.surchange")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(additionalFeeAmount ? additionalFeeAmount : get('Phu-Thu')))} {unit_price}</div>
                  </div>
                  <div className="info-order e-row">
                    <div className="e-col-6 ">{t("requestPayment.tax")} ({orderDetail.vat_per}%)</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(vat))} {unit_price}</div>
                  </div>
                  {/* <div className="info-order row-total e-row">
                    <div className="total-payment e-col-6 ">{t("requestPayment.intoMoney")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money + vat))} {unit_price}</div>
                  </div> */}
                  <div className="info-order e-row">
                    <div className="e-col-6 ">Voucher</div>
                    <div className="e-col-6 e-flex content-end">{voucher ? -utilsFormat.moneyFormat(Math.ceil(voucher.value)) : 0} {unit_price}</div>
                  </div>
                  {/* {
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
                  } */}
                  {/* <div className="info-order row-total e-row">
                    <div className="total-payment e-col-7 ">{t("billOrder.billWasPromotional")}</div>
                    <div className="e-col-5 e-flex content-end">{discount} {unit_price}</div>
                  </div> */}
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-7 ">{t("Khuyến mãi")}</div>
                    <div className="e-col-5 e-flex content-end">
                      {orderDetail
                        ? !_.isEmpty(orderDetail.discount_bill_per) && orderDetail.discount_bill_per > 0
                          ? `-${orderDetail.discount_bill_per}%(${t(
                            "payment:payment_order.money_info.bill_promotion"
                          )})`
                          : orderDetail.discount_bill_value > 0
                            ? `-${utilsFormat.moneyFormat(Math.ceil(orderDetail.discount_bill_value))} ${unit_price}(${t(
                              "payment:payment_order.money_info.bill_promotion"
                            )})` : ""
                        : ""} {unit_price}</div>
                  </div>
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-6 ">{t("requestPayment.totalPayment")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(voucher ? postTotal - voucher.value : postTotal))} {unit_price}</div>
                  </div>
                </div>
                <div className="footer-bill">
                  <div className="to-qrcode">
                    <div className=" ">{t("billOrder.dowloadAppNow")}</div>
                    <QRCodeR
                      value={orderDetail.image_qrcode}
                      size={120}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                      renderAs={"svg"}
                      imageSettings={{
                        src: require("../../../../images/black-logo-omenu.png"),
                        x: null,
                        y: null,
                        height: 35,
                        width: 30,
                        excavate: true
                      }}
                    />
                  </div>
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