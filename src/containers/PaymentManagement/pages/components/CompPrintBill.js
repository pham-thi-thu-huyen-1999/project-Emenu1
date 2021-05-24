import React, { Component } from "react";
import { QRcode } from "../../../../components/common/index";
import "../stylePrintOrder.scss";
import utilsFormat from "../../../../utils/formats";
import { get } from "../../../../services/localStorage";
export default class CompPrintBill extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orderDetail: this.props.orderDetail
    }
  }
  /**
   * Get order detail
   */
  getOrderDetail = () => {
    const { orderId } = this.props.match.params;
    if (orderId) {
      this.props.paymentActions.getOrderDetail({ order_id: orderId });
    }
  };
  render() {
    const { infoPartner, t, orderDetail, isCheckPayment } = this.props;
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + ' ' + time;
    //check is true in bang hoa don
    var indexOfQuestion = window.location.href.indexOf("=");
    var check = window.location.href.substring(indexOfQuestion + 1, indexOfQuestion + 5);
    return (
      <>{orderDetail ? <div className="PDFContentSCSS-bill">
        <div className="container-print-provisi">
          <div className="header-logo">
            <div className="logo">
              <img src={require("../../../../images/logo-omenu.png")} />
            </div>
            <div className="content-text-res">
              {infoPartner && JSON.stringify(infoPartner) !== JSON.stringify({})
                ? <><h4>{infoPartner.name}</h4>
                  <span>{t("user.phone")}: {infoPartner.tel}</span>
                  <div>{t("user.address")}: {infoPartner.address} </div></>
                : ""}
            </div>
          </div>
          <div className="e-flex content-center">
            <img src={require("../../../../images/line.png")} />
          </div>
          <div className="title-content-bill">
            <h4>{check === "true" || isCheckPayment === true ? t("takeaway.invoice") : t("billOrder.provisionalBill")}</h4>
            <div className="content-bill">
              <div className="info-table-order">
                <div className="table-name-staff-left">
                  <span>{t("foodProcessing.tableNumber")} {orderDetail.table.name}</span>
                  <div>{t("takeaway.cashier")} : {orderDetail.order_users.length > 0
                    ? orderDetail.order_users[0].user.full_name : "Master"}</div>
                </div>
                <div className="order-date-right">
                  <span>{t("takeaway.order_no")}: {orderDetail.order_no}</span>
                  <div>{t("requestPayment.date")} : {dateTime}</div>
                </div>
              </div>
              <div className="table-bill">
                <div className="header-bill e-row">
                  <div className="e-col-4 e-p-10">{t("requestPayment.name")}</div>
                  <div className="e-col-2 e-p-10">{t("requestPayment.amount")}</div>
                  <div className="e-col-3 e-p-10">{t("requestPayment.unitPrice")}</div>
                  <div className="e-col-3 e-p-10 e-flex content-end">{t("requestPayment.intoMoney")}</div>
                </div>
                {orderDetail.order_items && orderDetail.order_items.length > 0 ?
                  orderDetail.order_items.map((item, index) => (
                    <div className="row-item e-row" key={index}>
                      <div className="e-col-4 e-p-10">{item.item_name}</div>
                      <div className="e-col-2 e-p-10">{item.qty}</div>
                      <div className="e-col-3 e-p-10">{utilsFormat.moneyFormat(Math.ceil(item.price))} VNĐ</div>
                      <div className="e-col-3 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(item.qty * item.price))} VNĐ</div>
                    </div>
                  )) : <div>{t("requestPayment.noDish")}</div>
                }
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 e-p-10">{t("requestPayment.total")}</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money))} VNĐ</div>
                </div>
                <div className="info-order e-row">
                  <div className="e-col-6 e-p-10">{t("requestPayment.surchange")}</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(get("Phu-Thu") ? get("Phu-Thu") : orderDetail.surcharge_value))} VNĐ</div>
                </div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 e-p-10">{t("requestPayment.moneyBefTax")}</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money + parseFloat(get("Phu-Thu") ? get("Phu-Thu") : orderDetail.surcharge_value)))} VNĐ</div>
                </div>
                <div className="info-order e-row">
                  <div className="e-col-6 e-p-10">{t("requestPayment.tax")} ({orderDetail.vat_per}%)</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.vat_value))} VNĐ</div>
                </div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 e-p-10">{t("requestPayment.intoMoney")}</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money + parseFloat(get("Phu-Thu") ? get("Phu-Thu") : orderDetail.surcharge_value) + orderDetail.vat_value))} VNĐ</div>
                </div>
                <div className="info-order e-row">
                  <div className="e-col-6 e-p-10">Voucher</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.discount_voucher_value))} VNĐ</div>
                </div>
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 e-p-10">{t("requestPayment.totalPayment")}</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderDetail.total_money + parseFloat(get("Phu-Thu") ? get("Phu-Thu") : orderDetail.surcharge_value) + orderDetail.vat_value - orderDetail.discount_voucher_value))} VNĐ</div>
                </div>
                {
                  orderDetail.order_status.id === 2 ?
                    <>
                      <div className="info-order e-row">
                        <div className="e-col-6 e-p-10">{t("takeaway.cash")}</div>
                        <div className="e-col-6 e-p-10 e-flex content-end">0 VNĐ</div>
                      </div>
                      <div className="info-order e-row">
                        <div className="e-col-6 e-p-10">{t("takeaway.leftMoney")}</div>
                        <div className="e-col-6 e-p-10 e-flex content-end">0 VNĐ</div>
                      </div>
                    </> : ""
                }
                <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 e-p-10">{t("billOrder.billWasPromotional")}</div>
                  <div className="e-col-6 e-p-10 e-flex content-end">0 VNĐ</div>
                </div>
              </div>
              <div className="footer-bill">
                <div className="wishes">{t("billOrder.discountVoucher")} {orderDetail.discount_voucher_per}%</div>

                <div className="to-qrcode">
                  <div className="e-p-10">{t("billOrder.dowloadAppNow")}</div>
                  <QRcode
                    size={200}
                    value={orderDetail.image_qrcode}
                    imageSettings={{
                      x: null,
                      y: null,
                      height: 20,
                      width: 20,
                      excavate: true
                    }}
                  >
                  </QRcode>
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
      </>
    )
  }
}