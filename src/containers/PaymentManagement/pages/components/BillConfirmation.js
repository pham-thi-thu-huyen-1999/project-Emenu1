import React, { Component } from "react";
import Styles from "../PaymentManagement.module.scss";
import CircleGroupIcon from "./PaymentMethodIcon/CircleGroup";
import Swal from "../../../../utils/sweetalert2";
import MoneyCalculationModal from "./MoneyCalculationModal";
import moment from "moment";
import _, { toUpper } from "lodash";
import utilsFormat from "../../../../utils/formats";
import { PAYMENT_METHODS } from "../PaymentContants";
import { Button, Dialog } from "../../../../components/common/index";
import CompPrintBillPrint from '../components/CompPrintBillPrint';
import { get, save } from "../../../../services/localStorage";
import ReactToPrint from 'react-to-print';
class BillConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMoneyCalculation: false,
      isShowPopupChoosePrinter: false
    };
  }

  /**
   * Confirm checkout
   */
  confirmCheckout = () => {
    this.setState({ isShowMoneyCalculation: true });
  };
  /**
   * Close money calculator
   */
  closeMoneyCalculator = () => {
    this.setState({ isShowMoneyCalculation: false });
  };
  /**
   * Generate bill date
   */
  generateBillDate = () => {
    return moment().format("DD/MM/YYYY - HH:mm");
  };
  /**
   * Generate food list
   */
  generateFoodList = (foodList) => {
    const { trans, unit_price, partnerSetting } = this.props;
    return (
      <React.Fragment>
        <div className={`${Styles["food-info-item"]} ${Styles["header"]}`}>
          <span>
            {trans("payment:payment_order.payment_confirmation.food_list.name")}
          </span>
          <span>
            {trans(
              "payment:payment_order.payment_confirmation.food_list.quantity"
            )}
          </span>
          <span>
            {trans(
              "payment:payment_order.payment_confirmation.food_list.unit_price"
            )}
          </span>
          <span>
            {trans(
              "payment:payment_order.payment_confirmation.food_list.total"
            )}
          </span>
        </div>
        {_.isArray(foodList)
          ? foodList.map((item) => {
            return (
              <div key={item.id} className={`${Styles["food-info-item"]}`}>
                <span>{item.item_name}</span>
                <span>{item.qty}</span>
                <span>{utilsFormat.moneyFormat(item.price)}{unit_price}</span>
                <span>{utilsFormat.moneyFormat(item.qty * item.price)}{unit_price}</span>
                {/* <span>{utilsFormat.moneyFormat(item.price)} {partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span>
                <span>{utilsFormat.moneyFormat(item.qty * item.price)} {partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span> */}
              </div>
            );
          })
          : null}
      </React.Fragment>
    );
  };
  // /**
  //  * Render post money without discount
  //  */
  // renderPostMoneyWithoutDiscount = () => {
  //   const { orderPaymentInfo, additionalFeeAmount, unit_price } = this.props;
  //   let total = 0;
  //   if (orderPaymentInfo) {
  //     total += ((orderPaymentInfo.total_money + orderPaymentInfo.surcharge_value + orderPaymentInfo.vat_value) - orderPaymentInfo.discount_bill_value);
  //   }
  //   total += _.isNumber(additionalFeeAmount)
  //     ? additionalFeeAmount
  //     : parseInt(additionalFeeAmount)
  //       ? parseInt(additionalFeeAmount)
  //       : 0;
  //   return `${utilsFormat.moneyFormat(total + + parseFloat(this.renderVatAmount()))}${unit_price}`;
  // };
  /**
   * Render vat percent
   */
  renderVatPercent = () => {
    const { orderDetail } = this.props;
    let vatPercent = 0;
    if (orderDetail && orderDetail.vat_per) {
      vatPercent = orderDetail.vat_per;
    }
    return `(${vatPercent}%)`;
  };
  /**
   * Render vat amount
   */
  renderVatAmount = () => {
    const { orderDetail, additionalFeeAmount } = this.props;
    let vatAmount = 0;
    let vatIsVat = 0;
    let vatNoVat = 0;
    if (orderDetail.vat_per !== 0) {
      /* vatIsVat = orderDetail ? (orderDetail.total_money / orderDetail.vat_per) + (orderDetail.surcharge_value / orderDetail.vat_per) : 0; */
      vatIsVat = orderDetail ? orderDetail.is_vat_surcharge
        ? ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) + (10 * parseInt(additionalFeeAmount) / 100)
        : ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) : null;
      /* vatNoVat = orderDetail ? (orderDetail.total_money / orderDetail.vat_per) : 0; */
    }
    if (orderDetail) {
      vatAmount = /* orderDetail.is_vat_surcharge === false ? vatNoVat : */ vatIsVat;
      if (orderDetail.vat_per === 0) {
        vatAmount = 0;
      }
    }
    return vatAmount;
  };
  /**
   * Render bill discount
   */
  renderBillDiscount = () => {
    const { trans, unit_price, orderDetail } = this.props;
    let billDiscount = 0;
    if (orderDetail && orderDetail.discount_bill_value) {
      billDiscount = orderDetail.discount_bill_value;
    }
    return billDiscount > 0 ? `-${utilsFormat.moneyFormat(Math.ceil(billDiscount))} ${unit_price}(${trans("payment:payment_order.money_info.bill_promotion"
    )})` : "";
    // return billDiscount > 0 ? `-${utilsFormat.moneyFormat(Math.ceil(billDiscount))} ${partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}(${trans(
    //   "payment:payment_order.money_info.bill_promotion"
    // )})` : "";
  };
  /**
   * Render drink discount
   */
  renderDrinkDiscount = () => {
    const { orderDetail, trans, unit_price } = this.props;
    let drinkDiscount = 0;
    if (orderDetail && orderDetail.discount_drink_value) {
      drinkDiscount = orderDetail.discount_drink_value;
    }
    return `-${utilsFormat.moneyFormat(Math.ceil(drinkDiscount))} ${unit_price}(${trans(
      "payment:payment_order.money_info.drink_promotion"
    )})`;
  };
  /**
   * total payment
   * @param {*} paymentInfo
   * @param {*} additionalFeeAmount
   */
  calculatePostTotal = (paymentInfo, additionalFeeAmount) => {
    let total = 0;
    const { orderDetail } = this.props;
    const vat = orderDetail ? orderDetail.is_vat_surcharge
      ? ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) + (10 * parseInt(additionalFeeAmount) / 100)
      : ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) : null;
    if (orderDetail) {
      total = orderDetail.sub_total + parseInt(additionalFeeAmount) + vat
        - (orderDetail.discount_drink_value +
          orderDetail.discount_food_value +
          orderDetail.discount_bill_value)
    }
    // total += _.isNumber(additionalFeeAmount)
    //   ? additionalFeeAmount
    //   : parseInt(additionalFeeAmount)
    //     ? parseInt(additionalFeeAmount)
    //     : 0;
    return total;
  };
  /**
   * Render food discount
   */
  renderFoodDiscount = () => {
    const { orderDetail, trans, unit_price } = this.props;
    let foodDiscount = 0;
    if (orderDetail && orderDetail.discount_food_value) {
      foodDiscount = orderDetail.discount_food_value;
    }
    return `-${utilsFormat.moneyFormat(Math.ceil(foodDiscount))} ${unit_price}(${trans(
      "payment:payment_order.money_info.food_promotion"
    )})`;
  };
  // /**
  //  * Print Bill
  //  */
  // onPrintProvisi = () => {
  //   const { orderId } = this.props;
  //   this.props.history.push(`/printProvisi/${orderId}?check=true`);
  // }

  render() {
    const {
      trans,
      billAdditionalDetail,
      foodList,
      additionalFeeAmount,
      selectedPaymentMethod,
      voucher,
      orderId,
      history,
      orderDetail, infoPartner,
      unit_price, printerBillList, pageStyleFromApi
    } = this.props;
    const postTotal = this.calculatePostTotal(orderDetail, additionalFeeAmount);
    const { isShowMoneyCalculation } = this.state;
    let pageStyle = "";
    if (pageStyleFromApi && pageStyleFromApi.id) {
      pageStyle = `
            @page {
              size: auto;
              margin: ${pageStyleFromApi.top_margin}px ${pageStyleFromApi.left_margin}px ${pageStyleFromApi.bottom_margin}px ${pageStyleFromApi.right_margin}px !important;
            }

            @media all {
                .pagebreak {
                display: none;
              }
            }

            @media print {
                .pagebreak {
                page-break-before: auto;
              }
            }
      `;
    } else {
      pageStyle = `
        @page {
          size: auto;
          margin: 0mm;
        }

        @media all {
          .pagebreak {
            display: none;
          }
        }

        @media print {
          .pagebreak {
            page-break-before: auto;
          }
        }
      `;
    };
    return (
      <div
        className={`${Styles["e-main-content"]} ${Styles["center"]} ${Styles["horizontal-only"]}`}
      >
        <div className={Styles["payment-wrapper"]}>
          <div
            className={`${Styles["payment-order-title"]} ${Styles["center"]}`}
          >
            <span>
              {trans(
                "payment:payment_order.payment_confirmation.title"
              ).toUpperCase()}
            </span>
          </div>
          <div className={Styles["center"]}>
            <hr className={Styles["bill-confirmation-break"]} />
            <span className={Styles["center"]} style={{ margin: "0 10px" }}>
              <CircleGroupIcon />
            </span>
            <hr className={Styles["bill-confirmation-break"]} />
          </div>
          <div
            className={`${Styles["payment-info"]} ${Styles["bill-confirm"]} ${Styles["center"]} ${Styles["horizontal-only"]}`}
          >
            <div className={Styles["confirm-info"]}>
              <div className={Styles["general-info"]}>
                <div className={Styles["general-info-item"]}>
                  <span>{this.props.trans("table")} {billAdditionalDetail.tableName}</span>
                  <span>
                    {`${trans(
                      "payment:payment_order.payment_confirmation.order_no"
                    )}: ${billAdditionalDetail.orderNo}`}
                  </span>
                </div>
                <div className={Styles["general-info-item"]}>
                  <span>
                    {`${trans(
                      "payment:payment_order.payment_confirmation.staff_name"
                    )}: ${billAdditionalDetail.staffName}`}
                  </span>
                  <span>{this.generateBillDate()}</span>
                </div>
              </div>
              <div className={Styles["food-info"]}>
                {this.generateFoodList(foodList)}
              </div>
            </div>
            <div className={Styles["confirm-amount"]}>
              <div className={Styles["amount-info"]}>
                <div
                  className={`${Styles["amount-info-item"]} ${Styles["bold"]}`}
                >
                  <span>{trans("payment:payment_order.money_info.total")}</span>
                  <span>{utilsFormat.moneyFormat(Math.ceil(orderDetail
                    && orderDetail.sub_total ? orderDetail.sub_total: 0))} {unit_price}</span>
                </div>
                <div className={`${Styles["amount-info-item"]}`}>
                  <span>
                    {trans("payment:payment_order.money_info.additional_fee")}
                  </span>
                  <span>
                    {`${utilsFormat.moneyFormat(Math.ceil(additionalFeeAmount))} ${unit_price}`}
                  </span>
                </div>
                <div className={`${Styles["amount-info-item"]}`}>
                  <span>
                    {trans("payment:payment_order.money_info.promotion")}
                  </span>
                  <span>{this.renderBillDiscount()}</span>
                </div>
                {orderDetail && orderDetail.discount_drink_value ? <div className={`${Styles["amount-info-item"]}`}>
                  <span>&nbsp;</span>
                  <span>{this.renderDrinkDiscount()}</span>
                </div> : ""}
                {orderDetail && orderDetail.discount_food_value > 0 ? <div className={`${Styles["amount-info-item"]}`}>
                  <span>&nbsp;</span>
                  <span>{this.renderFoodDiscount()}</span>
                </div> : ""}
                {voucher.value && voucher.value > 0 ? <div className={`${Styles["amount-info-item"]}`}>
                  <span>
                    {trans("payment:payment_order.money_info.voucher")}
                  </span>
                  <span>
                    {`${utilsFormat.moneyFormat(Math.ceil(voucher.value))}`}
                    {unit_price}</span>
                </div> : ""}
                <div className={`${Styles["amount-info-item"]}`}>
                  <span>
                    {`${trans(
                      "payment:payment_order.money_info.tax"
                    )}${this.renderVatPercent()}`}
                  </span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(orderDetail ? this.renderVatAmount() : 0))} ${unit_price}`}</span>
                </div>
                <hr style={{ borderBottom: "1px solid #000" }} />
                <div
                  className={`${Styles["amount-info-item"]}`}
                  style={{ color: "#F58F1C" }}
                >
                  <span>
                    {toUpper(
                      trans("payment:payment_order.money_info.post_total")
                    )}
                  </span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(voucher.value
                    ? -(postTotal - voucher.value) : postTotal))} ${unit_price}`}</span>
                </div>
                <div
                  className={`${Styles["amount-info-item"]}`}
                  style={{ color: "#2699FB" }}
                >
                  <span>
                    {trans("payment:payment_order.payment_method.title")}
                  </span>
                  <span>
                    {trans(
                      `payment:payment_order.payment_methods.${selectedPaymentMethod
                        ? selectedPaymentMethod
                        : PAYMENT_METHODS[0]
                      }`
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${Styles["group-button"]}`}>
            <Button
              onClick={this.props.onClose}
              type="s3"
              className="e-m-right-10"
            >
              {trans("payment:payment_order.cancel")}
            </Button>
            <Button
              className="e-m-right-10"
              onClick={() => this.setState({ isShowPopupChoosePrinter: true })}
            >
              {trans("payment:payment_order.export_bill")}
            </Button>
            <Button
              onClick={this.confirmCheckout}
            >
              {trans("payment:payment_order.checkout")}
            </Button>
          </div>
          <MoneyCalculationModal
            close={this.closeMoneyCalculator}
            isShow={isShowMoneyCalculation}
            trans={trans}
            selectedPaymentMethod={selectedPaymentMethod}
            postTotal={voucher.value ? postTotal - voucher.value : postTotal}
            orderId={orderId}
            voucherCode={voucher && voucher.code ? voucher.code : null}
            additionalFeeAmount={additionalFeeAmount}
            history={history}
            orderDetail={orderDetail}
            unit_price={unit_price}
            foodList={foodList}
            postTotal={postTotal}
            foodList={foodList}
            voucher={voucher}
            isCheckPayByItem={this.props.isCheckPayByItem}
          />
        </div>
        <Dialog
          innerClass="max-width-payment-order"
          show={this.state.isShowPopupChoosePrinter}
          close={() => { this.setState({ isShowPopupChoosePrinter: false }) }}
        >
          <h2
            className="main-lbl text-center title-heading"
          >
            Danh sách máy in
            </h2>
          <div className="content">
            {printerBillList && printerBillList.length > 0 ? printerBillList.map(print => {
              if (print.printer_bills && print.printer_bills.length > 0) {
                if (get("area-id") === print.area_id) {
                  return print.printer_bills.map((item, index) => {
                    return (<div key={index} className="content-item">
                      <ReactToPrint
                        trigger={() => {
                          return <div className="reactToPrint">
                            <a href="#">
                              {item.printer_name}
                            </a>
                          </div>
                        }}
                        content={() => this.componentRef}
                        onBeforeGetContent={() => this.props.onBeforeGetContent(item)}
                      />
                      <CompPrintBillPrint
                        orderDetail={orderDetail}
                        infoPartner={infoPartner} t={trans}
                        additionalFeeAmount={additionalFeeAmount}
                        ref={el => (this.componentRef = el)} {...this.props}
                        unit_price={unit_price}
                        printerBillList={this.props.printerBillList}
                        postTotal={postTotal}
                        foodList={foodList}
                        voucher={voucher}

                      />
                    </div>);
                  })
                }
              }
            }) : <div className="text-center">Chưa có máy in nào được thiết lập.</div>}
          </div>
        </Dialog>
      </div>
    );
  }
}

export default BillConfirmation;
