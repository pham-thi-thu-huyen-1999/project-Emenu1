import React, { Component } from "react";
import Styles from "../../../scss/TableList.module.scss";
import _ from "lodash";
import * as actions from "../../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TableListReducerName } from "../../../reducers";
import utils from "../../../../../utils/formats";
import { save } from "../../../../../services/localStorage";
import { addEmployeesToShiftSuccess } from "../../../../CalendarManagement/actions";

class TableOrdersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: null,

    };
  }

  /**
   * Toggle select area
   */
  toggleSelectArea = (area) => {
    if (this.state.selectedArea) {
      if (this.state.selectedArea.id !== area.id) {
        this.setState({
          selectedArea: area,
        });
      }
    }
  };

  /**
   * Confirm select order
   */
  confirmSelectOrder = () => {
    const { comboItemAll } = this.props;
    if (this.state.selectedOrder) {
      if (this.props.selectedFeature === "FOOD_LIST") {
        this.props.tableActions.selectOrder({ order: this.state.selectedOrder });
        this.props.showFoodList()
      } else if (this.props.selectedFeature === "CANCEL_CHECK_OUT") {
        this.props.cancelPayment(this.state.selectedOrder)
      } else if (this.props.selectedFeature === "CANCEL_ORDER") {
        this.props.cancelOrder(this.state.selectedOrder)
      } else if (this.props.selectedFeature === "CHANGE_TABLE") {
        this.props.tableActions.selectOrder({ order: this.state.selectedOrder });
        this.props.changeTable()
      } else if (this.props.selectedFeature === "CHECK_OUT") {
        this.props.tableActions.selectOrder({ order: this.state.selectedOrder });
        this.props.checkOutOrder(this.state.selectedOrder)
      } else if (this.props.selectedFeature === "ORDER") {
        this.props.tableActions.selectOrder({ order: this.state.selectedOrder });
        //Thuc hien khi chon order cua danh sach order
        //Lay thong tin order
        this.props.tableActions.getOrderItemById({ id: this.state.selectedOrder.id });
        save("table-number", this.props.selectedInUseTable ? this.props.selectedInUseTable.name : "");
        save("table-id", this.props.selectedInUseTable ? this.props.selectedInUseTable.id : "");
        //order id khi chon mot trong suat order cua suat an
        save("order-id", this.state.selectedOrder.id); //order id cua suat an
        if (/* this.props.partnerSetting.partner_type !== 2 || */ this.props.comboItemAll.length <= 0) {
          this.props.history.push("/order-food-list");
        } else {
          if (comboItemAll && comboItemAll.length === 1 && comboItemAll[0].is_price === false) {
            save("vi-tri-combo", comboItemAll[0].id);//id cua combo ko co gia dang duoc chon
            this.props.history.push(`/order-food-list?combo-id=${comboItemAll[0].id}&combo-name=${comboItemAll[0].name}`);
          } else {
            this.props.history.push("/order-comboList");
          }
        }

      }
    }
  };

  /**
   * On select order
   */
  onSelectOrder = (order) => {
    if (
      !this.state.selectedOrder ||
      (this.state.selectedOrder && this.state.selectedOrder.id !== order.id)
    ) {
      this.setState({
        selectedOrder: order,
      });
    } else {
      this.setState({
        selectedOrder: null,
      });
    }
  };

  /**
   * On cancel
   */
  onCancel = async () => {
    await this.props.tableActions.deselectInUseTableFeature();
    this.props.closeModal()
  }

  /**
   * Render orders
   */
  renderOrders = () => {
    const { selectedTableOrders } = this.props;
    return selectedTableOrders.map((order) => {
      const qtyItemComboItem = order.order_combo_items.length > 0
        ? order.order_combo_items[0].order_items.length : 0;
      return (
        <div
          key={order.id}
          className={`${Styles["order-item"]} ${this.state.selectedOrder && order.id === this.state.selectedOrder.id ? Styles["active"] : ""}`}
          onClick={this.onSelectOrder.bind(this, order)}
        >
          <div className={Styles["order-item-title"]}>
            <span>
              {`${this.props.trans(
                "table_list:order.check_in_at"
              )}: ${utils.timeFormat(order.check_in)}`}
            </span>
            <span
              className={`icon-o-clock ${Styles["icon-o-clock-custom"]}`}
            ></span>
          </div>
          <div className={Styles["order-info"]}>
            <div className={Styles["order-user"]}>
              <div className={Styles["user-info"]}>
                {order.customer_name ? order.customer_name : ""}
                <br />
                {order.customer_tel ? order.customer_tel : ""}
              </div>
            </div>
            <div className={Styles["order-detail"]}>
              <div className={Styles["order-detail-container"]}>
                {order.order_status.id === 2 ?
                  <div className={Styles["paid"]}>
                    <span>Đã thanh toán</span></div> : ""}
                <div className={Styles["order-item-count"]}>
                  <span>
                    {this.props.trans("table_list:order.item_quantity")}
                  </span>
                  <span>
                    {`${order.order_items && order.order_combo_items ? order.order_items.length + qtyItemComboItem : 0
                      } ${this.props.trans("table_list:order.item_unit")}`}
                  </span>
                </div>
                <div className={Styles["order-check-out"]}>
                  <span>No</span>
                  <span>{order.order_no ? order.order_no : ""}</span>
                </div>
                <div className={Styles["order-check-out"]}>
                  <span>{this.props.trans("table_list:order.total")}</span>
                  <span>
                    {`${utils.moneyFormat(
                      order.total_money
                    )} ${this.props.trans("table_list:order.currency")}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  /**
   * Render modal title
   */
  renderTitle = () => {
    let title = this.props.trans("table_list:order.title.for_food_list");
    if (this.props.selectedFeature === "CANCEL_CHECK_OUT") {
      title = this.props.trans("table_list:order.title.for_cancel_checkout");
    } else if (this.props.selectedFeature === "CANCEL_ORDER") {
      title = this.props.trans("table_list:order.title.for_cancel_order");
    } else if (this.props.selectedFeature === "CHANGE_TABLE") {
      title = this.props.trans("table_list:order.title.for_change_table");
    } else if (this.props.selectedFeature === "CHECK_OUT") {
      title = this.props.trans("table_list:order.title.for_check_out");
    } else if (this.props.selectedFeature === "ORDER") {
      title = this.props.trans("table_list:order.title.for_order");
    }
    return title;
  }

  render() {
    return (
      <div
        className={`mfp-content ${Styles["modal-wrapper"]}`}
        style={{ width: "712px", height: "650px" }}
      >
        <div className={Styles["modal-header-title"]} style={{ fontSize: '25px', marginBottom: '10px' }}>
          <span>
            {
              this.renderTitle()
            }
          </span>
        </div>
        <div className={Styles["modal-content-wrapper"]} style={{ maxHeight: 'calc(100% - 130px)' }}>
          {this.renderOrders()}
        </div>
        <div className={Styles["modal-action-buttons"]}>
          <button
            onClick={this.onCancel.bind(this)}
            className={`${Styles["button"]} ${Styles["cancel"]}`}
            type="button"
          >
            {this.props.trans("table_list:back")}
          </button>
          <button className={Styles["button"]} type="button" onClick={this.confirmSelectOrder.bind(this)}>
            {this.props.trans("table_list:choose")}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableOrdersModal);
