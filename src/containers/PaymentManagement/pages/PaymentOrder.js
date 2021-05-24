import React, { Component } from "react";
import Styles from "./PaymentManagement.module.scss";
import { withNamespaces } from "react-i18next";
import OderFoodTable from "./components/OderFoodTable";
import EachPersonMoney from "./components/EachPersonMoney";
import OrderPriceInfo from "./components/OrderPriceInfo";
import PaymentMethodSelection from "./components/PaymentMethodSelection";
import * as paymentActions from "../actions";
import * as tableActions from "../../TableList/actions";
import * as settingPrintActions from "../../SettingScreen/actions";
// import * as partnerSettingActions from "../../SettingScreen/components/General/actions";
import { PaymentReducerName } from "../reducers";
import { TableListReducerName } from "../../TableList/reducers";
import { AreaReducerName } from "../../AreaManagement/reducers";
import { name } from "../../SettingScreen/reducers";
// import { name } from "../../SettingScreen/components/General/reducers";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withRouter } from "react-router-dom";
import _, { toUpper } from "lodash";
import utilsFormat from "../../../utils/formats";
import { CheckBox, Button, Dialog } from "../../../components/common";
import BillConfirmation from "./components/BillConfirmation";
import { getAccountInfoStaff } from "../../../api/account";
import { checkPayment } from "../../../api/order";
import common from "../../../utils/common";
import { get, save } from "../../../services/localStorage";
import CompPrintBillPrint from './components/CompPrintBillPrint';
import ReactToPrint from 'react-to-print';
import './stylePrintOrder.scss';

class PaymentOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckPayByItem: false,
      isShowBillConfirm: false,
      userInfo: null,
      foodList: [],
      orderPaymentInfo: null,
      additionalFeeAmount: 0,
      voucher: {
        code: null,
        value: 0
      },
      lstOrderFoods: [],
      lstFoodStart: [],
      isShowPopupChoosePrinter: false,
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
      }
    };
  }

  componentDidMount() {
    this.getOrderDetail();
    this.getStaffInfo();
    // this.checkOrderPayment();
    this.props.settingPrintActions.getPrinterBillList();
    this.props.paymentActions.getInfoPartner();
    this.props.tableActions.getPartnerSetting({ categoryName: "", comboName: "" });
    //this.props.paymentActions.getPartnerSetting();
  }
  componentDidUpdate(prevProps, prevStates) {
    const { orderDetail } = this.props;
    if (prevProps.orderDetail !== orderDetail && !_.isEmpty(orderDetail)) {
      const foodList = this.mergeFoodItem(orderDetail);
      // update listfood thêm biến số lượng đã chọn vào item
      this.setState({
        foodList: foodList,
        lstFoodStart: foodList
      });
    }
  }
  /**
   * Get order promotion and taxes
   */
  checkOrderPayment = async () => {
    const { orderId } = this.props.match.params;
    try {
      const data = await checkPayment({
        order_id: orderId,
        items: this.state.lstOrderFoods
      });
      if (!_.isEmpty(data.data) && !_.isEmpty(data.data.data)) {
        this.setState({ orderPaymentInfo: data.data.data });
      }
    } catch (error) { }
  };
  /**
   * Get order detail
   */
  getOrderDetail = () => {
    const { orderId } = this.props.match.params;
    if (orderId) {
      this.props.paymentActions.getOrderDetail({ order_id: orderId });
    }
  };
  /**
   * Merge list food items if there is combo items
   */
  mergeFoodItem = (orderDetail) => {
    const { order_combo_items, order_items } = orderDetail;
    let foodList = [];
    foodList = foodList.concat(order_items);
    if (
      !_.isEmpty(order_combo_items[0]) &&
      !_.isEmpty(order_combo_items[0].order_items)
    ) {
      foodList = foodList.concat(order_combo_items[0].order_items);
    }
    return foodList;
  };
  /**
   * Cancel payment
   */
  onCancel = () => {
    this.props.history.push("/");
  };
  /**
   * Confirm payment
   */
  onConfirmPayment = () => {
    const { additionalFeeAmount, isCheckPayByItem } = this.state;
    if (isCheckPayByItem) {
      this.checkOrderPayment();
    }
    save("Phu-Thu", additionalFeeAmount);
    this.setState({ isShowBillConfirm: true });
  };
  /**
   * Toggle pay by selecting items
   */
  onCheckPayByItem = (checked) => {
    const { lstOrderFoods } = this.state;
    this.setState({
      isCheckPayByItem: !this.state.isCheckPayByItem,
      lstOrderFoods: checked ? lstOrderFoods : []
    });
  };
  /**
   * Render combo item info
   */
  renderComboItemInfo = (comboItems) => {
    const orderCombo = comboItems || [];
    if (!_.isEmpty(orderCombo) && orderCombo[0].price > 0) {
      return (
        <div className={Styles["modal-additional-info"]}>
          <div className={Styles["title"]}>
            <span>
              {this.props.t("table_list:food_list.combo_information")}:
            </span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>{orderCombo[0].combo_item_name}</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>{comboItems[0].qty} suất</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>{`${orderCombo[0].order_items.length} ${this.props.t(
              "table_list:food_list.combo_item_count"
            )}`}</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>
              {`${utilsFormat.moneyFormat(orderCombo[0].price - orderCombo[0].discount_value)} ${this.props.t(
                "table_list:order.currency"
              )}`}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className={Styles["modal-additional-info"]}>
          <CheckBox
            checked={this.state.isCheckPayByItem}
            onChange={this.onCheckPayByItem}
          />
          <span className={Styles["pay-by-item"]}>
            {this.props.t("payment:payment_order.pay_by_item")}
          </span>
        </div>
      );
    }
  };
  /**
   * On close bill confirm
   */
  onCloseBillConfirm = () => {
    this.setState({ isShowBillConfirm: false });
  };
  /**
   * Calculate tax amount
   */
  calculateTaxAmount = (taxValue, total) => {
    return (taxValue * total) / 100;
  };
  /**
   * Calculate post total
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
   * Calculate promotion amount
   */
  calculatePromotionAmount = (promotionValue, total) => {
    return (promotionValue * total) / 100;
  };
  /**
   * Get staff info
   */
  getStaffInfo = async () => {
    try {
      let infoToken = common.decodeToken(get("accessToken"));
      const data = await getAccountInfoStaff({ id: infoToken.sub });
      if (data.data && data.data.data) {
        this.setState({
          userInfo: data.data.data,
        });
      }
    } catch (error) { }
  };
  /**
   * Set additional fee
   */
  setAdditionalFee = (amount) => {
    this.setState({ additionalFeeAmount: amount });
  };
  /**
   * Apply voucher code
   */
  applyVoucherCode = (voucher) => {
    this.setState({ voucher: voucher })
  }
  /**
   * temporary printing
   */
  onPrintProvisi = async () => {
    const { orderId } = this.props.match.params;
    const { additionalFeeAmount } = this.state;
    await save("Phu-Thu", additionalFeeAmount);
    await this.props.history.push(`/printProvisi/${orderId}`);
  }
  onChangeCheckFood = (checked, item) => {
    let { lstOrderFoods } = this.state;
    if (checked) {
      lstOrderFoods.push(item)
    } else {
      lstOrderFoods = lstOrderFoods.filter(food => food.id !== item.id)
    }
    this.setState({ lstOrderFoods })
  }
  /**
   * change qty food
   * @param {*} valueQty
   * @param {*} item
   */
  onChangeQtyFood = (valueQty, item) => {
    let { lstOrderFoods } = this.state;
    let dataSelectedQty = [...this.state.foodList];
    let newData = dataSelectedQty.map(foodSelected => {
      let foodItem = {}
      if (foodSelected.id === item.id) {
        foodItem = { ...foodSelected, qty: valueQty }
        return foodItem
      }
      return foodSelected
    })
    let newDataSelected = lstOrderFoods.map(foodSelected => {
      let itemSelected = {}
      if (foodSelected.id === item.id) {
        itemSelected = { ...foodSelected, qty: valueQty }
        return itemSelected
      }
      return foodSelected
    })

    this.setState({ foodList: newData, lstOrderFoods: newDataSelected })
  }

  GetDataPageStyles = (item) => {
    const { printerBillList } = this.props;
    let pageStyleFromApiTemp = {};
    if (printerBillList && printerBillList.length > 0) {
      for (let i = 0; i < printerBillList.length; i++) {
        if (printerBillList[i].printer_bills && printerBillList[i].printer_bills.length > 0) {
          if (get("area-id") === printerBillList[i].area_id) {
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

  render() {
    const trans = this.props.t;
    const { userInfo, foodList, orderPaymentInfo,
      additionalFeeAmount, voucher, isCheckPayByItem,
      pageStyleFromApi, lstFoodStart } = this.state;
    const { selectedPaymentMethod, orderDetail,
      history, infoPartner, t, lng,
      partnerSetting, printerBillList } = this.props;
    const billAdditionalDetail = {
      staffName: userInfo ? userInfo.full_name : "",
      orderNo: orderDetail ? orderDetail.order_no : "",
      tableName: orderDetail && orderDetail.table ? orderDetail.table.name : "",
    };
    let unit_price = "";
    if (partnerSetting && partnerSetting.currency) {
      if (lng === "vi") {
        unit_price = partnerSetting.currency.name_vn;
      } else if (lng === "en") {
        unit_price = partnerSetting.currency.name_en;
      } else {
        unit_price = partnerSetting.currency.name_jp;
      }
    }
    const postTotal = this.calculatePostTotal(orderPaymentInfo, additionalFeeAmount);

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
      <main id="site-main" className="nofooter">
        {this.state.isShowBillConfirm ? (
          <BillConfirmation
            onClose={this.onCloseBillConfirm}
            trans={trans}
            foodList={isCheckPayByItem ? this.state.lstOrderFoods : foodList}
            selectedPaymentMethod={selectedPaymentMethod}
            billAdditionalDetail={billAdditionalDetail}
            orderPaymentInfo={orderPaymentInfo}
            additionalFeeAmount={additionalFeeAmount}
            postTotal={postTotal}
            voucher={voucher}
            orderId={this.props.match.params.orderId}
            history={history}
            orderDetail={isCheckPayByItem ? orderPaymentInfo : orderDetail}
            printerBillList={printerBillList}
            unit_price={unit_price}
            infoPartner={infoPartner}
            onBeforeGetContent={this.GetDataPageStyles}
            pageStyleFromApi={pageStyleFromApi}
            isCheckPayByItem={isCheckPayByItem}
          // {...this.props}
          />
        ) : (
            <div
              className={`${Styles["e-main-content"]} ${Styles["center"]} ${Styles["horizontal-only"]}`}
            >
              <div className={Styles["payment-wrapper"]}>
                <div
                  className={`${Styles["payment-order-title"]} ${Styles["center"]}`}
                >
                  <span>{toUpper(trans("payment:payment_order.title"))}</span>
                  <span className={Styles["name-table"]}>{trans("table")} {orderDetail ? orderDetail.table.name : ""}</span>
                </div>
                {this.renderComboItemInfo(
                  this.props.orderDetail
                    ? this.props.orderDetail.order_combo_items
                    : null
                )}
                <div className={Styles["payment-info"]}>
                  <div className={Styles["lst-food-payment"]}>
                    <OderFoodTable
                      foodList={this.state.foodList}
                      isCheckPayByItem={this.state.isCheckPayByItem}
                      onChangeCheckFood={this.onChangeCheckFood}
                      lstOrderFoods={this.state.lstOrderFoods}
                      trans={trans}
                      unit_price={unit_price}
                      onChangeQtyFood={this.onChangeQtyFood}
                      lstFoodStart={lstFoodStart}
                    />
                    <EachPersonMoney
                      totalEachPerson={voucher.value ? postTotal - voucher.value : postTotal}
                      partnerSetting={this.props.partnerSetting} trans={trans} unit_price={unit_price}
                      {...this.props}
                    />
                  </div>
                  <div className={Styles["order-process"]}>
                    <div className={Styles["order-cal-payment-method"]}>
                      <PaymentMethodSelection {...this.props} />
                    </div>
                    <OrderPriceInfo
                      setAdditionalFee={this.setAdditionalFee}
                      applyVoucherCode={this.applyVoucherCode}
                      trans={trans}
                      orderPaymentInfo={orderPaymentInfo}
                      postTotal={postTotal}
                      additionalFeeAmount={additionalFeeAmount}
                      orderId={this.props.match.params.orderId}
                      orderDetail={this.props.orderDetail}
                      unit_price={unit_price}
                      partnerSetting={this.props.partnerSetting}
                      {...this.props}
                    />
                  </div>
                </div>
                <div className={`${Styles["group-button"]}`}>
                  <Button
                    className="e-m-right-10"
                    type="s3"
                    onClick={this.onCancel}
                  >
                    {trans("payment:payment_order.cancel")}
                  </Button>
                  <Button className="e-m-right-10"
                    style={{ width: "120px" }}
                    onClick={() => {
                      this.setState({
                        isShowPopupChoosePrinter: true
                      })
                    }}>
                    {trans("payment:payment_order.export_temp_bill")}
                  </Button>
                  <Button
                    onClick={this.onConfirmPayment}
                  >
                    {trans("payment:payment_order.confirm")}
                  </Button>
                </div>
              </div>
            </div>
          )}
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
                        pageStyle={pageStyle}
                        onBeforeGetContent={() => { this.GetDataPageStyles(item) }}
                      />
                      <CompPrintBillPrint
                        orderDetail={orderDetail}
                        infoPartner={infoPartner} t={t}
                        additionalFeeAmount={additionalFeeAmount}
                        ref={el => (this.componentRef = el)} {...this.props}
                        unit_price={unit_price}
                        printerBillList={this.props.printerBillList}
                        pageStyleFromApi={pageStyleFromApi}
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
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[PaymentReducerName],
    ...state[TableListReducerName],
    selectedFeature: state[TableListReducerName].selectedFeature,
    selectedArea: state[AreaReducerName].selectedArea,
    ...state[name]
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...paymentActions,
    /* ...partnerSettingActions, */
    ...tableActions
  }
  return {
    paymentActions: bindActionCreators({ ...paymentActions }, dispatch),
    tableActions: bindActionCreators({ ...tableActions }, dispatch),
    settingPrintActions: bindActionCreators({ ...settingPrintActions }, dispatch)
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(PaymentOrder));
