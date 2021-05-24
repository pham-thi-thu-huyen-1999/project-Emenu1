import { toUpper } from "lodash";
import React, { Component } from "react";
import Styles from "../PaymentManagement.module.scss";
import { CleaveInput, CheckBox, Button } from "../../../../components/common";
import { faBackspace, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PAYMENT_METHODS } from "../PaymentContants";
import utilsFormat from "../../../../utils/formats";
import { paymentOrder } from "../../../../api/order";
import _ from "lodash";
import Swal from '../../../../utils/sweetalert2';
import CompPrintBillPrint from './CompPrintBillPrint';
import ReactToPrint from 'react-to-print';
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as paymentActions from "../../actions";
import { PaymentReducerName } from "../../reducers";
import '../stylePrintOrder.scss';
import { name } from "../../../SettingScreen/reducers";
import * as settingPrintActions from "../../../SettingScreen/actions";
import { get } from "../../../../services/localStorage";
import Validator from "../../../../utils/validator";
import {
  addNofitication
} from '../../../../api/notification';
class MoneyCalculationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMoney: "",
      remainMoney: 0,
      numpadSetting: [
        "7",
        "8",
        "9",
        "backspace",
        "4",
        "5",
        "6",
        "clear",
        "1",
        "2",
        "3",
        // "calc",
        "0",
        "00",
        "000",
      ],
      defaultMoney: ["500000", "200000", "100000", "50000", "20000", "10000"],
      isCustomerGetRemainMoney: false,
      orderDetail: this.props.orderDetail ? this.props.orderDetail : {},
      errors: {}
    };
    const rules = [
      {
        field: "inputMoney",
        method: data => {
          if (data > 0) {
            if (data < this.props.postTotal) {
              return false
            } else {
              return true
            }
          } else {
            return false
          }
        },
        validWhen: true,
        message: "Vui lòng nhập số tiền"
      }
    ];
    this.validator = new Validator(rules);
  }

  componentDidMount = () => {
    const { orderId } = this.props;
    if (orderId) {
      this.props.paymentActions.getOrderDetail({ order_id: orderId });
    }
    this.props.paymentActions.getInfoPartner();
    this.props.settingPrintActions.getPrinterBillList();
  }

  componentDidUpdate(prevProps, prevStates) {
    const { isCustomerGetRemainMoney, inputMoney } = prevStates;
    const { postTotal } = prevProps;
    if (isCustomerGetRemainMoney !== this.state.isCustomerGetRemainMoney) {
      this.calculateRemainMoney(inputMoney, postTotal)
    }
  }
  /**
   * Handle numpad click
   */
  handleNumpadClick = (numpadValue, isDefaultMoney) => {
    let input = this.state.inputMoney;
    if (isDefaultMoney) {
      input = numpadValue;
    } else {
      if (input === "") {
        if (!["backspace", "clear", "calc", "0", "00", "000"].includes(numpadValue)) {
          input += numpadValue;
        }
      } else {
        if (!["backspace", "clear", "calc"].includes(numpadValue)) {
          input += numpadValue;
        } else {
          switch (numpadValue) {
            case "backspace":
              input = input.slice(0, -1);
              break;
            case "clear":
              input = "";
              break;
            default:
              break;
          }
        }
      }
    }
    this.setState({ inputMoney: input }, () => {
      this.calculateRemainMoney(this.state.inputMoney, this.props.postTotal)
    })
  }
  /**
   * Render numpad
   */
  renderNumpad = () => {
    return this.state.numpadSetting.map((numpadItem, index) => {
      return (
        <button
          key={index}
          type="button"
          className={`${Styles["numpad-button"]}${numpadItem === "backspace" ? ` ${Styles["backspace"]}` : ""
            }${numpadItem === "clear" ? ` ${Styles["clear"]}` : ""}${numpadItem === "calc" ? ` ${Styles["calc"]}` : ""
            }`}
          onClick={this.handleNumpadClick.bind(this, numpadItem, false)}
        >
          {numpadItem === "backspace" ? (
            <FontAwesomeIcon icon={faBackspace} style={{ color: "#fff" }} />
          ) : numpadItem === "clear" ? (
            <span>C</span>
          ) : numpadItem === "calc" ? (
            <span>OK</span>
          ) : (
                  numpadItem
                )}
        </button>
      );
    });
  };
  /**
   * Render default money
   */
  renderDefaultMoney = () => {
    return this.state.defaultMoney.map((numpadItem, index) => {
      return (
        <button
          key={index}
          type="button"
          className={`${Styles["default-money-button"]}`}
          onClick={this.handleNumpadClick.bind(this, numpadItem, true)}
        >
          {numpadItem}
        </button>
      );
    });
  };
  /**
   * Calculate remain money
   */
  calculateRemainMoney = (inputMoney, postTotal) => {
    let remainMoney = !this.state.isCustomerGetRemainMoney
      ? inputMoney - postTotal
      : 0;
    this.setState({ inputMoney: inputMoney, remainMoney: remainMoney });
  };
  /**
   * Confirm final payment
   */
  confirmFinalPayment = async () => {
    const { infoPartner, trans,
      printerBillList, postTotal,
      foodList, voucher, unit_price,
      isCheckPayByItem } = this.props;
    const { orderDetail } = this.state;
    let pageStyleFromApi = {};
    if (printerBillList && printerBillList.length > 0) {
      for (let i = 0; i < printerBillList.length; i++) {
        if (get("area-id") === printerBillList[i].area_id) {
          pageStyleFromApi = printerBillList[i].printer_bills[0];
        }
      }
    }
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
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        icon: "warning",
        title: this.props.trans("payment:payment_order.modal_swal.accept"),
        text: this.props.trans(
          "payment:payment_order.payment_confirmation.confirm_checkout"
        ),
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: this.props.trans("table_list:modal_swal.ok"),
        cancelButtonText: this.props.trans("table_list:modal_swal.cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let orderItems = []
            this.props.foodList.map(item => {
              orderItems.push({
                order_item_id: "",
                item_id: item.item_id,
                qty: 2,
                note: "",
                is_takeaway: true,
                order_addon_items: []
              })
              return item
            })
            const param = {
              order: {
                surcharge_value: parseInt(this.props.additionalFeeAmount),
                voucher_code: this.props.voucherCode,
                money_received: this.state.inputMoney ? parseInt(this.state.inputMoney) : 0,
                is_change: this.state.isCustomerGetRemainMoney
              },
              order_items: isCheckPayByItem ? orderItems : []
            }
            await paymentOrder({ id: this.props.match.params.orderId/* this.props.orderId */, data: param });
            const dataPushNoti = {
              "title": "Đã thanh toán",
              "content": `Bàn ${orderDetail.table.name} vừa thực hiện hủy order`,
              "action": "finished_payment",
              "type_notification": "1",
              "link": "",
              "body_data": {
                "table_id": orderDetail.table.id,
                "order_id": orderDetail.id,
                action: "finished_payment"
              },
              "topic": `area_${orderDetail.table.area.id}`,
              "list_user": [
                ""
              ],
              "is_push_noti": "1"
            }
            await addNofitication({ data: dataPushNoti })
            this.props.history.push("/");
            Swal.fire({
              icon: 'success',
              customClass: {
                confirmButton: 'print_order_table',
              },
              title: trans("payment:payment_order.notiPaymentSuccess"),
              showConfirmButton: true,
              confirmButtonText: <>
                <ReactToPrint
                  trigger={() => {
                    return <div className="reactToPrint">
                      <a href="#"><FontAwesomeIcon icon={faPrint} /> {this.props.trans("table_list:print_order_table")}</a>
                    </div>
                  }}
                  content={() => this.componentRef}
                  pageStyle={pageStyle}
                />
                <CompPrintBillPrint
                  pageStyleFromApi={pageStyleFromApi}
                  isCheckPayment={true}
                  orderDetail={orderDetail}
                  infoPartner={infoPartner} t={trans}
                  ref={el => (this.componentRef = el)}
                  postTotal={postTotal}
                  foodList={foodList}
                  voucher={voucher}
                  unit_price={unit_price}
                />
              </>,
            })
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: trans("payment:payment_order.notiPaymentFail"),
              showConfirmButton: true
            })
          }
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }

  render() {
    const {
      isShow,
      close,
      trans,
      selectedPaymentMethod,
      postTotal,
      unit_price,
      partnerSetting,
      orderDetail
    } = this.props;

    const { inputMoney, remainMoney, errors } = this.state;
    let text = ""
    if (inputMoney > 0) {
      if (inputMoney < postTotal) {
        text = "vui lòng nhập số tiền thanh toán hợp lệ"
      } else {
        text = ""
      }
    } else {
      text = "vui lòng nhập số tiền thanh toán"
    }
    if (isShow) {
      return (
        <div
          className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}
        >
          <div
            className={`mfp-content ${Styles["modal-wrapper"]}`}
            style={{ width: "930px", height: "auto" }}
          >
            <div
              className={Styles["button-close"]}
              onClick={() => close()}
            ></div>
            <div className={Styles["modal-header-title"]}>
              <span>
                {toUpper(
                  trans("payment:payment_order.money_calculator_modal.title")
                )}
              </span>
            </div>
            <div
              className={`${Styles["modal-content-wrapper"]} ${Styles["money-calculator"]}`}
            >
              <div className={Styles["numpad"]}>
                <div className={Styles["input-wrapper"]}>
                  <CleaveInput
                    setValue={(value) =>
                      this.calculateRemainMoney(value, postTotal)
                    }
                    className={Styles["numpad-input"]}
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand",
                    }}
                    value={inputMoney ? inputMoney : "0"}
                  />
                  {errors.inputMoney ? (
                    <div className={Styles["validation"]}
                      style={{ color: "red" }}>
                      {text}
                    </div>
                  ) : ""}
                </div>
                <div className={Styles["numpad-wrapper"]}>
                  {this.renderNumpad()}
                </div>
                <div className={Styles["default-money-wrapper"]}>
                  <div className={Styles["title"]}>
                    {toUpper(
                      trans(
                        "payment:payment_order.money_calculator_modal.default_money_title"
                      )
                    )}
                  </div>
                  {this.renderDefaultMoney()}
                </div>
              </div>
              <div className={Styles["money-calculated-info"]}>
                <div className={Styles["info-item"]}>
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
                <div
                  className={`${Styles["info-item"]} ${Styles["remain-money"]}`}
                >
                  <span>{trans("payment:payment_order.money_calculator_modal.total")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(postTotal))}${unit_price}`}</span>
                </div>
                <div className={Styles["info-item"]}>
                  <span>{trans("payment:payment_order.money_calculator_modal.input_money")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(inputMoney))}${unit_price}`}</span>
                </div>
                <div className={Styles["info-item"]}>
                  <span>{trans("payment:payment_order.money_calculator_modal.remain_money")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(remainMoney))}${unit_price}`}</span>
                  {/* <span>{`${utilsFormat.moneyFormat(Math.ceil(postTotal))}`} {partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span>
                </div>
                <div className={Styles["info-item"]}>
                  <span>{trans("payment:payment_order.money_calculator_modal.input_money")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(inputMoney))}`} {partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span>
                </div>
                <div className={Styles["info-item"]}>
                  <span>{trans("payment:payment_order.money_calculator_modal.remain_money")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(remainMoney))}`} {partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""}</span> */}
                </div>
                <div
                  className={`${Styles["info-item"]} ${Styles["get-remain-money"]}`}
                >
                  <CheckBox
                    checked={this.state.isCustomerGetRemainMoney}
                    onChange={(value) =>
                      this.setState({ isCustomerGetRemainMoney: value })
                    }
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {trans("payment:payment_order.money_calculator_modal.not_get_remain_money")}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`${Styles["group-button"]} ${Styles["submit-checkout"]}`}
            >
              <Button type="s3" onClick={() => this.props.close()}>{trans("tableManagament.back")}</Button>
              <button className={`${Styles["button"]}`} type="button" onClick={this.confirmFinalPayment}>
                {trans(
                  "payment:payment_order.money_calculator_modal.submit_button"
                )}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[PaymentReducerName],
    ...state[name]
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    paymentActions: bindActionCreators({ ...paymentActions }, dispatch),
    settingPrintActions: bindActionCreators({ ...settingPrintActions }, dispatch)
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(MoneyCalculationModal));
