import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle, faArrowLeft, faEdit, faSave
} from "@fortawesome/free-solid-svg-icons";
import "../../../../TakeAwayScreen/components/Category.scss";
import { NumberRange, TableData, Dialog, Button, } from "../../../../../components/common";
import Swal from "../../../../../utils/sweetalert2";
import api from "./../../../../../services/api";
import api_v1_1 from "./../../../../../services/api_v1_1";
import './../../../scss/OrderFoodList.scss';
import { LANGUAGES } from "../../../../../consts/constants";
import notFound from './../img/no-data.png'
import PopupQuantity from "./PopupQuantity";
import Loading from "../../../../../components/common/Loading";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { name } from "../../../reducers";
import * as action from "../../../actions";
import { deleteOrderItemById } from "../../../../../api/order";
import { get } from "../../../../../services/localStorage";
import utils from "../../../../../utils/formats";
import _ from "lodash";
class FoodListOrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupConfirm: false,
      orderList: [],
      index: -1,
      isEdit: false,
      qty: 1,
      checkEdit: false,
      showQuantity: false,
      orderId: this.props.orderIdFoodList ? this.props.ordderIdFoodList : "",
      isLoading: true,
      onGetOrderByid: this.onGetOrderByid.bind(this),
      orderItemById: this.props.orderItemById ? this.props.orderItemById : {},
      orderCombo: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderIdFoodList !== prevState.orderId || JSON.stringify(nextProps.orderItemById) !== JSON.stringify(prevState.orderItemById) ) {
      prevState.onGetOrderByid();
      return {
        orderId: nextProps.orderIdFoodList,
        orderItemById: nextProps.orderItemById
      }
    }
    return null;
  }


  componentDidMount = async() => {
    await this.onGetOrderByid();
    await setTimeout(this.setState({ isLoading: false }), 3000);
  }

  /**
 * Render combo item info
 */
  renderComboItemInfo = () => {
    const { t } = this.props;
    const { orderCombo } = this.state;
    if (!_.isEmpty(orderCombo) && orderCombo[0].price > 0) {
      return (
        <div className={`modal-additional-info-inner`}> {/* ${!_.isEmpty(orderCombo) && orderCombo[0].price > 0 ? null : "modal-additional-info-hidden"} */}
          <div className="title">
            <span>{t("table_list:food_list.combo_information")}:</span>
          </div>
          <div className="combo-info">
            <span>{orderCombo[0].combo_item_name}</span>
          </div>
          <div className="combo-info">
            <span>{orderCombo[0].qty} Suất</span>
          </div>
          <div className="combo-info">
            <span>{`${orderCombo[0].order_items.length} ${t("table_list:food_list.combo_item_count")}`}</span>
          </div>
          <div className="combo-info">
            <span>
              {`${utils.moneyFormat(orderCombo[0].price)} ${t(
                "table_list:order.currency"
              )}`}
            </span>
          </div>
        </div>
      );
    } else {
      /* return <div className="modal-additional-info-inner"></div>; */
    }
  };

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
    /* const { orderItemById } = this.props; */
    if (orderId && orderId !== "") {
      try {
        const resOrder = await api.get(`/Order/${orderId}?language=vi`);
        if (resOrder) {
          let arr_order_tmp = [];
            resOrder.data.data.order_items.map(item => {
              arr_order_tmp.push(item);
            })
            resOrder.data.data.order_combo_items.map(item => {
              item.order_items.map(item1 => {
                arr_order_tmp.push(item1);
              })
            })
            this.setState({
              orderList: arr_order_tmp,
              orderCombo: resOrder.data.data.order_combo_items
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

  onEdit = (index,item) => {
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
        order_id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId),
        item_id: item.item_id,
        qty: `${qty}`,
        action: "change_item",
        is_bar: JSON.stringify(item.is_bar),
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

  onRunDelete = async(item) => {
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
        order_id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId),
        item_id: item.item_id,
        action: "cancel_item",
        is_bar: JSON.stringify(item.is_bar),
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
    //load lai data order
    /* await this.props.actions.getOrderItemById({ id: get("check-table") === true ? this.props.orderId : (get("order-id") ? get("order-id") : this.props.orderId) }); */
    await this.onGetOrderByid();
    Swal.fire({
      icon: 'success',
      title: t("takeaway.noti"),
      text: t("dishManagament.swalDeleteSuccess"),
    })
    await api_v1_1.post(`/Notification?language=vi`, notificationData);
  }

  onDelete = (index,item) => {
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
        } catch(error) {
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
      const {orderId} = this.state;
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
    const {
      orderList,
      orderCombo
    } = this.state;

    const {
      show,
      close,
      tblNum,
      // dishList,
      t
    } = this.props;

    let newData = []
    if (orderCombo.length > 0) {
      const lstItemCombos = orderCombo[0].order_items;
      for (let i in lstItemCombos) {
        newData = [...newData, lstItemCombos[i].id]
      }
    }

    const { lng, partnerSetting } = this.props;
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
          text: t("takeaway.number"),
          width: "5%"
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
          text: t("foodProcessing.quantity"),
          width: "15%"
        },
        {
          text: t("dishManagament.price"),
          width: "20%"
        },
        {
          text: t("tableManagament.status"),
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
            return item.note;
          },
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
            <>{utils.moneyFormat(item.price)} {unit_price}</>
          )
        },

        {
          key: "status",
          width: "15%",
          render: (item, index) => {
            if (item.order_item_status !== undefined) {
              if (this.props.t("currentLang") === LANGUAGES.vietnam) {
                return item.order_item_status.name_vn
              } else if (t("currentLang") === LANGUAGES.english) {
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

            <>
              {this.state.index !== i ?
              <>
                  <Button
                    className="s-btn e-m-right-5"
                    type='s5'
                    onClick={() => this.onEdit(i,item)}
                  >
                    <FontAwesomeIcon icon={faEdit} />&nbsp; {t("tableManagament.edit")}
                  </Button>
                  <Button
                    className="s-btn e-m-right-5"
                    type='s2'
                    onClick={() => this.onDelete(i,item)}
                  >
                    <FontAwesomeIcon icon={faEdit} />&nbsp; {t("tableManagament.delete")}
                  </Button>
                </>
                :
                <>
                  <Button
                    className="s-btn e-m-right-5"
                    onClick={() => this.onSave(item)}
                  >
                    <FontAwesomeIcon icon={faSave} />&nbsp;  {t("tableManagament.save")}
                  </Button>
                  <Button
                    className="s-btn e-m-right-5"
                    type='s3'
                    onClick={() => this.onCancle()}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />&nbsp; {t("tableManagament.cancel")}
                  </Button>
                </>
              }

            </>
          )],
        }
      ],
    }

    return (
      <div className="custom-main-popup" >
        <Loading show={this.state.isLoading} />
        <div className="hori-header">
          <div className="e-container">
            <div className="top-header">
              <div className="btn-back" onClick={close}><FontAwesomeIcon style={{ fontSize: "24px" }} icon={faArrowLeft} /></div>
              <div className="text-header">
                {t("requestPayment.listOrderedFood")}
              </div>
              <div className="tbl-name">{t('orderFood.table')} {tblNum}</div>
            </div>
          </div>
        </div>
        {this.renderComboItemInfo()}
        <div className="body-food">
          <div className="e-container">
            <div show={show} className={`${!_.isEmpty(orderCombo) && orderCombo[0].price > 0 ? "PopupSelectedList" : "PopupSelectedList-no-combo"}`}>
              {orderList.length > 0 ?
                <TableData
                  option={TABLE_SETTING}
                  dataSources={orderList}
                  textNotiNoData={t("bookingTables.notiNodata")}
                >
                </TableData> :
                <div className="empty-data">
                  <img src={notFound} />
                  <p> {t("orderFood.notOrder")}</p>
                </div>
              }
            </div>

              <aside className="acts text-right" style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                <Button
                  type="s3"
                  className="e-m-right-10"
                  onClick={this.props.close}
                >
                  {t("takeaway.back")}
                </Button>
                {orderList.length > 0 && <Button
                  onClick={this.props.close}
                >
                  {t("orderFood.orderMore")}
                </Button>}
              </aside>
          </div>
        </div>

        {this.state.showQuantity && <PopupQuantity isShow={this.state.showQuantity}
          t={t} item={orderList[this.state.index]}
          onClose={() => {this.onVisiblePopupQuantity(); this.setState({index: -1})}}
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
)(withNamespaces()(FoodListOrderModal));