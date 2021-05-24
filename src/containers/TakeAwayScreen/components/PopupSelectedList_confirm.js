import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import TableData from '../../../components/common/TableData';
import "./Category.scss";
import * as action from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { name } from "../reducers";
import { Dialog, Button, TextArea, Input, CheckBox, CleaveInput, Loading } from "../../../components/common";
import { PopupPaymentMethods } from ".";
import Swal from "../../../utils/sweetalert2";
import { get } from "../../../services/localStorage";
import formats from "../../../utils/formats";
import PopupDetailBill from "./PopupDetailBill";
import { getPrinterBillList } from "./../../../api/printerBill";
import ReactToPrint from 'react-to-print';
import common from "./../../../utils/common";
import _ from "lodash";
var infoToken = common.decodeToken(get('accessToken'));

class PopupSelectedList_confirm extends React.Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      indexSlide: 0,
      showPopupConfirm: false,
      showPopupPaymentMethods: false,
      showAddNote: false,
      surcharge: 0,
      dishSelected: {},
      newNote: "",
      voucherCode: "",
      typing: false,
      typingTimeout: 0,
      checkButtonVoucher: false,
      is_table: get("is_table"),
      isShowPopupChoosePrinter: false,
      isLoading: true,
      TABLE_SETTING: {
        heads: [
          {
            text: t("takeaway.number"),
            width: "5%"
          },
          {
            text: t("takeaway.takeaway"),
            width: "12%"
          },
          {
            text: t("takeaway.nameFood"),
            width: "25%"
          },
          {
            text: t("takeaway.note"),
            width: "20%"
          },
          {
            text: t("takeaway.quantity"),
            width: "15%"
          },
          {
            text: t("takeaway.price"),
            width: "10%"
          },
          {
            text: t("takeaway.priced"),
            width: "15%"
          },
        ],
        columns: [
          {
            key: "id",
            width: "5%",
            render: (item, index) => {
              return index + 1;
            },
          },
          {
            key: "takeaway",
            width: "12%",
            render: (item, i) => (
              <>
                <CheckBox className="cursor-default-takeaway-bill" onChange={() => { }} disabled={true} key={i} checked={this.props.dishList[i].is_takeaway}>  </CheckBox>
              </>
            ),
          },
          {
            key: "name",
            width: "25%",
            render: (item, i) => (
              <>
                {item.item_name ? item.item_name : item.name}
              </>)
          },
          {
            key: "note",
            width: "20%",
          },
          {
            key: "qty",
            width: "15%",
          },
          {
            key: "price",
            width: "10%",
            render: (item, index) => {
              return <>{formats.moneyFormat(item.price)}{this.props.unit_price}</>
            },
          },
          {
            key: "total",
            width: "15%",
            render: (item, i) => (
              <>
                {formats.moneyFormat(item.qty * item.price)}{this.props.unit_price}
              </>)
          },
        ],
      },
      showPopupDetail: false,
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
      printerBillList: [],
      orderItemById_children: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderItemById_children !== prevState.orderItemById_children) {
      return { orderItemById_children: nextProps.orderItemById_children };
    } else return null;
  }

  onChangeVoucher = (e) => {
    const self = this;
    const orderId = this.props.takeawayBill === true ? this.props.orderId_children : this.props.orderId;
    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      voucherCode: e.target.value,
      typing: false,
      typingTimeout: setTimeout(function () {
        self.props.actions.getCheckVoucher({ order_id: orderId, voucher_code: self.state.voucherCode })
      }, 100)
    });
  }

  componentDidMount = async () => {
    const { t } = this.props;
    const data = await getPrinterBillList();
    const printerBillList = [/* ...data.data.data */];
    this.setState({
      printerBillList: printerBillList
    })
    this.props.actions.getPartnerSetting();
    if (this.state.is_table === false) {
      this.setState({
        TABLE_SETTING: {
          heads: [
            {
              text: t("takeaway.number"),
              width: "7%"
            },
            {
              text: t("takeaway.nameFood"),
              width: "27%"
            },
            {
              text: t("takeaway.note"),
              width: "22%"
            },
            {
              text: t("takeaway.quantity"),
              width: "17%"
            },
            {
              text: t("takeaway.price"),
              width: "12%"
            },
            {
              text: t("takeaway.priced"),
              width: "17%"
            },
          ],
          columns: [
            {
              key: "id",
              width: "7%",
              render: (item, index) => {
                return index + 1;
              },
            },
            {
              key: "name",
              width: "27%",
              render: (item, index) => {
                return !item.item_name ? item.name : item.item_name;
              },
            },
            {
              key: "note",
              width: "22%",
            },
            {
              key: "qty",
              width: "17%",
            },
            {
              key: "price",
              width: "12%",
              render: (item, index) => {
                return item.price.toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
              },
            },
            {
              key: "total",
              width: "17%",
              render: (item, i) => (
                <>
                  {formats.moneyFormat(item.qty * item.price)}
                </>)
            },
          ],
        }
      })
    }
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 2000)
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

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }


  render() {
    const {
      totalPrice,
      show,
      close,
      showPopupPayments,
      dishList,
      t,
      voucher,
      billInfo,
      partnerSetting,
      lng,
      unit_price
    } = this.props;
    const {
      surcharge,
      showPopupPaymentMethods,
      voucherCode,
      isShowPopupChoosePrinter,
      showPopupDetail,
      pageStyleFromApi,
      printerBillList
    } = this.state;

    const orderItemById = (this.props.takeawayBill === true ? this.state.orderItemById_children : this.props.orderItemById);

    var total_money = orderItemById ? orderItemById.sub_total : totalPrice;

    var money = orderItemById ? orderItemById.sub_total : total_money;

    let vat_surcharge = 0;

    //surchagre
    if (orderItemById && orderItemById.vat_per !== 0) {
      if (orderItemById.is_vat_surcharge === true) {
        vat_surcharge = parseFloat(surcharge) * (orderItemById.vat_per / 100);
        money = total_money;
      } else {
        money = total_money;
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
    if (voucher && voucher.code && voucher.total_value) {
      if (voucherCode === (voucher ? voucher.code : null)) {
        if (voucher.type == 1) //Giam theo %
        {
          voucher_price = total_money * (voucher.total_value / 100);
          money -= total_money * (voucher.total_value / 100);
        } else {
          voucher_price = voucher.total_value;
          money -= voucher.total_value;
        }
      }
    }

    //vat
    let vat_bill = total_money * (orderItemById.vat_per / 100) + (vat_surcharge ? vat_surcharge : 0);
    money += total_money * (orderItemById.vat_per / 100) + (vat_surcharge ? vat_surcharge : 0) + parseFloat(surcharge);


    let customerMoney = 0;

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

    return (
      <Dialog show={show} close={close} innerClass="PopupSelectedList">
        <Loading show={this.state.isLoading} />
        <h3 className="sec-tit text-center">{t("takeaway.orderListed")}</h3>
        <div style={{ height: "calc(100% - 340px)" }}>
          <TableData
            option={this.state.TABLE_SETTING}
            dataSources={this.props.dishList}
            className="dish-takeaway-list">

          </TableData>
        </div>
        <aside className="flex-view e-m-top-20">
          <div className="customer-info" style={{ height: 180 }}>
            <h4 className=" text-center">{t("takeaway.infoCustomer")}</h4>
            <Input
              className="e-m-bottom-10"
              type="text"
              style={{ backgroundColor: "white" }}
              defaultValue={this.props.customerName ? this.props.customerName : "Chưa có thông tin về họ tên."}
              disabled={true}
              onChange={() => { }}
            />
            <Input
              defaultValue={this.props.customerPhoneNumber ? this.props.customerPhoneNumber : "Chưa có thông tin về số điện thoại."}
              disabled={true}
              type="text"
              onChange={() => { }}
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="info-bill-confirm">
            <div
              className="flex-view"
              style={{ fontSize: 16, textAlign: "right" }}
            >
              <div>
                <div className="e-m-top-10">{t("takeaway.total")}</div>
                <div style={{ marginTop: 14, marginRight: 35 }}>{t("takeaway.surchange")}</div>
                <div className="e-m-top-15" style={{ color: "#2699fb", marginRight: 4 }}>
                  {t("takeaway.discount")}
                </div>
              </div>
              <div className="e-m-left-10" style={{ color: "#f27922" }}>
                <div className="e-m-top-10 e-m-bottom-10">
                  {orderItemById && orderItemById.sub_total && formats.moneyFormat(Math.ceil(orderItemById.sub_total))}
                  {" "}{unit_price}
                </div>
                <div className="flex-view e-m-top-10 e-m-bottom-10">
                  <CleaveInput
                    value={surcharge}
                    setValue={(value) => this.setState({ surcharge: (value ? value : 0) })}
                    className="add-fee-take-away"
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand",
                    }}
                  />
                  <span className="e-m-top-5"> {unit_price}</span>
                </div>
                <div className="e-m-top-10 e-m-bottom-10">
                  <div>
                    {orderItemById
                      ? !_.isEmpty(orderItemById.discount_bill_per) && orderItemById.discount_bill_per > 0
                        ? `-${discount_bill}%(${t(
                          "payment:payment_order.money_info.bill_promotion"
                        )})(-${orderItemById.discount_bill_per}%)`
                        : orderItemById.discount_bill_value > 0
                          ? `-${formats.moneyFormat(Math.ceil(orderItemById.discount_bill_value))} ${unit_price}(${t(
                            "payment:payment_order.money_info.bill_promotion"
                          )})` : `0 ${unit_price}`
                      : ""}
                  </div>
                  <div className="e-m-top-5">
                    {orderItemById ?
                      (orderItemById.discount_drink_value > 0 ?
                        <div className="order-price-item">
                          <span className="discount">&nbsp;</span>
                          <span>
                            -{formats.moneyFormat(Math.ceil(orderItemById.discount_drink_value))} {unit_price}({t(
                            "payment:payment_order.money_info.drink_promotion"
                          )})
                        </span>
                        </div> : "") : ""
                    }
                  </div>
                  <div className="e-m-top-5">
                    {orderItemById ?
                      (orderItemById.discount_food_value > 0 ?
                        <div className="order-price-item">
                          <span className="discount">&nbsp;</span>
                          <span>
                            -{formats.moneyFormat(Math.ceil(orderItemById.discount_food_value))} {unit_price}({t(
                            "payment:payment_order.money_info.food_promotion"
                          )})
                        </span>
                        </div> : "") : ""
                    }
                  </div>
                </div>
                <div className="flex-view e-m-top-10 e-m-bottom-10">
                  <Input className="input-voucher-takeaway" onChange={(e) => this.onChangeVoucher(e)} placeholder="Nhập mã giảm giá..." />
                  {this.state.voucherCode !== (this.props.voucher ? this.props.voucher.code : null) || this.state.voucherCode === ""
                    ?
                    <div className="btn-check">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    :
                    <div className="btn-close-voucher" onClick={() => this.setState({ voucherCode: "" })}>
                      <FontAwesomeIcon icon={faWindowClose} />
                    </div>}
                </div>
                {this.state.voucherCode !== (this.props.voucher ? this.props.voucher.code : "")
                  ?
                  this.state.voucherCode !== "" ? <div className="text-noti-error e-m-top-10 e-m-bottom-10">{this.props.errorMessageCheckVoucher}</div> : null
                  : null
                }

                {this.props.voucher && this.props.voucher.code === this.state.voucherCode ? <div className="e-m-top-10 e-m-bottom-10">
                  Mã voucher: {this.props.voucher.code}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  -{formats.moneyFormat(Math.ceil(voucher_price))} {unit_price}</div> : null}
              </div>
            </div>

            <div className="vat-total">
              <div className="flex-view">
                <div className="">{t("takeaway.vat")}({orderItemById ? (orderItemById.vat_per ? orderItemById.vat_per : 0) : 0}%)</div>
                <div className="color-text">{vat_bill ? formats.moneyFormat(Math.ceil(vat_bill)) : 0} {unit_price}</div>
              </div>
              <div className="flex-view e-m-top-5">
                <div>{t("requestPayment.intoMoney")}</div>
                <div className="color-text">
                  <b>
                    {formats.moneyFormat(Math.ceil(money))}
                    {" "}{unit_price}
                  </b>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <aside className="text-center">
          <div>
            <Button
              className="e-m-right-10"
              type="s3"
              onClick={close}
            >
              {t("payment:payment_order.cancel")}
            </Button>
            <Button className="e-m-right-10" style={{ width: "120px" }} onClick={() => { this.setState({ isShowPopupChoosePrinter: true }) }}>
              {t("payment:payment_order.export_temp_bill")}
            </Button>
            <Button
              onClick={() => {
                showPopupPayments(
                  money, orderItemById ? orderItemById.id : "", surcharge, voucherCode, billInfo ? billInfo : []
                );
                close();
              }
              /* this.setState({ showPopupPaymentMethods: true }) */}
            >
              {t("payment:payment_order.confirm")}
            </Button>
          </div>
        </aside>

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
                        totalBill={this.props.total_money}
                        surcharge_no_pay={this.state.surcharge}
                        voucher_code={this.props.voucher}
                        order_no={this.props.billInfo && this.props.billInfo.order_no ? this.props.billInfo.order_no : ""}
                        received_no_pay={customerMoney}
                        dishList={this.props.dishList}
                        billInfo={this.props.billInfo}
                        /* ref={el => (this.componentRef = el)} */
                        childRef={ref => (this.child = ref)}
                        pageStyleFromApi={pageStyleFromApi}
                        unit_price={this.props.unit_price}
                        orderItemByIdConfirm={orderItemById}
                        billInfoById={this.props.billInfoById}
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

        {/* Math.floor((10 / 100 + 1) * total_money + parseInt(surcharge)) */}
        <PopupPaymentMethods
          t={t}
          close={() => this.setState({ showPopupPaymentMethods: false })}
          show={showPopupPaymentMethods}
          showPopupPayments={() => {
            showPopupPayments(
              money, orderItemById ? orderItemById.id : "", surcharge, voucherCode, billInfo ? billInfo : []
            );
            close();
          }}
        />
      </Dialog>
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
)(withNamespaces()(PopupSelectedList_confirm));
