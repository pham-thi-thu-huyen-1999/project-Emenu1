import React, { Component } from "react";
import Styles from "../../../scss/TableList.module.scss";
import _ from "lodash";
import * as actions from "../../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TableListReducerName } from "../../../reducers";
import moment from "moment";
import utils from "../../../../../utils/formats";
import { LANGUAGES } from "../../../../../consts/constants";
import { NumberRange, Button, TableData } from "../../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle, faEdit, faSave
} from "@fortawesome/free-solid-svg-icons";
import Swal from "../../../../../utils/sweetalert2";
import { get } from "../../../../../services/localStorage";
import api from "./../../../../../services/api";
import { deleteOrderItemById } from "../../../../../api/order";
import api_v1_1 from "./../../../../../services/api_v1_1";
import PopupQuantity from "./PopupQuantity";

class FoodListModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArea: null,
      orderId: this.props.selectedOrder ? this.props.selectedOrder.id : "",
      showQuantity: false,
      orderList: [],
      orderCombo: this.props.selectedOrder ? this.props.selectedOrder.order_combo_items : [],
      lstItemComboItem: []
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.selectedOrder.id !== prevState.orderId) {
  //     return {
  //       orderId: nextProps.selectedOrder.id,
  //     };
  //   }
  //   return null;
  // }

  /**
   * Close modal
   */
  closeModal = async () => {
    await this.props.tableActions.deselectOrder();
    await this.props.tableActions.deselectInUseTableFeature();
    this.props.closeModal();
  };

  /**
   * Calculate elasped time
   */
  timePassed = (fromTime) => {
    let diff = moment().diff(moment(fromTime));
    let minute = Math.ceil(moment.duration(diff).as("minutes"));
    return minute;
  };

  /**
   * Render food list
   */
  renderFoodList = () => {
    let foodListItem = [];
    let orderItems = this.props.selectedOrder
      ? this.props.selectedOrder.order_items
      : [];
    const orderCombo = this.props.selectedOrder
      ? this.props.selectedOrder.order_combo_items
      : [];
    if (!_.isEmpty(orderCombo) && orderCombo[0].price > 0) {
      const { order_items } = orderCombo[0];
      orderItems = orderItems.concat(order_items);
    }
    if (!_.isEmpty(orderItems)) {
      orderItems.map((item, index) => {
        return foodListItem.push(
          <tr key={index + 1}>
            <td>{index + 1}</td>
            <td>{item.item_name}</td>
            <td>{`${this.timePassed(item.created_at)} ${this.props.trans(
              "table_list:food_list.minute_ago"
            )}`}</td>
            <td>{item.qty}</td>
            <td>{`${this.props.trans(
              "table_list:item_statuses." + item.order_item_status.id
            )}`}</td>
            <td>
              {`${utils.moneyFormat(item.price)} ${this.props.trans(
                "table_list:order.currency"
              )}`}
            </td>
          </tr>
        );
      });
    } else {
      foodListItem = (
        <tr style={{ height: "100%" }}>
          <td>{this.props.trans("table_list:food_list.table_empty_data")}</td>
        </tr>
      );
    }
    return foodListItem;
  };

  /**
   * Render combo item info
   */
  renderComboItemInfo = () => {
    /* const orderCombo = this.props.selectedOrder
      ? this.props.selectedOrder.order_combo_items
      : []; */
    const { partnerSetting, lng } = this.props;
    console.log(this.props);
    const { orderCombo } = this.state;
    if (!_.isEmpty(orderCombo) && orderCombo[0].price > 0) {
      return (
        <div className={Styles["modal-additional-info"]} style={{ color: "red" }}>
          <div><span>Đang chọn: </span>
            <span className={Styles["modal-additional-name-combo"]}>
              {orderCombo[0].qty} {orderCombo[0].combo_item_name}-</span>
            <span>
              {`${utils.moneyFormat(orderCombo[0].price - orderCombo[0].discount_value)} ${partnerSetting
                ? (lng === "vi" ? partnerSetting.currency.name_vn : lng === "en"
                  ? partnerSetting.currency.name_en : partnerSetting.currency.name_jp) : "đ"}`}
            </span></div>
          {/* <div className={Styles["title"]}>
            <span>{this.props.trans("table_list:food_list.combo_information")}:</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>{orderCombo[0].combo_item_name}</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>{orderCombo[0].qty} Suất</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>{`${orderCombo[0].order_items.length} ${this.props.trans("table_list:food_list.combo_item_count")}`}</span>
          </div>
          <div className={Styles["combo-info"]}>
            <span>
              {`${utils.moneyFormat(orderCombo[0].price)} ${this.props.trans(
                "table_list:order.currency"
              )}`}
            </span>
          </div> */}
        </div>
      );
    } else {
      /* return <div className={Styles["modal-additional-info"]}></div>; */
    }
  };

  componentDidMount() {
    this.onGetOrderByid();
  }

  /**
     * Show success  alert Swals
     * */
  showSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      title: t("takeaway.noti"),
      text: t("orderFood.successQty"),
    })
  }

  /**
   * Show erro  alert Swals
   * */
  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "error",
      title: t("orderFood.dialog"),
      text: t("orderFood.errQty"),
    });
  }

  onGetOrderByid = async () => {
    const { orderId } = this.state;
    if (orderId !== "") {
      try {
        const resOrder = await api.get(`/Order/${orderId}?language=vi`)
        if (resOrder) {
          let arr_order_tmp = [];
          let lstItemComboItem = [];
          resOrder.data.data.order_items.map(item => {
            arr_order_tmp.push(item);
          })
          resOrder.data.data.order_combo_items.map(item => {
            item.order_items.map(item1 => {
              arr_order_tmp.push(item1);
              lstItemComboItem.push(item1);
            })
          })
          this.setState({
            orderList: arr_order_tmp,
            orderCombo: resOrder.data.data.order_combo_items,
            lstItemComboItem
          })
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      this.setState({
        orderList: []
      })
    }
  }

  onEdit = (index, item) => {
    if (item.unit_item.qty_type === 1) {
      this.setState({ showQuantity: true, index })
      return
    }
    this.setState({ index, isEdit: true, checkEdit: true })
  }

  onSave = (item) => {
    const { qty, orderId } = this.state;
    const { t } = this.props;
    const notificationData = {
      "title": t("takeaway.updateFood"),
      "content": `${t('orderFood.table')} ${get("table-number")} ${t("takeaway.updateQntFood")} ${item.item_name}`,
      "action": "change_item",
      "type_notification": "1",
      "link": "",
      "body_data": {
        table_id: get("table-id") ? get("table-id") : "",
        order_id: this.state.orderId,
        item_id: item.item_id,
        qty: `${qty}`,
        is_bar: JSON.stringify(item.is_bar),
        action: "change_item"
      },
      "order_items": [
      ],
      "partner_id": "",
      "table_id": get("table-id") ? get("table-id") : "",
      "area_id": get("area-id") ? get("area-id") : "",
      "topic": get("area-id") ? `area_${get("area-id")}` : "",
      "list_user_push_noti": [],
      "is_push_noti": "1"
    }
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("orderFood.changeQty"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      const data = {
        "qty": qty
      }
      if (result.value) {
        api.put(`/Order/${orderId}/OrderItem/${item.id}?language=vi`, data).then(res => {
          if (res.data.error.internal_message === "") {
            this.showSuccess();
            this.onGetOrderByid()
            this.setState({ index: -1 })
            api_v1_1.post(`/Notification?language=vi`, notificationData);
          }
        }).catch(err => {
          console.log(err)
          this.showErr();
          this.setState({ index: -1 })
        })
      }
    });

  }

  onRunDelete = async (item) => {
    const { t } = this.props;
    const { orderId } = this.state;
    const notificationData = {
      "title": t("takeaway.deleteFood"),
      "content": `${t('orderFood.table')} ${get("table-number")} ${t("takeaway.deleteFoodNoti")} ${item.item_name}`,
      "action": "cancel_item",
      "type_notification": "1",
      "link": "",
      "body_data": {
        table_id: get("table-id") ? get("table-id") : "",
        order_id: this.state.orderId,
        item_id: item.item_id,
        action: "cancel_item",
        is_bar: JSON.stringify(item.is_bar)
      },
      "order_items": [
      ],
      "partner_id": "",
      "table_id": get("table-id") ? get("table-id") : "",
      "area_id": get("area-id") ? get("area-id") : "",
      "topic": get("area-id") ? `area_${get("area-id")}` : "",
      "list_user_push_noti": [],
      "is_push_noti": "1"
    }
    const data = {
      reason: ""
    }
    await deleteOrderItemById({ order_id: orderId, order_item_id: item.id, data });
    await this.onGetOrderByid();
    Swal.fire({
      icon: 'success',
      title: t("takeaway.noti"),
      text: t("dishManagament.swalDeleteSuccess"),
    })
    await api_v1_1.post(`/Notification?language=vi`, notificationData);
  }

  onDelete = (index, item) => {
    const { t } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("dishManagament.swalDeleteDish"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.onRunDelete(item);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t("takeaway.noti"),
            text: t("dishManagament.swalDeleteFail") + " " + error,
          });
        }
      }
    })
  }

  onCancle = () => {
    this.setState({ index: -1 })
  }

  onChangeQuantity = (qty) => {
    this.setState({
      qty,
      checkEdit: false
    })
  }

  addNumber = (itemId, value) => {
    if (value > 0) {
      const { t } = this.props
      const { orderId } = this.state;
      Swal.fire({
        title: t("takeaway.noti"),
        text: t("orderFood.changeQty"),
        icon: "info",
        showCancelButton: true,
        confirmButtonText: t("takeaway.yes"),
        cancelButtonText: t("takeaway.cancel"),
      }).then((result) => {
        const data = {
          "qty": value
        }
        if (result.value) {
          api.put(`/Order/${orderId}/OrderItem/${itemId}?language=vi`, data).then(res => {

            if (res.data.error.internal_message === "") {
              this.showSuccess();
              this.onGetOrderByid()
              this.setState({ index: -1 })
            }
          }).catch(err => {
            this.showErr();
            this.setState({ index: -1 })
          })
        }
      });
    }
  }

  onVisiblePopupQuantity = () => {
    this.setState({ showQuantity: false })
  }

  render() {
    const { lng, partnerSetting,
      trans, selectedOrder } = this.props;
    const { orderList, orderCombo, lstItemComboItem } = this.state;
    let newData = []
    if (lstItemComboItem.length > 0) {
      for (let i in lstItemComboItem) {
        newData = [...newData, lstItemComboItem[i].id]
      }
    }

    let unit_price = "";
    if (partnerSetting) {
      if (lng === "vi") {
        unit_price = partnerSetting.currency.name_vn;
      } else if (lng === "en") {
        unit_price = partnerSetting.currency.name_en;
      } else {
        unit_price = partnerSetting.currency.name_jp;
      }
    }

    const TABLE_SETTING = {
      heads: [
        {
          text: trans("takeaway.number"),
          width: "5%"
        },

        {
          text: trans("takeaway.nameFood"),
          width: "25%"
        },
        {
          text: trans("table_list:food_list.call_time_passed"),
          width: "20%"
        },
        {
          text: trans("foodProcessing.quantity"),
          width: "15%"
        },
        {
          text: trans("dishManagament.price"),
          width: "20%"
        },
        {
          text: trans("tableManagament.status"),
          width: "15%"
        }
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
          key: "name",
          width: "25%",
          render: (item, index) => {
            return newData.includes(item.id) ? (<span>{item.item_name} <span style={{ color: "red" }}>({orderCombo[0].combo_item_name})</span></span>)
              : item.item_name;
          },
        },
        {
          key: "note",
          width: "20%",
          render: (item, index) => {
            return <>{this.timePassed(item.created_at)} {this.props.trans("table_list:food_list.minute_ago")}</>
          }
        },

        {
          key: "qty",
          width: "15%",

          render: (item, i) => (
            this.state.isEdit && this.state.index === i ?
              <NumberRange min={1} max={99} defaultValue={this.state.qty === item.qty || this.state.checkEdit === true ? item.qty : this.state.qty}
                onChange={(qty) => { this.onChangeQuantity(qty) }}
              />
              : item.qty
          )
        },

        {
          key: "price",
          width: "20%",
          render: (item, i) => (
            <>{utils.moneyFormat(item.price - item.discount_value)}{unit_price}</>
          )
        },

        {
          key: "status",
          width: "15%",
          render: (item, index) => {
            if (item.order_item_status !== undefined) {
              if (this.props.trans("currentLang") === LANGUAGES.vietnam) {
                return item.order_item_status.name_vn
              } else if (trans("currentLang") === LANGUAGES.english) {
                return item.order_item_status.name_en
              } else {
                return (item.order_item_status.name_jp)
              }
            }

          }
        },
        {
          key: "acts",
          width: "10%",
          actions: [(item, i) => (
            selectedOrder && selectedOrder.order_status.id === 2 ? <></> :
              <>
                {this.state.index !== i ?
                  <>
                    <Button
                      className="s-btn e-m-right-5"
                      type='s5'
                      onClick={() => this.onEdit(i, item)}
                    >
                      <FontAwesomeIcon icon={faEdit} />&nbsp; {trans("tableManagament.edit")}
                    </Button>
                    <Button
                      className="s-btn e-m-right-5"
                      type='s2'
                      onClick={() => this.onDelete(i, item)}
                    >
                      <FontAwesomeIcon icon={faEdit} />&nbsp; {trans("tableManagament.delete")}
                    </Button>
                  </> :
                  <>
                    <Button
                      className="s-btn e-m-right-5"
                      onClick={() => this.onSave(item)}
                    >
                      <FontAwesomeIcon icon={faSave} />&nbsp;  {trans("tableManagament.save")}
                    </Button>
                    <Button
                      className="s-btn e-m-right-5"
                      type='s3'
                      onClick={() => this.onCancle()}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />&nbsp; {trans("tableManagament.cancel")}
                    </Button>
                  </>
                }
              </>
          )],
        }
      ],
    }

    return (
      <div
        className={`mfp-content ${Styles["modal-wrapper"]}`}
        style={{ minWidth: "900px", height: "70vh" }}
      >
        <div
          className={Styles["button-close"]}
          onClick={this.closeModal.bind(this)}
        ></div>
        <div className={Styles["modal-header-title"]}>
          <span>{trans("table_list:food_list.title")}</span>
        </div>
        {this.renderComboItemInfo()}
        <div
          className={`${Styles["modal-content-wrapper"]}`}
          style={{ height: "100%", maxHeight: "calc(100% - 110px)" }}
        >
          <TableData
            option={TABLE_SETTING}
            dataSources={orderList}
            textNotiNoData={trans("table_list:food_list.table_empty_data")}
          ></TableData>
        </div>
        {this.state.showQuantity && <PopupQuantity isShow={this.state.showQuantity}
          t={trans} item={orderList[this.state.index]}
          onClose={() => { this.onVisiblePopupQuantity(); this.setState({ index: -1 }) }}
          number={orderList[this.state.index].qty}
          addNumber={value => this.addNumber(orderList[this.state.index].id, value)}
          edit={true}
        />}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoodListModalContent);
