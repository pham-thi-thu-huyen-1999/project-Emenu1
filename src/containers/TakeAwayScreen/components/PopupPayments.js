import React, { Component } from "react";
import PopupDetailBill from "./PopupDetailBill";
import { Dialog, Input, CheckBox, Button, CleaveInput } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "./../../../utils/sweetalert2";
import { faPrint, faBackspace } from "@fortawesome/free-solid-svg-icons";
import "./PopupPayments.scss"
import * as action from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { name } from "../reducers";
import "./PaymentManagement.scss";
import { toUpper } from "lodash";
import utilsFormat from "../../../utils/formats";
import { get } from "../../../services/localStorage";
import { getPrinterBillList } from "./../../../api/printerBill";
import common from "./../../../utils/common";
import ReactToPrint from 'react-to-print';
import Validator from "../../../utils/validator";
import * as apiOrder from "../../../api/order";
import {
  addNofitication
} from '../../../api/notification';
var infoToken = common.decodeToken(get('accessToken'));
class PopupPayments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerMoney: 0,
      isChecked: false,
      showPopupDetail: false,
      inputMoney: "",
      remainMoney: 0,
      pageStyleFromApi: {},
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
      errors: {},
      printerBillList: [],
      pageStyleFromApi: {
        left_margin: 0,
        right_margin: 0,
        top_margin: 0,
        bottom_margin: 0,
        num_of_copies: 0,
        paper_size: 0,
        connect_type: 0,
        is_show_partner: true,
        is_show_date: true,
        is_show_checkin: true,
        is_show_checkout: true,
        is_show_service_staff: true,
        is_show_cashier: true,
        is_show_table: true,
        is_show_bill_no: true,
      },
      isShowPopupChoosePrinter: false
    };
    const rules = [
      {
        field: "inputMoney",
        method: data => {
          if (data > 0) {
            if (data < this.props.totalBill) {
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

  onClickMoney = (money) => {
    const { customerMoney } = this.state;
    this.setState({ customerMoney: customerMoney + money });
  };


  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("takeaway.swalReceiveMoneyCustomerSuccess"),
      title: t("takeaway.noti")
    })
    this.props.close();
  }

  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: t("takeaway.swalReceiveMoneyCustomerFail"),
    })
  }

  componentDidMount = async () => {
    const data = await getPrinterBillList();
    const printerBillList = [...data.data.data];
    await this.setState({
      printerBillList: printerBillList
    })
    //await this.GetDataPageStyles();
    /* const { orderId } = this.props;
    if (orderId) {
      this.props.paymentActions.getOrderDetail({ order_id: orderId });
    }
    this.props.paymentActions.getInfoPartner();
    this.props.settingPrintActions.getPrinterBillList(); */
  }

  componentDidUpdate(prevProps, prevStates) {
    const { isCustomerGetRemainMoney, inputMoney } = prevStates;
    const { totalBill } = prevProps;
    if (isCustomerGetRemainMoney !== this.state.isCustomerGetRemainMoney) {
      this.calculateRemainMoney(inputMoney, totalBill)
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
      this.calculateRemainMoney(this.state.inputMoney, this.props.totalBill)
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
          className={`numpad-button ${numpadItem === "backspace" ? "backspace" : ""
            } ${numpadItem === "clear" ? "clear" : ""} ${numpadItem === "calc" ? "calc" : ""} `}

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
          className="default-money-button"
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
    if (parseFloat(Math.ceil(postTotal)) === parseFloat(inputMoney))
    {
      remainMoney = 0;
    }
    this.setState({ inputMoney: inputMoney, remainMoney: remainMoney });
  };

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  GetDataPageStyles = (item) => {
    const { printerBillList } = this.state;
    let pageStyleFromApiTemp = {};
    if (printerBillList && printerBillList.length > 0) {
      for (let i = 0; i < printerBillList.length; i++) {
        if (printerBillList[i].printer_bills && printerBillList[i].printer_bills.length > 0) {
          if ("0f263907-511f-4138-beda-63f57f59592e" === printerBillList[i].area_id) {
            for (let j = 0; j < printerBillList[i].printer_bills.length; j++) {
              if (item.id === printerBillList[i].printer_bills[j].id) {
                pageStyleFromApiTemp = printerBillList[i].printer_bills[j];
              }
            }
          }
        }
      }
    }
    this.setState({
      pageStyleFromApi: pageStyleFromApiTemp
    })
  }
  /**
   * Confirm final payment
   */
  onShowPopupChoosePrinter = () => {
    this.setState({
      isShowPopupChoosePrinter: true
    })
  }

  showAlertPaymentSuccess = () => {
    const { inputMoney, pageStyleFromApi } = this.state;
    const { surchange, totalBill, t } = this.props;
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
    Swal.fire({
      icon: 'success',
      customClass: {
        confirmButton: 'print_order_table',
      },
      title: t("payment:payment_order.notiPaymentSuccess"),
      showConfirmButton: true,
      confirmButtonText: <Button className="e-m-left-10 e-m-right-10" onClick={this.onShowPopupChoosePrinter.bind(this)}>
        <FontAwesomeIcon icon={faPrint} /> {this.props.t("table_list:print_order_table")}
      </Button>,
    })
  }

  confirmFinalPayment = async () => {
    const { customerMoney, printerBillList, orderDetail, inputMoney, pageStyleFromApi } = this.state;
    const { dishList, voucher_code, surchange, totalBill, order_id, close, changePage, t, infoPartner } = this.props;
    //const res = await apiOrder.getOrderItemById({ id: order_id});
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        icon: "warning",
        title: this.props.t("payment:payment_order.modal_swal.accept"),
        text: this.props.t(
          "payment:payment_order.payment_confirmation.confirm_checkout"
        ),
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: this.props.t("table_list:modal_swal.ok"),
        cancelButtonText: this.props.t("table_list:modal_swal.cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            /* let bill_items = res.data.data.order_items.map((dish) => {
              return {
                item_id: dish.id,
                qty: dish.qty,
                note: dish.note ? dish.note : "",
                is_takeaway: dish.is_takeaway ? dish.is_takeaway : false,
                order_item_id: dish.id,
                order_addon_items: dish.order_addon_items ? dish.order_addon_items : []
              }
            }); */
            let data = {
              order: {
                surcharge_value: parseInt(surchange),
                voucher_code: voucher_code && voucher_code !== undefined ? voucher_code : "",
                money_received: this.state.inputMoney ? parseInt(this.state.inputMoney) : 0,
                /* payment_method_id: 0, */
                is_change: this.state.isCustomerGetRemainMoney
              },
              order_items: []
            };
            await this.props.actions.paymentOrder({ id: order_id, data, call_back_success: this.showAlertPaymentSuccess });
            /* const dataPushNoti = {
              "title": "Thanh toán",
              "content": `Hóa đơn mang về vừa thực hiện thanh toán order`,
              "action": "finished_payment",
              "type_notification": "1",
              "link": "",
              "body_data": {
                "table_id": "",
                "order_id": order_id ? order_id : "",
                action: "finished_payment"
              },
              "topic": `area_${orderDetail.table.area.id}`,
              "list_user": [
                ""
              ],
              "is_push_noti": "1"
            }
            await addNofitication({data: dataPushNoti}); */
            changePage();
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: t("payment:payment_order.notiPaymentFail"),
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
    const { show, close, totalBill, order_no, unit_price, t, surchange } = this.props;
    const { customerMoney, isChecked, showPopupDetail, inputMoney, remainMoney, errors, printerBillList,
      pageStyleFromApi
    } = this.state;

    const PAYMENT_METHODS = [
      "CASH",
      "ATM",
      "MOMO",
      "ZALOPAY",
      "VNPAY"
    ];

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

    let check = false; //Check khong co may in

    let selectedPaymentMethod = "";

    let text = "";
    if (inputMoney > 0) {
      if (inputMoney < totalBill) {
        /* postTotal */
        text = "vui lòng nhập số tiền thanh toán hợp lệ";
      } else {
        text = "";
      }
    } else {
      text = "vui lòng nhập số tiền thanh toán";
    }

    return (
      <div className="e-main-content">
        <div
          className="popup mfp-container mfp-s-ready mfp-inline-holder modal-container"
        >
          <div
            className="mfp-content modal-wrapper"
            style={{ width: "930px", height: "auto" }}
          >
            <div
              className="button-close"
              onClick={() => close()}
            ></div>
            <div className="modal-header-title">
              <span>
                {toUpper(
                  t("payment:payment_order.money_calculator_modal.title")
                )}
              </span>
            </div>
            <div
              className="modal-content-wrapper money-calculator"
            >
              <div className="numpad">
                <div className="input-wrapper">
                  <CleaveInput
                    setValue={(value) =>
                      this.calculateRemainMoney(value, totalBill ? totalBill : 0) /* postTotal ? 0 : */
                    }
                    className="numpad-input"
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand",
                    }}
                    value={inputMoney ? inputMoney : "0"}
                  />
                  {errors.inputMoney ? (
                    <div className="validation"
                      style={{ color: "red" }}>
                      {text}
                    </div>
                  ) : ""}
                </div>
                <div className="numpad-wrapper">
                  {this.renderNumpad()}
                </div>
                <div className="default-money-wrapper">
                  <div className="title">
                    {toUpper(
                      t(
                        "payment:payment_order.money_calculator_modal.default_money_title"
                      )
                    )}
                  </div>
                  {this.renderDefaultMoney()}
                </div>
              </div>
              <div className="money-calculated-info">
                <div className="info-item">
                  <span>
                    {t("payment:payment_order.payment_method.title")}
                  </span>
                  <span>
                    {t(
                      `payment:payment_order.payment_methods.${selectedPaymentMethod
                        ? selectedPaymentMethod
                        : PAYMENT_METHODS[0]
                      }`
                    )}
                  </span>
                </div>
                <div
                  className="info-item remain-money"
                >
                  <span>{t("payment:payment_order.money_calculator_modal.total")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(totalBill))} ${unit_price}`}</span> {/* postTotal ? 0 : */}
                </div>
                <div className="info-item">
                  <span>{t("payment:payment_order.money_calculator_modal.input_money")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(inputMoney))} ${unit_price}`}</span>
                </div>
                <div className="info-item">
                  <span>{t("payment:payment_order.money_calculator_modal.remain_money")}</span>
                  <span>{`${utilsFormat.moneyFormat(Math.ceil(remainMoney === 0 ? remainMoney : remainMoney - 1))} ${unit_price}`}</span>{/*  remainMoney */}
                </div>
                <div
                  className="info-item get-remain-money"
                >
                  <CheckBox
                    checked={this.state.isCustomerGetRemainMoney}
                    onChange={(value) =>
                      this.setState({ isCustomerGetRemainMoney: value })
                    }
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {t("payment:payment_order.money_calculator_modal.not_get_remain_money")}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="group-button submit-checkout"
            >
              <Button type="s3" onClick={() => this.props.close()}>{t("tableManagament.back")}</Button>
              <button className="button" type="button" onClick={this.confirmFinalPayment}>  {/* this.confirmFinalPayment */}
                {t(
                  "payment:payment_order.money_calculator_modal.submit_button"
                )}
              </button>
              {/* <Button onClick={this.showAlert}>{t("takeaway.pay")}</Button> */}
            </div>
          </div>
        </div>
        <Dialog
          innerClass="max-width-payment-order"
          show={this.state.isShowPopupChoosePrinter}
          close={() => { this.setState({ isShowPopupChoosePrinter: false }); this.props.close() }}
        >
          <h2
            className="main-lbl text-center title-heading"
          >
            Danh sách máy in
            </h2>
          <div className="content">
            {printerBillList && printerBillList.length > 0 ? printerBillList.map((print, index) => {
              if (print.printer_bills && print.printer_bills.length > 0) {
                if ("0f263907-511f-4138-beda-63f57f59592e" === print.area_id) {
                  check = true;
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
                        /* content={() => this.componentRef} */
                        content={() => this.child}
                        pageStyle={pageStyle}
                        onBeforeGetContent={() => { this.GetDataPageStyles(item) }}
                      />
                      {/* show={showPopupDetail}
                       close={() => this.setState({ showPopupDetail: false })} */}
                      <PopupDetailBill
                        totalBill={totalBill}
                        surcharge_no_pay={surchange}
                        voucher_code={this.props.voucher_code}
                        order_no={this.props.billInfo && this.props.billInfo.order_no ? this.props.billInfo.order_no : ""}
                        received_no_pay={inputMoney}
                        dishList={this.props.dishList}
                        billInfo={this.props.billInfo}
                        childRef={ref => (this.child = ref)}
                        pageStyleFromApi={pageStyleFromApi}
                        unit_price={this.props.unit_price}
                        orderItemByIdConfirm={this.props.orderItemById}
                        isCheckPayment={true}
                        {...this.props}
                      />
                    </div>);
                  })
                }
              }
              if (index === printerBillList.length - 1 && check === false) {
                return <div key={index} className="text-center" style={{ color: "red", fontSize: 18 }}>Chưa có máy in nào được thiết lập cho khu vực của nhân viên này.</div>
              }
            }) : <div className="text-center" style={{ color: "red", fontSize: 18, margin: "auto" }}>Chưa có máy in nào được thiết lập cho khu vực của nhân viên này.</div>}
          </div>
        </Dialog>
        {/* {showPopupDetail ? <PopupDetailBill
          totalBill={totalBill}
          surcharge_no_pay={this.props.surchange}
          voucher_code={this.props.voucher_code}
          order_no={order_no}
          show={showPopupDetail}
          received_no_pay={customerMoney}
          close={() => this.setState({ showPopupDetail: false })}
          dishList={this.props.dishList}
          billInfo={this.props.billInfo}
        /> : null} */}
        {/* <div className="PopupPayments">
        <Dialog show={show} close={close} innerClass="popup-payment-takeaway">
          <h2 className="main-lbl text-center">{t("takeaway.payment")}</h2>
          <aside className="e-m-top-35">
            <div className="e-row e-col-12">
              <div className="input-payment e-col-5 e-row">
                <Input
                  placeholder={t("takeaway.inputMoneyCustomer")}
                  className="e-m-bottom-10"
                  value={customerMoney}
                  type="number"
                  onChange={(e) => this.setState({ customerMoney: e.target.value ? e.target.value : null })}
                />
                {t("takeaway.enterMoney")}
                <div className="e-row">
                  <div className="money" onClick={() => this.onClickMoney(500000)}>
                    500.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(200000)}>
                    200.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(100000)}>
                    100.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(50000)}>
                    50.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(20000)}>
                    20.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(10000)}>
                    10.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(5000)}>
                    5.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(2000)}>
                    2.000
                        </div>
                  <div className="money" onClick={() => this.onClickMoney(1000)}>
                    1.000
                        </div>
                </div>
              </div>

              <div className="flex money-meta e-col-7">
                <div className="flex-view">
                  <span>{t("takeaway.payMoney")}: </span>
                  <span className="money-number">
                    {totalBill.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                đ
              </span>
                </div>
                <div className="flex-view">
                  <span>{t("takeaway.customerPay")}: </span>
                  <span className="money-number">
                    {customerMoney ? customerMoney
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : 0}{" "}
                đ
              </span>
                </div>
                <div className="flex-view">
                  <span>{t("takeaway.leftMoney")}: </span>
                  <span className="money-number">
                    {isChecked === true ? 0 : (customerMoney - totalBill < 0
                      ? 0
                      : (customerMoney - totalBill)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))}{" "}
                đ
              </span>
                </div>
                <div className="flex-view">
                  <CheckBox
                    label={t("takeaway.not_take_left_money_customer")}
                    name="1"
                    checked={false}
                    onChange={() => this.setState({
                      isChecked: true
                    })}
                  />
                  <span className="money-number">
                    {isChecked === false ? 0 : (customerMoney - totalBill < 0
                      ? 0
                      : (customerMoney - totalBill)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))}{" "}
                    đ
                </span>
                </div>
              </div>
            </div>
          </aside>
          <aside className="acts text-right">
            <Button className="e-m-right-10" onClick={close}>
              {t("takeaway.back")}
            </Button>
            <Button className="e-m-right-10"
              onClick={() => this.setState({ showPopupDetail: true, isChecked: false })}
            >
              <FontAwesomeIcon icon={faPrint} />  {t("takeaway.printInvoice")}
            </Button>
            <Button onClick={this.showAlert}>{t("takeaway.pay")}</Button>
          </aside>
        </Dialog>
        <PopupDetailBill
          totalBill={totalBill}
          surcharge_no_pay={this.props.surchange}
          voucher_code={this.props.voucher_code}
          order_no={order_no}
          show={showPopupDetail}
          received_no_pay={customerMoney}
          close={() => this.setState({ showPopupDetail: false })}
          dishList={this.props.dishList}
          billInfo={this.props.billInfo}
        />

      </div> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(PopupPayments));
