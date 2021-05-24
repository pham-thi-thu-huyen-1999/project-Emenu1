import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faMoneyBillAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import { Button, Dialog } from "../../../components/common";
import Swal from "./../../../utils/sweetalert2";
//import PopupDetailBill from "./PopupDetailBill";
import PopupSelectedList_confirm from "./PopupSelectedList_confirm";
import * as action from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { name } from "../reducers";
import PopupDetailBill from "./PopupDetailBill";
import { getPrinterBillList } from "./../../../api/printerBill";
import ReactToPrint from 'react-to-print';
import formats from "../../../utils/formats";
import notFound from './../img/no-data.png';
import "../TakeAwayScreen.scss";
import CompPopupCancel from "./CompPopupCancel.js";
import CompPopupCancelPayment from "./CompPopupCancelPayment.js";

class TakeawayBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSlide: 0,
      showPopupConfirm: false,
      showPopupDelivery: false,
      showPopupPaymentMethods: false,
      showPopupDetailBill: false,
      showPopupSelectedList_confirm: false,
      billInfoById: this.props.billInfoById ? this.props.billInfoById : {},
      isChecked: true,
      printerBillList: [],
      isShowPopupChoosePrinter: false,
      pageStyleFromApi: {},
      showPopupCancelOrder: false,
      showPopupCancelPayment: false
    };
  }
  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("takeaway.swalDeliverySuccess"),
      title: t("takeaway.noti")
    })
    this.setState({ showPopupDelivery: false });
  }

  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: t("takeaway.swalDeliveryFail"),
    })
    this.setState({ showPopupDelivery: false });
  }

  showAlert = () => {
    const { billInfo, t } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("takeaway.swalDelivery"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.value) {
        this.props.actions.deliveryConfirm({ id: billInfo.id });
        this.props.changePage();
      }
    })
  }

  showOk_delete = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("takeaway.swalDeleteSuccess"),
      title: t("takeaway.noti")
    })
    this.setState({ showPopupDelivery: false });
  }

  showErr_delete = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: t("takeaway.swalDeleteFail"),
    })
    this.setState({ showPopupDelivery: false });
  }

  showOk_restore = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: 'Khôi phục order thành công!',
      title: t("takeaway.noti")
    })
    this.setState({ showPopupDelivery: false });
  }

  showErr_restore = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      text: "Khôi phục order thất bại!",
      title: t("takeaway.noti"),
    })
    this.setState({ showPopupDelivery: false });
  }

  onRestoreOrder = () => {
    const { t, billInfo } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: "Bạn chắc chắn muốn khôi phục order này?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.value) {
        this.props.actions.rollbackOrder({order_id: billInfo.id});
      }
    })
  }

  showAlert_delete = () => {
    /* const { t, billInfo } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("takeaway.swalDelete"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.value) {
        if (billInfo.order_status_id !== 2) {
          const data = { order_id: this.props.billInfo.id, reason: "" };
          this.props.actions.deleteOrder({ data });
          this.props.changePage();
        } else {
          this.showErr_delete();
        }
      }
    }) */
    this.setState({
      showPopupCancelOrder: true
    })
  }

  showAlert_delete_paymented = async() => {
    await this.props.actions.getBillInfoById({ order_no: this.props.billInfo.order_no });
    this.setState({
      showPopupCancelPayment: true
    })
  }

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  onCancelOrder = () => {
    const data = { order_id: this.props.billInfo.id, reason: "" };
    this.props.actions.deleteOrder({ data });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(prevState.billInfoById) !== JSON.stringify(nextProps.billInfoById)) {
      return { billInfoById: nextProps.billInfoById };
    } else return null;
  }

  GetDetailBillById = async () => {
    await this.props.actions.getBillInfoById({ order_no: this.props.billInfo.order_no });
    await this.setState({ isShowPopupChoosePrinter: true })
  }

  onClickButtonPayment = () => {
    const { billInfo } = this.props;
    this.props.actions.getOrderItemById({ id: billInfo.id });
    this.setState({
      showPopupSelectedList_confirm: true
    });
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

  componentDidMount = async () => {
    const data = await getPrinterBillList();
    const printerBillList = [...data.data.data];
    await this.setState({
      printerBillList: printerBillList
    })
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { t, className, billInfo, showPopupPayments, close, unit_price } = this.props;
    const { showPopupSelectedList_confirm, indexSlide, pageStyleFromApi, printerBillList, billInfoById } = this.state;
    const settings = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      vertical: true,
      draggable: true,
      arrows: false,
      afterChange: (current) => this.setState({ indexSlide: current }),
    };
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
      <div className="bill-col-lg-4 bill-col-md-4 bill-col-sm-12">
        <div className={`${className ? className : ""} takeaway-bill-bill`}>
          <div className="bill-header">
            <h5 className="text-center">
              <span>{t("takeaway.codeInvoice")}: {billInfo && billInfo.order_no}</span></h5>
            <div className="flex-view">
              <div>
                <div>{billInfo && billInfo.customer_name}</div>
                <div>{billInfo && billInfo.customer_tel}</div>
              </div>
              <div className="text-right">
                <div>{t("takeaway.countFood")}: {billInfo && billInfo.order_items.length} </div>
                <div>{t("takeaway.total")}: {billInfo && formats.moneyFormat(billInfo.total_money)} {unit_price}</div>
              </div>
            </div>
          </div>
          <div className="bill-content">
            {billInfo && billInfo.order_status && billInfo.order_status.id === 2 || billInfo.order_status.id === 32 ?
              <h2 className="paid">{t("takeaway.paymented")}</h2> : null}
            <ul className="head">
              <li className="name">{t("takeaway.nameFood")}</li>
              <li className="qty">{t("takeaway.quantity")}</li>
              <li className="price">{t("takeaway.price")}</li>
              <li className="total">{t("takeaway.priced")}</li>
            </ul>
            {billInfo && billInfo.order_items && billInfo.order_items.length > 4 ?
              <div className="btn-scroll">{billInfo && billInfo.order_items && billInfo.order_items.length > 4 ? (
                <button
                  className={`slick-arrow slick-prev arrow-up
                   ${indexSlide === 0 ? "slick-disabled" : ""
                    }`}
                  onClick={() => this.slider.slickPrev()}
                ></button>
              ) : null}
                {billInfo && billInfo.order_items && billInfo.order_items.length > 4 ? (
                  <button
                    className={`slick-arrow slick-next arrow-down
                  ${billInfo && indexSlide >= billInfo.order_items.length - 4
                        ? "slick-disabled"
                        : null
                      }`}
                    onClick={() => this.slider.slickNext()}
                  ></button>
                ) : null}
              </div> : ""}
            <Slider ref={(c) => (this.slider = c)} {...settings}
              className="list-food">
              {billInfo && billInfo.order_items ? billInfo.order_items.map((dish, i) => (
                <ul className="row-its" key={i} style={{ fontSize: "smaller" }}>
                  <li className="name">
                    {dish.item_name}
                  </li>
                  <li className="qty">{dish.qty}</li>
                  <li className="price">{formats.moneyFormat(dish.price)}{unit_price}</li>
                  <li className="total">{formats.moneyFormat(dish.qty * dish.price)}{unit_price}</li>
                </ul>
              )) : null}
            </Slider>
          </div>
          <div className="bill-footer">
            {billInfo && billInfo.is_delivery_completed === true ?
            <div className="text-center cancel-order-takeaway-wrap">
              <span className="cancel-order-takeaway-content">
                      ĐÃ GIAO HÀNG
              </span>
            </div> : (billInfo && billInfo.order_status && billInfo.order_status.id === 2 ?
              <div className="text-center e-m-left-5">
                <div className="btn">
                  <Button
                    className="s2 e-flex item-center button-tool"
                    onClick={this.showAlert_delete_paymented}
                  >
                    <span className="e-m-right-5 e-flex item-center">
                      <div style={{ backgroundImage: `url('${require("../../../images/ic_cancel.svg")}')` }} className="img-icon"></div>
                    </span>
                    <span className="btn-name btn-name-size">{t("takeaway.cancel")}</span>
                  </Button>
                </div>
                <div className="btn">
                  <Button
                    onClick={this.showAlert}
                    className="btn-delivery" type="s4" style={{ zIndex: 1 }}
                  >
                    <span className="e-m-right-5 e-flex item-center">
                      {/* <img src={require("../../../images/Giao-hang.png")} alt="" /> */}
                      <div style={{ backgroundImage: `url('${require("../../../images/Giao-hang.png")}')` }} className="img-icon-delivery"></div>
                    </span>
                    <span className="btn-name btn-name-size">{t("takeaway.delivery")}</span>
                  </Button>
                </div>
                <div className="btn btn-print-invoice">
                  <Button className="s5 btn-printInvoice"
                    onClick={this.GetDetailBillById}>
                    <span className="e-m-right-5 e-flex item-center">
                      {/* <img src={require("../../../images/print-solid.png")} alt="" /> */}
                      <div style={{ backgroundImage: `url('${require("../../../images/print-solid.png")}')` }} className="img-icon"></div>
                    </span>
                    <span className="btn-name btn-name-size">
                      {t("takeaway.printInvoice")}</span>
                  </Button>
                </div>
              </div> :
              (billInfo && billInfo.order_status && (billInfo.order_status.id === 31 || billInfo.order_status.id === 32)  ?
                <div className="text-center cancel-order-takeaway-wrap">
                    {/* <span className="cancel-order-takeaway-content">
                      ORDER ĐÃ BỊ HỦY
                    </span> */}
                    <Button onClick={this.onRestoreOrder}>
                    <FontAwesomeIcon icon={faSyncAlt} />&nbsp;&nbsp;{t("user.restore")}
                    </Button>
                </div>
                :
              <div className="text-center">
                <Button
                  className="s2 e-flex item-center e-m-right-5"
                  onClick={this.showAlert_delete}
                >
                  <FontAwesomeIcon style={{ fontSize: 17 }} icon={faTimesCircle}
                    className="e-m-right-5" size="lg" />
                  <span className="btn-name btn-name-size">{t("takeaway.cancel")}</span>
                </Button>
                <Button onClick={this.onClickButtonPayment}
                  className="e-m-right-5" type="s4" style={{ zIndex: 1 }}>
                  <FontAwesomeIcon style={{ fontSize: 17 }} icon={faMoneyBillAlt}
                    className="e-m-right-5" />
                  <span className="btn-name btn-name-size"> {t("takeaway.payment")}</span>
                </Button>
              </div>))
            }
          </div>
        </div>
        {showPopupSelectedList_confirm ? <PopupSelectedList_confirm
          t={t}
          dishList={billInfo && billInfo.order_items}
          orderId_children={billInfo && billInfo.id}
          totalPrice={billInfo && billInfo.total_money}
          close={() => { this.setState({ showPopupSelectedList_confirm: false }); close() }}
          show={showPopupSelectedList_confirm}
          showPopupPayments={showPopupPayments}
          customerPhoneNumber={billInfo && billInfo.customer_tel}
          customerName={billInfo && billInfo.customer_name}
          orderItemById_children={this.props.billInfo}
          billInfo={billInfo}
          takeawayBill={true}
          unit_price={this.props.unit_price}
          billInfoById={this.props.billInfoById}
        /> : null}
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
                    return (<div key={index} className="content-item" style={{ width: 199 }}>
                      <ReactToPrint
                        trigger={() => {
                          return <div className="reactToPrint">
                            <a href="#">
                              {item.printer_name}
                            </a>
                          </div>
                        }}
                        content={() => this.child}
                        pageStyle={pageStyle}
                        onBeforeGetContent={() => { this.GetDataPageStyles(item) }}
                      />
                      <PopupDetailBill
                        totalBill={/* totalBill ? totalBill : */ 0}
                        surcharge_no_pay={this.state.billInfoById?.surcharge_value}
                        voucher_code={this.props.voucher_code}
                        order_no={this.props.billInfo && this.props.billInfo.order_no ? this.props.billInfo.order_no : ""}
                        received_no_pay={/* inputMoney ? inputMoney : */ 0}
                        dishList={this.props.dishList}
                        billInfo={this.props.billInfo}
                        childRef={ref => (this.child = ref)}
                        pageStyleFromApi={pageStyleFromApi}
                        unit_price={this.props.unit_price}
                        orderItemByIdConfirm={this.state.billInfoById}
                        isCheckPaymented={true}
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
        <Dialog
          show={this.state.showPopupCancelOrder}
          innerClass="popup-cancel-payment"
          close={() => { this.setState({ showPopupCancelOrder: false }) }}
        >
          <CompPopupCancel trans={this.props.t} order={this.props.billInfo}
            selectedArea={this.props.accountInfoStaff?.UserAreas?.[0]}
            closePopup={() => { this.setState({ showPopupCancelOrder: false })}}
            {...this.props} />
        </Dialog>
        <Dialog
          show={this.state.showPopupCancelPayment}
          innerClass="popup-cancel-payment"
          close={() => { this.setState({ showPopupCancelPayment: false }) }}
        >
          <CompPopupCancelPayment
            selectedArea={this.props.accountInfoStaff?.UserAreas?.[0]}
            trans={this.props.t}
            lstBillByOrderId={this.state.billInfoById}
            order_id={this.props.billInfo && this.props.billInfo.id ? this.props.billInfo.id : ""}
            closePopup={() => this.setState({ showPopupCancelPayment: false })}
            selectedTableOrders={this.props.billInfo}
            {...this.props} />
        </Dialog>
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
)(withNamespaces()(TakeawayBill));
