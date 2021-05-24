import React, { Component } from "react";
import Swal from "./../../../utils/sweetalert2";
import * as CONSTS from './../constants';
import { Button, TableData } from "../../../components/common";
import moment from "moment";

export default class FoodAccourdingToTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: props.order,
      selectedOrder: props.selectedOrder,
    }
  }

  showErrNoAreaSubcribe = () => {
    Swal.fire({
      icon: 'error',
      title: this.props.t("foodProcessing.alertTitle"),
      text: this.props.t("foodProcessing.txtNoAreaSubcribe"),
    })
  }
  /**
   * Thông báo xác nhận món đã được hoàn thành
   */
  showAlert = (orderItem) => {
    const { t, areaIdArr, userId, subcribeAreaList } = this.props;
    const { selectedOrder } = this.state;
    Swal.fire({
      title: t("foodProcessing.alertTitle"),
      text: t("foodProcessing.confirmCompletedOrder"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("foodProcessing.confirmButton"),
      cancelButtonText: t("foodProcessing.cancelButton"),
    }).then((result) => {
      if (result.value) {
        // Chuẩn bị dữ liệu cho cập nhật món
        const data = {
          order_id: selectedOrder.id,
          order_item_id: orderItem.id,
        }
        // Chuẩn bị dữ liệu cho phần get lại danh sách món ăn trong tab theo món
        const dataGet = {
          selectedAreaIndex: areaIdArr,
          order_item_status_id: CONSTS.WAITING_ORDER,
        }

        let area_id = "";
        if (areaIdArr.length > 0) {
          for (let i = 0; i < areaIdArr.length; i++) {
            if (subcribeAreaList.includes(areaIdArr[i])) {
              area_id = areaIdArr[i];
              break;
            }
          }
        } else {
          area_id = subcribeAreaList.length > 0 ? subcribeAreaList[0] : area_id;
        }
        if (area_id === "") {
          this.showErrNoAreaSubcribe();
          return;
        }
        // Chuẩn bị dữ liệu để tạo notification
        const notificationData = {
          "title": t("foodProcessing.infoFinishFood"),
          "content": `${t("foodProcessing.dish")} ${orderItem.item && orderItem.item.name ? orderItem.item.name : ""} ${t("foodProcessing.isFinished")}`,
          "action": "finished_cooking",
          "type_notification": "1",
          "link": "",
          "body_data": 
          {
            table_id: selectedOrder.table && selectedOrder.table.id ? selectedOrder.table.id : "",
            order_id: selectedOrder.id ? selectedOrder.id : "",
            item_id: orderItem.id ? orderItem.id : "",
            "action": "finished_cooking",
          },
          "partner_id": "",
          "table_id": "",
          "topic": `area_${area_id}`,
          "list_user_push_noti": [
            userId
          ],
          "is_push_noti": "1"
        }
        this.props.actions.updateOrderItemIsCompleted({
          data,
          dataGet,
          callback_success: this.showOk,
          callback_fail: this.showErr,
          notificationData,
          typeTab: CONSTS.TAB_ORDER
        });

      }
    })
  }

  showOk = () => {
    Swal.fire({
      icon: 'success',
      text: this.props.t("foodProcessing.textSuccess"),
      title: this.props.t("foodProcessing.alertTitle")
    })
  }

  showErr = () => {
    Swal.fire({
      icon: 'error',
      title: this.props.t("foodProcessing.alertTitle"),
      text: this.props.t("foodProcessing.textFail"),
    })
  }

  /**
   * Thông báo xác nhận món đã hết
   */
  showAlertOff = (orderItem) => {
    const { t, areaIdArr, userId, subcribeAreaList } = this.props;
    const { selectedOrder } = this.state;
    Swal.fire({
      title: t("foodProcessing.alertTitle"),
      text: t("foodProcessing.confirmOutOffOrder"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("foodProcessing.confirmButton"),
      cancelButtonText: t("foodProcessing.cancelButton"),
    }).then((result) => {
      if (result.value) {
        // Chuẩn bị dữ liệu cho cập nhật món
        const data = {
          order_id: selectedOrder.id,
          order_item_id: orderItem.id,
        }
        // Chuẩn bị dữ liệu cho phần get lại danh sách món ăn trong tab theo món
        const dataGet = {
          selectedAreaIndex: areaIdArr,
          order_item_status_id: CONSTS.WAITING_ORDER,
        }
        let area_id = "";
        if (areaIdArr.length > 0) {
          for (let i = 0; i < areaIdArr.length; i++) {
            if (subcribeAreaList.includes(areaIdArr[i])) {
              area_id = areaIdArr[i];
              break;
            }
          }
        } else {
          area_id = subcribeAreaList.length > 0 ? subcribeAreaList[0] : area_id;
        }
        if (area_id === "") {
          this.showErrNoAreaSubcribe();
          return;
        }

        // Chuẩn bị dữ liệu để tạo notification
        const notificationData =
        {
          "title": t("foodProcessing.infoNoFood"),
          "content": `${t("foodProcessing.infoChef")} ${orderItem.item && orderItem.item.name ? orderItem.item.name : ""} ${t("foodProcessing.pleaseOrderAgain")}`,
          "action": "out_of_food",
          "type_notification": "3",
          "link": "",
          "body_data": {
            table_id: selectedOrder.table && selectedOrder.table.id ? selectedOrder.table.id : "",
            order_id: selectedOrder.id ? selectedOrder.id : "",
            item_id: orderItem.id ? orderItem.id : "",
            "action": "out_of_food",
          },
          "partner_id": "",
          "table_id": "",
          "area_id": selectedOrder.table && selectedOrder.table.area && selectedOrder.table.area.id ? selectedOrder.table.area.id : "",
          "topic": `area_${area_id}`,
          "list_user_push_noti": [
            userId
          ],
          "is_push_noti": "1"
        }

        this.props.actions.updateOrderItemIsOff({
          data,
          dataGet,
          callback_success: this.showOkOff,
          callback_fail: this.showErrOff,
          notificationData,
          typeTab: CONSTS.TAB_ORDER
        });

      }
    })
  }

  showOkOff = () => {
    Swal.fire({
      icon: 'success',
      text: this.props.t("foodProcessing.textSuccess"),
      title: this.props.t("foodProcessing.alertTitle")
    })
  }

  showErrOff = () => {
    Swal.fire({
      icon: 'error',
      title: this.props.t("foodProcessing.alertTitle"),
      text: this.props.t("foodProcessing.textFail"),
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.order) !== JSON.stringify(prevState.order) || JSON.stringify(nextProps.selectedOrder) !== JSON.stringify(prevState.selectedOrder)
    ) {
      return {
        order: nextProps.order,
        selectedOrder: nextProps.selectedOrder
      };
    }
    return null;
  }

  render() {
    const { order, selectedOrder } = this.state;
    const { t } = this.props
    const TABLE_SETTING = {
      heads: [
        {
          className: 'stt',
          text: t("foodProcessing.no"),
          width: '4%'
        },
        {
          className: 'food-name',
          text: t("foodProcessing.nameFood"),
          width: '30%'
        },
        {
          className: 'quantity',
          text: t("foodProcessing.quantity"),
          width: '25%',
          overflow: false,
        },
        {
          className: 'note',
          text: t("foodProcessing.addNote"),
          width: '25%',
          overflow: false,
        },
        {
          className: 'time',
          text: t("foodProcessing.time"),
          width: '16%',
          overflow: false,
        },
        {
          className: '',
          text: ''
        }

      ],
      columns: [
        {
          key: 'id',
          width: '4%',
          render: (item, index) => {
            return index + 1;
          },

        },
        {
          key: 'item_name',
          width: '30%',
          overflow: false,
          render: (item, index) => {
            return (
              <div key={index} >
                <img className="food-image" src={item.image || require("../../../images/logo-omenu.png")} alt="" />
                <span className="food-name-txt">{item.item_name ? item.item_name : "Không có tên"}</span>
              </div>
            )
          },
        },
        {
          key: 'qty',
          width: '25%',
        },
        {
          key: 'note',
          width: '25%',
          overflow: false,
        },
        {
          key: 'time',
          width: '16%',
          overflow: false,
          render: (item, index) => {
            return (
              <>
                {
                  moment(item.created_at).fromNow()
                }
              </>
            )
          },

        },
        {
          key: '',
          className: 'btn-order',
          actions: [
            (orderItem) => (
              <Button style={{ marginRight: "0.5em" }}
                onClick={() => this.showAlertOff(orderItem)}
              >{t("foodProcessing.noFood")}</Button>

            ),
            (orderItem) => (
              <Button type='s2' style={{ marginRight: "0.5em" }} onClick={() => this.showAlert(orderItem)}>{t("foodProcessing.finish")}</Button>
            ),
            (orderItem) => (
              <Button type='s1'
                  onClick={() => this.showAlertOff(orderItem)}
                >{t("foodProcessing.txtStartCook")}</Button>
            )
          ],

        }
      ]
    }

    let dataSources = [];
    // Lọc order lấy những món ăn đang chờ xử lý
    if (order && order.length > 0) {
      dataSources = order.filter(orderItem => orderItem.order_item_status_id === CONSTS.WAITING_ORDER ||  orderItem.order_item_status && orderItem.order_item_status.id === CONSTS.WAITING_ORDER)
    }

    return (
      <>
        <TableData
          className="accourding-tbl-order-food"
          option={TABLE_SETTING}
          dataSources={dataSources}
          innerClass="tbl-order-food__row"
          textNotiNoData={t("dishManagament.notiNodata")}
        ></TableData>
      </>
    );
  }
}
