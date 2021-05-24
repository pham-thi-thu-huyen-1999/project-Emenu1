import React from "react";
import { TableData, Button, NumberRange, Loading } from "../../../components/common/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "../styles.scss";
import Swal from "../../../utils/sweetalert2";
import { withNamespaces } from "react-i18next";
import { get } from "../../../services/localStorage";
import { STATUS } from "../consts";
import { withRouter } from "react-router-dom";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions"
import { name } from "../reducers";
class OrderedList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      indexItem: 0,
      itemReqPayment: get("itemReqPayment"),
      orderDetail: this.props.orderDetail,
      newOrders: this.props.orderDetail
    }
  }
  /**
   * cancel item when handling
   * @param {*} item
   */
  onCancelOrder = (item) => {
    const { t } = this.props;
    const { orderDetail } = this.state;
    Swal.fire({
      title: `${t("requestPayment.cancelOrderFood")}`,
      input: "textarea",
      showCancelButton: true,
      inputPlaceholder: `${t("requestPayment.note")}`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("requestPayment.agree")}`,
      cancelButtonText: `${t("requestPayment.cancel")}`,
    }).then(async (result) => {
      if (result.value) {
        this.props.actions.cancelFoodOrdered({
          order_id: orderDetail.id,
          order_item_id: item.id,
          data: { reason: result.value }
        })
      }
    })
  }
  /**
   * open allow edit amount food
   * @param {*} item
   * @param {*} index
   */
  editOrder = (item, index) => {
    let { newOrders } = this.state;
    let list = newOrders.order_items
    const data = list.map(food => {
      let foodItem = {}
      if (item.id === food.id) {
        foodItem = { ...food, isEdit: true }
        return foodItem
      }
      return food
    })
    let dataAll = { ...newOrders, order_items: data }
    this.setState({
      newOrders: dataAll
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.orderDetail)
      !== JSON.stringify(prevState.orderDetail)) {
      return {
        orderDetail: nextProps.orderDetail,
        newOrders: nextProps.orderDetail
      }
    }
    return null
  }
  /**
   * cancel edit
   * @param {*} item
   * @param {*} index
   */
  onCancelEdit = (item, index) => {
    let { newOrders } = this.state
    newOrders.order_items.map(food => {
      if (item.id === food.id) {
        food.isEdit = false
      }
    })
    this.setState({
      newOrders
    })
  }
  /**
   * update status amount food
   * @param {*} item
   */
  onSaveOrder = item => {
    const { newOrders } = this.state;
    const { t } = this.props;
    Swal.fire({
      title: `${t("requestPayment.updateAmountFood")}`,
      input: "textarea",
      showCancelButton: true,
      inputPlaceholder: `${t("requestPayment.note")}`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("requestPayment.agree")}`,
      cancelButtonText: `${t("requestPayment.cancel")}`,
    }).then(async (result) => {
      if (result.value) {
        const data = {
          qty: item.qty,
          note: result.value
        }
        this.props.actions.updateAmountItem({
          order_id: newOrders.id,
          order_item_id: item.id,
          data,
          updateSuccess: this.showSuccess
        })
        newOrders.order_items.map(food => {
          if (item.id === food.id) {
            food.isEdit = false
          }
        })
        this.setState({
          newOrders
        })
      }
    })
  }

  showSuccess = text => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: text,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  /**
   * change amount food
   * @param {*} item
   * @param {*} data
   */
  onChangeAmount = (item, data) => {
    let { newOrders } = this.state
    newOrders.order_items.map(food => {
      if (item.id === food.id) {
        food.qty = data
      }
    })
    this.setState({
      newOrders
    })
  }
  componentDidMount() {
    this.props.actions.getOrderItemById({ id: this.state.itemReqPayment.order_id })
  }
  /**
   * update status delivered for customer
   * @param {*} item
   * @param {*} index
   */

  onSaveShipFood = async (item, index) => {
    const { newOrders } = this.state;
    const { t } = this.props;
    Swal.fire({
      title: `${t("requestPayment.noification")}`,
      text: `${t("requestPayment.handleFoodDone")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("requestPayment.agree")}`,
      cancelButtonText: `${t("requestPayment.cancel")}`,
    }).then(async (result) => {
      this.props.actions.updateStatusFoodOrdered({
        order_id: newOrders.id, order_item_id: item.id
      })
    })
  }
  render() {
    const { itemReqPayment, newOrders, orderDetail } = this.state;
    const { t, lng } = this.props;
    const OPTIONS = {
      heads: [
        {
          text: `${t("requestPayment.stt")}`,
          width: "10%"
        },
        {
          text: `${t("requestPayment.nameFood")}`,
          width: "25%"
        },
        {
          text: `${t("requestPayment.note")}`,
          width: "20%"
        },
        {
          text: `${t("requestPayment.amount")}`,
          width: "20%"
        },
        {
          text: `${t("requestPayment.status")}`,
          width: "25%"
        },
        {
          text: "",
          width: ""
        }
      ],
      columns: [
        {
          width: "10%",
          render: (item, index) => {
            return index + 1
          }
        },
        {
          key: "item_name",
          width: "25%"
        },
        {
          key: "note",
          width: "20%"
        },
        {
          key: "qty",
          width: "20%",
          render: (item, index) => {
            if (item.isEdit) {
              return (
                <NumberRange
                  defaultValue={item.qty}
                  min={0}
                  max={100}
                  onChange={(e) => this.onChangeAmount(item, e)}
                />
              )
            } else {
              return item.qty
            }
          }
        },
        {
          key: "order_item_status",
          width: "25%",
          render: item => {
            return lng === "en" ? item.order_item_status.name_en : lng === "vi" ? item.order_item_status.name_vn : item.order_item_status.name_jp
          }
        },
        {
          key: "",
          actions: [
            (item, index) => {
              return itemReqPayment.payment_request_status_id === STATUS.CANCEL_REQPAYMENT ? "" : (
                <>{
                  item.order_item_status.id === 1 ?
                    <>{item.isEdit ?
                      <><Button
                        className="btn-table-small e-m-right-5"
                        type="s3"
                        onClick={e => this.onCancelEdit(item, index)}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("requestPayment.cancel")}
                      </Button>
                        <Button
                          className="btn-table-small e-m-right-5"
                          onClick={e => this.onSaveOrder(item, index)}
                        >
                          {t("requestPayment.save")}
                        </Button>
                      </> : <>
                        <Button
                          className="btn-table-small e-m-right-5"
                          type="s5"
                          onClick={e => this.editOrder(item, index)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="e-m-right-5" />{t("requestPayment.edit")}
                        </Button>
                        <Button
                          className="btn-table-small e-m-right-5 btn-ship-food"
                          type="s5"
                          onClick={e => this.onSaveShipFood(item, index)}
                        >
                          <span className="e-m-right-5"><img src={require("./../../../images/giaomon.png")} /></span><span>{t("requestPayment.foodShip")}</span>
                        </Button>
                        <Button
                          className="btn-table-small e-m-right-5"
                          type="s2"
                          onClick={e => this.onCancelOrder(item)}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("requestPayment.cancelFood")}
                        </Button>
                      </>
                    }</>
                    : item.order_item_status.id === 2 ?
                      <>{item.isEdit ?
                        <>
                          <Button
                            className="btn-table-small e-m-right-5"
                            type="s3"
                            onClick={e => this.onCancelEdit(item, index)}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("requestPayment.cancel")}
                          </Button>
                          <Button
                            className="btn-table-small e-m-right-5"
                            onClick={e => this.onSaveOrder(item, index)}
                          >
                            {t("requestPayment.save")}
                          </Button>
                        </> : <>
                          <Button
                            className="btn-table-small e-m-right-5"
                            type="s5"
                            onClick={e => this.editOrder(item, index)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="e-m-right-5" />{t("requestPayment.edit")}
                          </Button>
                        </>
                      }</>
                      : item.order_item_status.id === 3 ?
                        <>{item.isEdit ?
                          <Button
                            className="btn-table-small e-m-right-5"
                            type="s3"
                            onClick={e => this.onCancelEdit(item, index)}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("requestPayment.cancel")}
                          </Button> : <Button
                            className="btn-table-small e-m-right-5"
                            type="s5"
                            onClick={e => this.editOrder(item, index)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="e-m-right-5" />{t("requestPayment.edit")}
                          </Button>
                        }</>
                        : item.order_item_status.id === 4 ?
                          <>{item.isEdit ?
                            <>
                              <Button
                                className="btn-table-small e-m-right-5"
                                type="s3"
                                onClick={e => this.onCancelEdit(item, index)}
                              >
                                <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("requestPayment.cancel")}
                              </Button>
                              <Button
                                className="btn-table-small e-m-right-5"
                                onClick={e => this.onSaveOrder(item, index)}
                              >
                                {t("requestPayment.save")}
                              </Button>
                            </> : <>
                              <Button
                                className="btn-table-small e-m-right-5"
                                type="s5"
                                onClick={e => this.editOrder(item, index)}
                              >
                                <FontAwesomeIcon icon={faEdit} className="e-m-right-5" />{t("requestPayment.edit")}
                              </Button>
                              <Button
                                className="btn-table-small e-m-right-5 btn-ship-food"
                                type="s5"
                                onClick={e => this.onSaveShipFood(item, index)}
                              >
                                <span className="e-m-right-5"><img src={require("./../../../images/giaomon.png")} /></span><span>{t("requestPayment.foodShip")}</span>
                              </Button>
                            </>}
                          </> : ""}
                </>
              )
            }
          ]
        }
      ]
    }
    return (
      <>{JSON.stringify(newOrders) !== JSON.stringify({}) ?
        <div className="food-ordered-list">
          <Loading show={this.props.isLoading} />
          <div className="content-lst">
            <div className="title-ordered-lst e-flex">
              <div className="code e-flex item-center">
                <span>{t("requestPayment.orderCode")}: {newOrders.order_no}</span>
              </div>
              <div className="title"><span>{t("requestPayment.lstOrderFood")} {itemReqPayment.order.table.name}</span></div>
            </div>
            <div className="table-lst-ordered">
              {
                newOrders.order_items.length > 0 ? <TableData
                  dataSources={newOrders.order_items}
                  option={OPTIONS}
                  textNotiNoData={t("dishManagament.notiNodata")}
                >
                </TableData> : <div className="e-flex content-center not-order">Chưa order món</div>
              }
            </div>
            <div className="btn-lst e-flex item-center content-center">
              <Button type="s3"
                className="e-m-right-10"
                onClick={() => window.history.back()}
              >{t("requestPayment.back")}</Button>
              <Button
                disabled={itemReqPayment.payment_request_status_id === STATUS.CANCEL_REQPAYMENT}
                onClick={() => { }}
              >{t("requestPayment.orderMoreFood")}
              </Button>
            </div>
          </div>
        </div> : <div className="e-flex e-content-center">AAAA{JSON.stringify(newOrders)
          !== JSON.stringify({})}</div>
      }</>
    )
  }
}

var mapStateToProps = state => {
  return {
    ...state[name]
  }
}
var mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps))(withNamespaces()(OrderedList));