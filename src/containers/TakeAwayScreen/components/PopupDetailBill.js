import React, { Component } from "react";
import { Dialog, Button } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "../../../utils/sweetalert2";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "./PopupPayments.scss"
import image from "../img/QR.png";
import QRCodeR from "qrcode.react";
import utilsFormat from "../../../utils/formats";
import _ from "lodash";
// import * as action from "../actions";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { withNamespaces } from "react-i18next";
// import { name } from "../reducers";
// import { getOrderItemById } from "../../../api/order";

export default class PopupDetailBill extends React.PureComponent {
  state = {
    orderItemById: this.props.orderItemByIdConfirm ? this.props.orderItemByIdConfirm : {}
  };

  componentDidMount() {
    const { childRef } = this.props;
    childRef(this);
  }
  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderItemByIdConfirm !== prevState.orderItemById) {
      return { orderItemById: nextProps.orderItemByIdConfirm };
    } else return null;
  }

  render() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' - ' + time;
    const { voucher, isCheckPayment, pageStyleFromApi, unit_price, isChecked, billInfoById,
      show, close, partnerById, userInfo, billInfo, order_no, t, voucher_code, surcharge_no_pay,
      totalBill, received_no_pay, isCheckPaymented } = this.props;
    const { orderItemById } = this.state;

    var discount_vat = 0;

    var surcharge = surcharge_no_pay ? surcharge_no_pay : (billInfoById && billInfoById.surcharge_value ? billInfoById.surcharge_value : 0);

    var received = received_no_pay ? received_no_pay : (billInfoById && billInfoById.money_received ? billInfoById.money_received : 0);

    var total_money = orderItemById ? orderItemById.sub_total : totalBill;

    if (orderItemById && orderItemById.vat_per !== 0) {
      discount_vat = parseFloat(orderItemById.vat_per) / 100;
    }

    var money = orderItemById ? orderItemById.sub_total : total_money;

    let vat_surcharge = 0;

    //surchagre
    if (orderItemById && orderItemById.vat_per !== 0) {
      if (orderItemById.is_vat_surcharge === true) {
        vat_surcharge = parseFloat(surcharge) * (orderItemById.vat_per / 100);
        money = orderItemById.sub_total;
      } else {
        money = orderItemById.sub_total;
      }
    }

    //discount bill
    let discount_bill = 0;
    if (!_.isEmpty(orderItemById.discount_bill_per) && orderItemById.discount_bill_per > 0) {
      discount_bill = money * (orderItemById.discount_bill_per / 100);
      money -= (money * (orderItemById.discount_bill_per / 100));
    } else {
      discount_bill = orderItemById.discount_bill_value;
      money -= orderItemById.discount_bill_value;
    }

    //discount food
    if (orderItemById?.discount_drink_value > 0) {
      money -= orderItemById.discount_drink_value;
    }

    //discount drink
    if (orderItemById?.discount_food_value > 0) {
      money -= orderItemById.discount_food_value;
    }

    let voucher_price = 0;
    //discount voucher
    if (voucher && orderItemById && voucher.code && voucher.total_value) {
      if (voucher_code && voucher_code === voucher ? voucher.code : -1) {
        if (voucher && voucher.type == 1) //Giam theo %
        {
          voucher_price = orderItemById.sub_total * (voucher.total_value / 100);
          money -= orderItemById.sub_total * (voucher.total_value / 100);
        } else {
          voucher_price = voucher.total_value;
          money -= voucher.total_value;
        }
      }
    }

    //vat
    let vat_bill = orderItemById.sub_total * (orderItemById.vat_per / 100) + (vat_surcharge ? vat_surcharge : 0);
    money += orderItemById.sub_total * (orderItemById.vat_per / 100) + (vat_surcharge ? vat_surcharge : 0) + parseFloat(surcharge);

    var check = false;

    return (
      <div className={`e-m-top-${pageStyleFromApi && pageStyleFromApi.top_margin}
       e-m-left-${pageStyleFromApi && pageStyleFromApi.left_margin}
       e-m-bottom-${pageStyleFromApi && pageStyleFromApi.bottom_margin}
       e-m-right-${pageStyleFromApi && pageStyleFromApi.right_margin}`}>{orderItemById ? <div className="PDFContentSCSS-bill-printer">
          <div className="container-print-provisi">
            {pageStyleFromApi && pageStyleFromApi.is_show_partner === true ? <><div className="header-logo">
              <div className="logo">
                <img src={require("../../../images/black-logo-omenu.png")} />
              </div>
              <div className="content-text-res">
                {partnerById && JSON.stringify(partnerById) !== JSON.stringify({})
                  ? <><h5>{partnerById.name}</h5>

                    <div>{t("takeaway.website")}: {partnerById.website}</div>
                    <span>{t("user.phone")}: {partnerById.tel}</span>
                    <div>{t("user.address")}: {partnerById.address}</div></>
                  : ""}
              </div>
            </div>
              <div className="e-flex content-center">
                <img src={require("../../../images/line-black.png")} />
              </div></> : null}
            <div className="title-content-bill">
              <h5>{check === "true" || isCheckPayment === true ? t("takeaway.invoice") : t("billOrder.provisionalBill")}</h5>
              <div className="content-bill">
                <div className="info-table-order">
                  <div className="table-name-staff-left">
                    {pageStyleFromApi && pageStyleFromApi.is_show_cashier ? <div>{t("takeaway.cashier")} : {orderItemById && orderItemById.order_users && orderItemById.order_users.length > 0
                      ? orderItemById && orderItemById.order_users[0].user.full_name : "Master"}</div> : null}
                    {pageStyleFromApi && pageStyleFromApi.is_show_bill_no ? <div>{t("takeaway.order_no")}: {orderItemById && orderItemById.order_no}</div> : null}
                  </div>
                  <div className="order-date-right">
                    <div>{t("requestPayment.date")} : {dateTime}</div>
                  </div>
                </div>
                <div className="table-bill">
                  <div className="header-bill e-row" style={{ fontSize: "smaller" }}>
                    <div className="e-col-3 ">{t("requestPayment.name")}</div>
                    <div className="e-col-3 ">{t("requestPayment.amount")}</div>
                    <div className="e-col-3 ">{t("requestPayment.unitPrice")}</div>
                    <div className="e-col-3 e-flex content-end">{t("requestPayment.intoMoney")}</div>
                  </div>
                  {isCheckPaymented ?
                    (orderItemById && orderItemById.bill_items && orderItemById.bill_items.length > 0 ?
                      orderItemById.bill_items.map((item, index) => (
                        <div className="row-item e-row" key={index} style={{ fontSize: "smaller" }}>
                          <div className="e-col-4 ">{item.item_name}</div>
                          <div className="e-col-2 ">{item.qty}</div>
                          <div className="e-col-3 ">{utilsFormat.moneyFormat(Math.ceil(item.price))}{unit_price}</div>
                          <div className="e-col-3 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(item.qty * item.price))}{unit_price}</div>
                        </div>
                      )) : <div>{t("requestPayment.noDish")}</div>)
                    : (orderItemById && orderItemById.order_items && orderItemById.order_items.length > 0 ?
                      orderItemById.order_items.map((item, index) => (
                        <div className="row-item e-row" key={index} style={{ fontSize: "smaller" }}>
                          <div className="e-col-4 ">{item.item_name}</div>
                          <div className="e-col-2 ">{item.qty}</div>
                          <div className="e-col-3 ">{utilsFormat.moneyFormat(Math.ceil(item.price))}{unit_price}</div>
                          <div className="e-col-3 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(item.qty * item.price))}{unit_price}</div>
                        </div>
                      )) : <div>{t("requestPayment.noDish")}</div>)
                  }
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-6 ">{t("requestPayment.total")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(orderItemById && orderItemById.sub_total ? orderItemById.sub_total : parseFloat(total_money)))} {unit_price}</div>
                  </div>
                  <div className="info-order e-row">
                    <div className="e-col-6 ">{t("requestPayment.surchange")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(surcharge ? surcharge : 0))} {unit_price}</div>

                  </div>
                  {/* <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6  ">{t("requestPayment.moneyBefTax")}</div>
                      <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(billInfo ? parseFloat(billInfo.total_money) : parseFloat(total_money)))} {unit_price}</div>
                </div> */}
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-7 ">{t("takeaway.discount")}</div>
                    <div className="e-col-5 e-flex content-end" style={{ fontSize: "smaller" }}>{orderItemById
                      ? !_.isEmpty(orderItemById.discount_bill_per) && orderItemById.discount_bill_per > 0
                        ? `-${discount_bill}%(${t(
                          "payment:payment_order.money_info.bill_promotion"
                        )})(-${orderItemById.discount_bill_per}%)`
                        : orderItemById.discount_bill_value > 0
                          ? `-${utilsFormat.moneyFormat(Math.ceil(orderItemById.discount_bill_value))} ${unit_price}(${t(
                            "payment:payment_order.money_info.bill_promotion"
                          )})` : <div style={{ fontSize: 10 }}>{`0 ${unit_price}`}</div>
                      : ""}
                    </div>
                  </div>
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-7 "></div>
                    <div className="e-col-5 e-flex content-end" style={{ fontSize: "smaller" }}>
                      {orderItemById ?
                        (orderItemById.discount_drink_value > 0 ?
                          <div className="order-price-item">
                            <span className="discount">&nbsp;</span>
                            <span>
                              -{utilsFormat.moneyFormat(Math.ceil(orderItemById.discount_drink_value))} {unit_price}({t(
                              "payment:payment_order.money_info.drink_promotion"
                            )})
                        </span>
                          </div> : "") : ""
                      }
                    </div>
                  </div>
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-7 "></div>
                    <div className="e-col-5 e-flex content-end" style={{ fontSize: "smaller" }}>
                      {orderItemById ?
                        (orderItemById.discount_food_value > 0 ?
                          <div className="order-price-item">
                            <span className="discount">&nbsp;</span>
                            <span>
                              -{utilsFormat.moneyFormat(Math.ceil(orderItemById.discount_food_value))} {unit_price}({t(
                              "payment:payment_order.money_info.food_promotion"
                            )})
                        </span>
                          </div> : "") : ""
                      }
                    </div>
                  </div>
                  <div className="info-order e-row">
                    <div className="e-col-6 ">{t("takeaway.voucher")}</div>
                    <div className="e-col-6 e-flex content-end">{voucher_price === 0 ? 0 : -utilsFormat.moneyFormat(Math.ceil(voucher_price))} {unit_price}</div>
                  </div>
                  <div className="info-order e-row">
                    <div className="e-col-6 ">{t("requestPayment.tax")} ({orderItemById && orderItemById.vat_per}%)</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(/* this.props.totalBill ? this.props.totalBill - total_money : money - (total_money + parseFloat(surcharge)) */vat_bill ? vat_bill : 0))} {unit_price}</div>
                  </div>
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-6 ">{t("requestPayment.intoMoney")}</div>
                    <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil(/* this.props.totalBill ? this.props.totalBill :  */money))} {unit_price}</div> {/* Math.ceil(parseFloat(total_money) + parseFloat(surcharge) + ((orderItemById && orderItemById.is_vat_surcharge === true ? (parseFloat(total_money) + parseFloat(surcharge)) : parseFloat(total_money) ) * discount_vat)) */}
                  </div>

                  {/* <div className="info-order row-total e-row">
                  <div className="total-payment e-col-6 ">{t("requestPayment.totalPayment")}</div>
                      <div className="e-col-6 e-flex content-end">{utilsFormat.moneyFormat(Math.ceil((parseFloat(total_money) + parseFloat(surcharge) + (parseFloat(total_money) * discount_vat)) - parseFloat(discount_voucher)))} {unit_price}</div>
                  </div> */}
                  {/* {
                  billInfo && billInfo.order_status.id === 2 ?
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
                    <div className="total-payment e-col-7 ">{t("takeaway.cash")}</div>
                      <div className="e-col-5 e-flex content-end">{received} {unit_price}</div>
                </div>
                  <div className="info-order row-total e-row">
                    <div className="total-payment e-col-7 ">{t("takeaway.leftMoney")}</div>
                    <div className="e-col-5 e-flex content-end">{received - (parseFloat(total_money) + parseFloat(surcharge) + ((parseFloat(total_money) + parseFloat(surcharge)) * discount_vat) - parseFloat(discount_voucher))} {unit_price}  </div>
                </div> */}
                </div>
                <div className="footer-bill">
                  <div className="to-qrcode">
                    <div className=" ">{t("billOrder.dowloadAppNow")}</div>
                    <QRCodeR
                      value={orderItemById && orderItemById.image_qrcode ? orderItemById.image_qrcode : ""}
                      size={120}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                      renderAs={"svg"}
                      imageSettings={{
                        src: require("../../../images/black-logo-omenu.png"),
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
              <img src={require("../../../images/no-data.png")} />
              <div className="text">
                <span>{t("requestPayment.noDataOrder")}</span>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     ...state[name],
//   };
// };
// const mapDispatchToProps = (dispatch) => {
//   const actions = {
//     ...action,
//   };
//   return { actions: bindActionCreators(actions, dispatch) };
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withNamespaces()(PopupDetailBill));

