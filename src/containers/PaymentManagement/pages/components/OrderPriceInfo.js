import React, { Component } from "react";
import Styles from "../PaymentManagement.module.scss";
import utilsFormat from "../../../../utils/formats";
import { CleaveInput } from "../../../../components/common";
import _ from "lodash";
import { getCheckVoucher } from "../../../../api/order";
import {
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class OrderPriceInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      voucher: {
        code: "",
        value: 0,
        isValid: true,
        isCheck: false
      }
    };
  }

  /**
   * Check voucher
   */
  checkVoucherCode = async () => {
    const { orderId } = this.props.match.params;
    try {
      if (this.state.voucher.code !== "") {
        const data = await getCheckVoucher({
          voucher_code: this.state.voucher.code,
          order_id: orderId
        })
        let value = data.data.data.total_value;
        this.setState({
          voucher: {
            ...this.state.voucher,
            value,
            isCheck: true
          }
        })
        const voucher = {
          code: this.state.voucher.code,
          value
        }
        this.props.applyVoucherCode(voucher);
      }
    } catch (error) {
      this.setState({
        voucher: {
          ...this.state.voucher,
          isValid: false,
          isCheck: true
        }
      })
      const voucher = {
        code: null,
        value: 0
      }
      this.props.applyVoucherCode(voucher);
    }
  }
  /**
   * On voucher change
   */
  onVoucherChange = (event) => {
    const { value } = event.target;
    this.setState({
      voucher: {
        ...this.state.voucher,
        code: value,
        isCheck: false
      }
    })
  }

  render() {
    const {
      trans,
      setAdditionalFee,
      orderPaymentInfo,
      postTotal,
      additionalFeeAmount,
      orderDetail,
      unit_price,
      partnerSetting
    } = this.props;
    const vat = orderDetail ? orderDetail.is_vat_surcharge
      ? ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) + (10 * parseInt(additionalFeeAmount) / 100)
      : ((orderDetail.vat_per * orderDetail.sub_total_vat) / 100) : null;
    return (
      <div className={Styles["order-price-info-block"]}>
        <div className={Styles["order-price-item"]}>
          <span>{trans("payment:payment_order.money_info.total")}</span>
          <span>{`${utilsFormat.moneyFormat(Math.ceil(orderDetail && orderDetail.sub_total
            ? orderDetail.sub_total
            : 0)
          )} ${unit_price}`}</span>
          {/*  )} `}{partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span> */}
        </div>
        <div className={Styles["order-price-item"]}>
          <span>
            {trans("payment:payment_order.money_info.additional_fee")}
          </span>
          <div>
            <CleaveInput
              value={additionalFeeAmount}
              setValue={(value) => setAdditionalFee(value)}
              className={Styles["add-fee"]}
              options={{
                numeral: true,
                numeralThousandsGroupStyle: "thousand",
              }}
            />
            <span>{unit_price}</span>
            {/*  <span>{partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span> */}
          </div>
        </div>
        <div className={Styles["order-price-item"]}>
          <span className={Styles["discount"]}>
            {trans("payment:payment_order.money_info.promotion")}
            {/* <span className={`icon-question ${Styles["icon-question-custom"]}`}>
              <span className="path1"></span>
              <span className="path2"></span>
            </span> */}
          </span>
          <span>
            {orderDetail
              ? !_.isEmpty(orderDetail.discount_bill_per) && orderDetail.discount_bill_per > 0
                ? `-${orderDetail.discount_bill_per}%(${trans(
                  "payment:payment_order.money_info.bill_promotion"
                )})`
                : orderDetail.discount_bill_value > 0
                  ? `-${utilsFormat.moneyFormat(Math.ceil(orderDetail.discount_bill_value))} ${unit_price}(${trans(
                    "payment:payment_order.money_info.bill_promotion"
                  )})` : ""
              : ""}
          </span>
        </div>
        {orderDetail ?
          (orderDetail.discount_drink_value > 0 ?
            <div className={Styles["order-price-item"]}>
              <span className={Styles["discount"]}>&nbsp;</span>
              <span>
                -{utilsFormat.moneyFormat(Math.ceil(orderDetail.discount_drink_value))} {unit_price}({trans(
                "payment:payment_order.money_info.drink_promotion"
              )})
            </span>
            </div> : "") : ""
        }
        {orderDetail ?
          (orderDetail.discount_food_value > 0 ?
            <div className={Styles["order-price-item"]}>
              <span className={Styles["discount"]}>&nbsp;</span>
              <span>
                -{utilsFormat.moneyFormat(Math.ceil(orderDetail.discount_food_value))} {unit_price}({trans(
                "payment:payment_order.money_info.food_promotion"
              )})
            </span>
            </div> : "") : ""
        }
        <div
          className={`${Styles["order-price-item"]} ${Styles["order-price-item-padding"]}`}
        >
          <div className={Styles["add-voucher-group"]}>
            <input
              className={Styles["add-voucher"]}
              value={this.state.voucher.code}
              placeholder={trans(
                "payment:payment_order.money_info.voucher_placeholder"
              )}
              type="text"
              onChange={(event) => this.onVoucherChange(event)}
            />
            <div style={{ flex: "unset", height: "40px", marginLeft: "10px" }}>
              <button
                onClick={this.checkVoucherCode}
                type="button"
                className={Styles["voucher-button"]}
              >
                <span style={{ color: "#fff" }} className="icon-checkmark"></span>
              </button>
            </div>
          </div>
        </div>

        {!this.state.voucher.isValid ? (
          <div className={Styles["order-price-item"]}>
            <div className={Styles["voucher-validation"]}>
              {trans("payment:payment_order.money_info.error_voucher")}
            </div></div>

        ) : this.state.voucher.isCheck ? (
          <div className={Styles["order-price-item"]}>
            <div className={Styles["voucher-validation"]}>
              <span style={{ color: '#898989', marginRight: '10px' }}>
                {trans("payment:payment_order.money_info.voucher_code")}:
              </span>
              <span style={{ marginRight: '5px' }}>
                {this.state.voucher.code}
              </span>
              <span>
                <FontAwesomeIcon icon={faTimesCircle} />
              </span>
            </div>
            <span>
              {this.state.voucher.value ? `-${utilsFormat.moneyFormat(this.state.voucher.value)}${unit_price}` : null}
            </span>
          </div>
        ) : null}
        <div className={Styles["order-price-item"]}>
          <span>{trans("payment:payment_order.money_info.tax")}({orderDetail ? orderDetail.vat_per : null}%)</span>
          <span>
            {utilsFormat.moneyFormat(Math.ceil(vat))} {unit_price}
          </span>
        </div>
        <div className={Styles["order-price-item"]}>
          <span className={Styles["total-money"]}>{trans("payment:payment_order.money_info.final_price")}</span>
          <span>{`${utilsFormat.moneyFormat(Math.ceil(this.state.voucher.value ? postTotal - this.state.voucher.value : postTotal))} ${unit_price}`}</span>
          {/* <span>{`${utilsFormat.moneyFormat(Math.ceil(this.state.voucher.value ? postTotal - this.state.voucher.value : postTotal))} `}{partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span> */}
        </div>
      </div>
    );
  }
}

export default OrderPriceInfo;
