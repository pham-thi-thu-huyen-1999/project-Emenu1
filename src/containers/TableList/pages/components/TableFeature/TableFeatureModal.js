import React, { Component } from "react";
import Styles from "../../../scss/TableList.module.scss";
import "../../../scss/CancelOrderPayment.scss";
import _, { rest } from "lodash";
import * as actions from "../../../actions";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { TableListReducerName } from "../../../reducers";
import TABLE_CONST from "../../TableContants";
import IconSource from "../TableFeatureIcons";
import TableOrdersModal from "./TableOrdersModal";
import FoodListModal from "./FoodListModalContent";
import CombineTableInfoModal from "./CombineTableInfoModal";
import { withRouter } from "react-router-dom";
import Swal from "../../../../../utils/sweetalert2";
import {
  updateEmptyTable,
} from "../../../../../api/table";
import {
  getBillListByOrderId, cancelBill
} from '../../../../../api/bill';
import { save } from "../../../../../services/localStorage";

import { SelectBox, TextArea, Dialog } from '../../../../../components/common/index';
import { CompPopupCancel, CompPopupCancelPayment } from "./CompPopupCancel.js";
import {
  addNofitication
} from '../../../../../api/notification';

class TableFeatureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverFeature: null,
      isShowOrderModal: false,
      isShowButtonFeature: true,
      isShowFoodListModal: false,
      isShowConbineInfoModal: false,
      isShowOrderListModal: false,
      showTextArea: false,
      showSelectReason: false,
      showPopupCancelPayment: false,
      showPopupCancelOrder: false,
      selected: 0,
      order: {},
      lstBillByOrderId: []
    };
  }

  /**
   * Close modal
   */
  closeModal = () => {
    this.props.tableActions.deselectInUseTable();
  };

  /**
   * On select table feature
   */
  onSelectTableFeature = async (feature) => {
    const { selectedTableOrders, trans } = this.props;
    this.props.tableActions.selectInUseTableFeature({ feature: feature });
    let isChooseOrder = false;
    let isShowOrderModal = selectedTableOrders && this.props.selectedTableOrders.length > 1;
    let amountOrderPaymented = 0;
    if (selectedTableOrders) {
      selectedTableOrders.map(order => {
        if (order.order_status.id === 1) {
          amountOrderPaymented += 1;
        }
        return order;
      })
    }

    switch (feature) {
      case "CHANGE_EMPTY_TABLE":
        this.changeEmptyTable()
        break;
      case "CHANGE_TABLE":
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          if (!isShowOrderModal) {
            this.props.onClose()
            this.props.openCombineMode()
          } else {
            isChooseOrder = true;
          }
        }
        break;
      case "CHECK_OUT":
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          if (amountOrderPaymented > 0) {
            if (!isShowOrderModal) {
              if (this.props.selectedTableOrders[0].order_status.id !== 2) {
                this.props.history.push(`/payment/order/${this.props.selectedTableOrders[0].id}`);
              }
            } else {
              isChooseOrder = true;
            }
          } else {
            Swal.fire({
              icon: "info",
              title: trans("noti"),
              text: trans("table_list:modal_swal.payment_table_success_message"),
              showConfirmButton: true,
            });
          }
        }
        break;
      case "ADD_TABLE":
      case "COMBINE_TABLE":
        this.props.onClose()
        this.props.openCombineMode()
        break;
      case "ADD_ORDER":
        this.props.tableActions.selectQRCodeTable({
          table: this.props.selectedInUseTable
        })
        this.closeModal()
        break;
      case "CANCEL_CHECK_OUT":
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          if (!isShowOrderModal) {
            this.cancelPayment(this.props.selectedTableOrders[0])
          } else {
            isChooseOrder = true;
          }
        }
        break;
      case 'CANCEL_ORDER':
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          if (!isShowOrderModal) {
            this.cancelOrder(this.props.selectedTableOrders[0])
          } else {
            isChooseOrder = true;
          }
        }
        break;
      case "FOOD_LIST":
        this.props.tableActions.getTableOrders({ table_id: this.props.selectedInUseTable.id })
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          // if (amountOrderPaymented > 0) {
          if (!isShowOrderModal) {
            this.props.tableActions.selectOrder({ order: this.props.selectedTableOrders[0] });
            save("table-number", this.props.selectedTableOrders ? this.props.selectedTableOrders[0].table.name : "");
            save("table-id", this.props.selectedTableOrders ? this.props.selectedTableOrders[0].table.id : "");
            this.setState({
              isShowFoodListModal: true,
              isShowButtonFeature: false
            })
          } else {
            isChooseOrder = true;
          }
          // } else {
          //   Swal.fire({
          //     icon: "info",
          //     title: trans("noti"),
          //     text: trans("table_list:modal_swal.payment_table_success_message"),
          //     showConfirmButton: true,
          //   });
          // }
        }
        break;
      case "COMBINE_TABLE_INFO":
      case "SEPERATE_TABLE":
        this.setState({
          isShowConbineInfoModal: true,
          isShowButtonFeature: false
        })
        break;
      case "ORDER":
        const { comboItemAll } = this.props;
        this.props.tableActions.getTableOrders({ table_id: this.props.selectedInUseTable.id })
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          if (this.props.selectedTableOrders.length === 1) {
            this.props.tableActions.selectOrder({ order: this.props.selectedTableOrders[0] });
            this.props.tableActions.getOrderItemById({ id: this.props.selectedTableOrders[0].id });
            save("table-number", this.props.selectedTableOrders ? this.props.selectedTableOrders[0].table.name : "");
            save("table-id", this.props.selectedTableOrders ? this.props.selectedTableOrders[0].table.id : "");
            save("order-id", this.props.selectedTableOrders[0].id); //order id cua suat an
            save("check-sign-up-combo", true);
            if (/* this.props.partnerSetting.partner_type !== 2 || */comboItemAll && this.props.comboItemAll.length <= 0) {
              this.props.history.push("/order-food-list");
            } else {
              if (comboItemAll && comboItemAll.length === 1 && comboItemAll[0].is_price === false) {
                save("vi-tri-combo", comboItemAll[0].id);//id cua combo ko co gia dang duoc chon
                this.props.history.push(`/order-food-list?combo-id=${comboItemAll[0].id}&combo-name=${comboItemAll[0].name}`);
              } else {
                this.props.history.push("/order-comboList");
              }
            }
          } else {
            this.props.tableActions.selectOrder({ order: this.props.selectedTableOrders[0] });
            isChooseOrder = true;
          }
        }
        break;
      case "RESTORE_ORDER":
        //vao man hinh danh sach order cua ban
        this.props.tableActions.getTableOrders({ table_id: this.props.selectedInUseTable.id })
        if (!_.isEmpty(this.props.selectedTableOrders)) {
          if (amountOrderPaymented > 0) {
            if (!isShowOrderModal) {
              if (this.props.selectedTableOrders[0].order_status.id !== 2) {
                Swal.fire({
                  icon: "warning",
                  title: this.props.trans("table_list:modal_swal.sure"),
                  text: this.props.trans("Muốn khôi phục order không"),
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: this.props.trans("table_list:modal_swal.ok"),
                  cancelButtonText: this.props.trans("table_list:modal_swal.cancel"),
                })
              }
            } else {
              isChooseOrder = true;
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: this.props.trans("table_list:modal_swal.sure"),
              text: this.props.trans("Muốn khôi phục order không"),
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: this.props.trans("table_list:modal_swal.ok"),
              cancelButtonText: this.props.trans("table_list:modal_swal.cancel"),
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  // call api khôi phục order
                } catch (error) {
                  Swal.fire({
                    icon: "error",
                    title: this.props.trans("table_list:modal_swal.error"),
                    text: this.props.trans("table_list:modal_swal.change_empty_table_fail_message"),
                    showConfirmButton: true,
                  })
                }
              }
            });
          }
        }
        break;
      default:
        break;
    }

    if (isChooseOrder) {
      this.setState({
        isShowOrderModal: isChooseOrder,
        isShowButtonFeature: false
      })
    }
  };

  /**
   * Cancel payment
   */
  cancelPayment = async (order) => {
    const lstBillByOrderId = await getBillListByOrderId({ order_id: order.id })
    if (order.order_status.id === 1) {
      Swal.fire({
        icon: "info",
        title: this.props.trans("Thông báo"),
        text: this.props.trans("Order chưa được thanh toán"),
        showConfirmButton: true,
      })
    } else {
      this.setState({ showPopupCancelPayment: true, lstBillByOrderId: lstBillByOrderId.data.data })
    }
  }
  /**
   * Cancel order
   */
  cancelOrder = (order) => {
    this.setState({
      showPopupCancelOrder: true,
      order
    })
  }

  onMouseEnterFeature = (feature) => {
    this.setState({
      hoverFeature: feature,
    });
  };

  onMouseLeaveFeature = () => {
    this.setState({
      hoverFeature: null,
    });
  };

  /** TODO
   * Change to available table
   */
  changeEmptyTable = () => {
    const { selectedInUseTable, selectedArea } = this.props;
    Swal.fire({
      icon: "warning",
      title: this.props.trans("table_list:modal_swal.sure"),
      text: this.props.trans("table_list:modal_swal.change_to_empty_table_message"),
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.props.trans("table_list:modal_swal.ok"),
      cancelButtonText: this.props.trans("table_list:modal_swal.cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await updateEmptyTable({ table_id: this.props.selectedInUseTable.id, status: TABLE_CONST.TABLE_STATUS_EMPTY })
          const dataPushNoti = {
            "title": "Chuyển bàn trống",
            "content": `Bàn ${selectedInUseTable.name} vừa chuyển bàn trống`,
            "action": "reset_table",
            "type_notification": "1",
            "link": "",
            "body_data": {
              "table_id": this.props.selectedInUseTable.id,
              action: "reset_table",
            },
            "topic": `area_${selectedArea.id}`,
            "list_user": [
              ""
            ],
            "is_push_noti": "1"
          }
          await addNofitication({ data: dataPushNoti })
          if (data) {
            Swal.fire({
              icon: "success",
              title: this.props.trans("table_list:modal_swal.done"),
              text: this.props.trans("table_list:modal_swal.change_empty_table_success_message"),
              showConfirmButton: true
            }).then(async (result) => {
              this.props.tableActions.changeTableStatus({ table_id: this.props.selectedInUseTable.id, status: TABLE_CONST.TABLE_STATUS_EMPTY });
              this.closeModal();
              //window.location.reload();
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: this.props.trans("table_list:modal_swal.error"),
            text: this.props.trans("table_list:modal_swal.change_empty_table_fail_message"),
            showConfirmButton: true,
          })
        }
      }
    });
  }

  /**
   * Render feature buttons
   */
  renderFeatureButtons = () => {
    const noOrder = this.props.selectedTableOrders && this.props.selectedTableOrders.length === 0 ? true : false;
    let lstFeatureTbable = TABLE_CONST.TABLE_FEATURE_KEY;
    if (noOrder) {
      lstFeatureTbable = [
        'CHANGE_EMPTY_TABLE',
        'SEPERATE_TABLE',
        'COMBINE_TABLE_INFO',
        'ADD_ORDER'
      ]
    } else {
      if (this.props.selectedTableOrders && this.props.selectedTableOrders.length > 1) {
        lstFeatureTbable = [
          'FOOD_LIST',
          'CHECK_OUT',
          'CHANGE_EMPTY_TABLE',
          'SEPERATE_TABLE',
          'COMBINE_TABLE_INFO',
          'CANCEL_CHECK_OUT',
          'CANCEL_ORDER',
          'ORDER',
          'ADD_ORDER'
        ]
      } else {
        lstFeatureTbable = [
          'FOOD_LIST',
          'CHECK_OUT',
          'CHANGE_EMPTY_TABLE',
          'SEPERATE_TABLE',
          'COMBINE_TABLE_INFO',
          'CANCEL_CHECK_OUT',
          'ORDER',
          'ADD_ORDER'
        ]
      }
    }

    return lstFeatureTbable.map((feature, index) => {
      let disabled = ((feature === "ADD_TABLE")
        || (feature === "CHANGE_TABLE")
        || (feature === "COMBINE_TABLE")
        || (feature === "FOOD_LIST" && noOrder)
        || (feature === "CANCEL_ORDER" && noOrder)
        || (feature === "CANCEL_CHECK_OUT" && noOrder)
        || (feature === "CHECK_OUT" && noOrder)
        || (feature === "ORDER" && noOrder)
      )
      if (_.isEmpty(this.props.combinedTables) && ((feature === "COMBINE_TABLE_INFO") || (feature === "SEPERATE_TABLE"))) {
        return null;
      } else {
        const Icon = IconSource[feature];
        return (
          <button
            key={index}
            className={`${Styles["feature-button"]}
            ${disabled ? Styles["disabled"] : ""}
            ${disabled ? "disable" : ""}`}
            onMouseLeave={this.onMouseLeaveFeature.bind(this)}
            onMouseEnter={this.onMouseEnterFeature.bind(this, feature)}
            onClick={this.onSelectTableFeature.bind(this, feature)}
            disabled={disabled}
          >
            {/* TODO */}
            <span>{this.props.trans(`table_list:table_feature.${feature}`)}</span>
            <div className={Styles["feature-icon"]}>
              <Icon color={disabled
                ? this.state.hoverFeature === feature
                  ? "#ccc"
                  : this.state.hoverFeature === feature ? "#eee" : null : ""} />
            </div>
          </button>
        );
      }
    });
  };

  /**
   * On close order modal
   */
  onCloseOrderModal = () => {
    this.setState({
      isShowOrderModal: false,
      isShowButtonFeature: true,
      hoverFeature: null
    });
    if (this.state.isShowFoodListModal) {
      this.setState({
        isShowFoodListModal: false
      })
    }
    if (this.state.isShowConbineInfoModal) {
      this.setState({
        isShowConbineInfoModal: false
      })
    }
    if (this.state.isShowOrderListModal) {
      this.setState({
        isShowOrderListModal: false
      })
    }
  }

  /**
   * Select table change
   */
  selectChangeTable = () => {
    this.props.onClose()
    this.props.openCombineMode()
  }

  /**
   * Check out order
   */
  checkOutOrder = (order) => {
    const { trans } = this.props;
    if (order.order_items.length || order.order_combo_items.length > 0) {
      this.props.history.push(`/payment/order/${order.id}`);
    } else {
      Swal.fire({
        icon: "warning",
        title: trans("setting.language.swalTitle"),
        text: "Bạn chưa chọn món ăn/suất ăn nên không thể thực hiện thanh toán",
        showConfirmButton: true,
        confirmButtonText: trans("table_list:ok")
      }).then(async (result) => {
        if (result.isConfirmed) { }
      });
    }
  }

  render() {
    // Normalize translation
    const trans = this.props.trans;
    const { ...rest } = this.props;
    return (
      <div
        className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}
      >
        {this.state.isShowOrderModal ? (
          <TableOrdersModal
            trans={trans}
            closeModal={this.onCloseOrderModal.bind(this)}
            showFoodList={() =>
              this.setState({
                isShowFoodListModal: true,
                isShowButtonFeature: false,
                isShowOrderModal: false,
              })
            }
            changeTable={() => this.selectChangeTable()}
            cancelOrder={(order) => this.cancelOrder(order)}
            cancelPayment={(order) => this.cancelPayment(order)}
            checkOutOrder={(order) => this.checkOutOrder(order)}
            {...rest}
          />
        ) : null}
        {this.state.isShowFoodListModal ? (
          <FoodListModal
            trans={trans}
            closeModal={this.onCloseOrderModal.bind(this)}
            {...rest}
          />
        ) : null}
        {this.state.isShowConbineInfoModal ? (
          <CombineTableInfoModal
            trans={trans}
            closeModal={this.onCloseOrderModal.bind(this)}
          />
        ) : null}
        {this.state.isShowButtonFeature ? (
          <div
            className={`mfp-content ${Styles["modal-wrapper"]}`}
            style={{ width: "930px", height: "auto" }}
          >
            <div
              className={Styles["button-close"]}
              onClick={this.closeModal.bind(this)}
            ></div>
            <div className={Styles["modal-header-title"]}>
              <span>
                {this.props.trans("table")} {this.props.selectedInUseTable
                  ? this.props.selectedInUseTable.name
                  : ""}
              </span>
            </div>
            <div
              className={`${Styles["modal-content-wrapper"]} ${Styles["modal-features"]}`}
              style={{ alignItems: "center" }}
            >
              {this.renderFeatureButtons()}
            </div>
          </div>
        ) : null}
        <Dialog
          show={this.state.showPopupCancelOrder}
          innerClass="popup-cancel-payment"
          close={() => { this.setState({ showPopupCancelOrder: false }) }}
        >
          <CompPopupCancel trans={this.props.trans} order={this.state.order}
            close={() => { this.setState({ showPopupCancelOrder: false }); this.closeModal() }} {...this.props} />
        </Dialog>
        <Dialog
          show={this.state.showPopupCancelPayment}
          innerClass="popup-cancel-payment"
          close={() => { this.setState({ showPopupCancelPayment: false }) }}
        >
          <CompPopupCancelPayment
            trans={this.props.trans}
            lstBillByOrderId={this.state.lstBillByOrderId}
            order={this.state.order}
            close={() => this.setState({ showPopupCancelPayment: false })}
            {...this.props} />
        </Dialog>
      </div >
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

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TableFeatureModal);

