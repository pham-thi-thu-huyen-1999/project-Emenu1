import React, { Component } from "react";
import Button from "./../../../components/common/Button";
import Swal from "./../../../utils/sweetalert2";
import moment from "moment";
import * as CONSTS from "./../constants"
export default class PopupDishDetail extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
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
  showAlertComplete = (orderItem) => {
    const { t, areaIdArr, userId,  subcribeAreaList } = this.props;
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
          order_id: orderItem.order_id,
          order_item_id: orderItem.id
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
          "content": `${t("foodProcessing.dish")} ${orderItem.item_name} ${t("foodProcessing.isFinished")}`,
          "action": "finished_cooking",
          "type_notification": "1",
          "link": "",
          "body_data": {
            table_id: orderItem.order && orderItem.order.table && orderItem.order.table.id ? orderItem.order.table.id : "",
            order_id: orderItem.order_id ? orderItem.order_id : "",
            item_id: orderItem.id ? orderItem.id : "",
            "action": "finished_cooking",
          },
          "partner_id": "",
          "topic": `area_${area_id}`,
          "list_user_push_noti": [
            userId
          ],
          "is_push_noti": "1"
        }
        this.props.actions.updateOrderItemIsCompleted({
          data,
          dataGet,
          callback_success: this.showOkComplete,
          callback_fail: this.showErrComplete,
          notificationData,
          typeTab: CONSTS.TAB_DISH
        });
        this.props.hide();
      }
    })
  }

  showOkComplete = () => {
    Swal.fire({
      icon: 'success',
      text: this.props.t("foodProcessing.textSuccess"),
      title: this.props.t("foodProcessing.alertTitle")
    })
  }

  showErrComplete = () => {
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
    const { t, areaIdArr, subcribeAreaList, userId } = this.props;
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
          order_id: orderItem.order_id,
          order_item_id: orderItem.id
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
          "content": `${t("foodProcessing.infoChef")} ${orderItem.item_name} ${t("foodProcessing.pleaseOrderAgain")}`,
          "action": "out_of_food",
          "type_notification": "3",
          "link": "",
          "body_data": {
            table_id: orderItem.order && orderItem.order.table ? orderItem.order.table.id :"",
            order_id: orderItem.order_id,
            item_id: orderItem.id ? orderItem.id : "",
            "action": "out_of_food",
          },
          "partner_id": "",
          "table_id": "",
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
          typeTab: CONSTS.TAB_DISH
        });
        this.props.hide();
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

  render() {
    const { hide, orderFoodItem, t } = this.props;
    return (
      <div id="popup-order-dish-detail" className="popup">
        <div
          id="popup-dish-detail"
          className=" popup-box popup-add-new "
          style={{ top: "15%", maxWidth: "650px", padding: "15px 30px" }}
          ref={this.wrapperRef}
        >
          <button
            style={{ left: "592px" }}
            title="Close (Esc)"
            type="button"
            className="mfp-close"
            onClick={hide}
          >
            ×
            </button>
          <h3 className="main-lbl text-center">
            {t("foodProcessing.popupTitle")}
          </h3>
          <div className="tbl-info container" >
            <div className="inner clear e-row" style={{ backgroundColor: "#e0f7fa", fontSize: "1.4em", borderRadius: "10px" }}>
              <aside className="desc fl e-col-9" >
                <div className="e-row">
                  <div className="e-col-12 e-row e-p-top-20 ">
                    <div className="e-col-1"></div>
                    <div className="e-col-4 text-gray text-bold">{`${t("foodProcessing.dishName")}`}</div>
                    <div className="e-col-1"></div>
                    <div className="e-col-6">{orderFoodItem.item_name}</div>
                  </div>
                  <div className="e-col-12 e-row e-p-top-20">
                    <div className="e-col-1"></div>
                    <div className="e-col-4 text-gray text-bold">{`${t("foodProcessing.quantity")} `}</div>
                    <div className="e-col-1"></div>
                    <div className="e-col-6">{orderFoodItem.qty}</div>
                  </div>
                  <div className="e-col-12 e-row e-p-top-20">
                    <div className="e-col-1"></div>
                    <div className="e-col-4 text-gray text-bold">{`${t("foodProcessing.numberTable")} `}</div>
                    <div className="e-col-1"></div>
                    <div className="e-col-6">{orderFoodItem.order.table ? orderFoodItem.order.table.name : ""}</div>
                  </div>
                  <div className="e-col-12 e-row e-p-top-20">
                    <div className="e-col-1"></div>
                    <div className="e-col-4 text-gray text-bold">{`${t("foodProcessing.addNote")} `}</div>
                    <div className="e-col-1"></div>
                    <div className="e-col-6 word-wrap">{orderFoodItem.note}</div>
                  </div>
                  <div className="e-col-12 e-row e-p-top-20 e-p-bottom-20">
                    <div className="e-col-1"></div>
                    <div className="e-col-4 text-gray text-bold">{`${t("foodProcessing.time")} `}</div>
                    <div className="e-col-1"></div>
                    <div className="e-col-6">
                      {
                        moment(orderFoodItem.created_at).fromNow()
                      }
                    </div>
                  </div>
                </div>
              </aside>
              <aside className="fig fl flex-view e-col-3" >
                <div className="e-col-12 e-row">
                  <div className="e-col-10 e-flex item-center">
                    <img 
                    src={orderFoodItem.image ? orderFoodItem.image : require("../../../images/logo-omenu.png")} alt="" />
                  </div>
                  <div className="e-col-2">

                  </div>

                </div>
              </aside>
            </div>
            <aside>

            </aside>

            <aside className="bot-acts flex-view middle e-m-top-15" >
              <span></span>
              <div className="grp-btns flex-view middle">
                <Button style={{ marginRight: "1em" }}
                  onClick={() => this.showAlertOff(orderFoodItem)}
                >{t("foodProcessing.noFood")}</Button>
                <Button type='s2' style={{ marginRight: "1em" }} onClick={() => this.showAlertComplete(orderFoodItem)}>{t("foodProcessing.finish")}</Button>
                <Button type='s1'
                  onClick={() => this.showAlertOff(orderFoodItem)}
                >{t("foodProcessing.txtStartCook")}</Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
}
