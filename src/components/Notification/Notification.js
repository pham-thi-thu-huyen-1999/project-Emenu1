import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { name } from "./reducers";
import * as action from "./actions";
import * as callStaffAction from "../../containers/TableList/actions"
import * as callKitchenAction from "../../containers/FoodListIsProcessing/actions"
import * as callTableManagementAction from "../../containers/TableListManagement/actions"
import * as callTableListAction from "../../containers/TableList/actionTypes"
import { Button } from "../common";
import "./Notification.scss";
import { messaging } from '../../services/firebaseInit';
import Swal from '../../utils/sweetalert2';
import { withNamespaces } from "react-i18next";
import { STATUS_ACTION_CONFIRM, STATUS_ACTION_CANCEL, TYPE_NOTI, STATUS_CONFIRM } from "../../consts/settings/notification";
import { AreaReducerName } from "../../containers/AreaManagement/reducers";
import * as areaActions from "../../containers/AreaManagement/actions";
import * as bookingActions from "../../containers/BookingTable/actions";
import common from "../../utils/common";
import { get } from "../../services/localStorage";

const handleTime = (created_at, t) => {
  var today = new Date();
  const date = new Date(created_at);
  const millisecond = today.getTime() - date.getTime();
  const hours = Math.floor(millisecond / 3600000);
  const minutes = Math.floor((millisecond % 3600000) / 60000);
  const seconds = Math.floor((millisecond % 120000) / 1000);
  const day = Math.round(hours / 24);
  if (day === 0) {
    if (hours === 0 && minutes === 0) {
      return `${seconds} ${t("notifications.secondsAgo")}`;
    } else if (hours === 0) {
      return `${minutes} ${t("notifications.minusAgo")}`;
    } else {
      return `${hours} ${t("notifications.hoursAgo")}`;
    }
  }
  else {
    return `${day} ${t("notifications.dayAgo")}`;
  }
};

const iconEye = <FontAwesomeIcon icon={faEye} color="#e56911" />;
const Noti = ({ children, notification, cooked, more, handleChangeAction, t }) => {
  const disabled = notification.status_action === STATUS_ACTION_CONFIRM
    || notification.status_action === STATUS_ACTION_CANCEL;
  return (
    <div className={notification.status === 1 ? "notification noti-readed" : "notification"}>
      <div className="e-row title-noti e-flex item-center">
        <div className="e-col-8 e-p-right-2">
          <span className="text-title">{children}</span>
        </div>
        <div className="time e-col-4">{handleTime(notification.updated_at, t)}</div>
      </div>
      <div className="content-noti">
        {notification.content}
      </div>
      {notification.status === 1 && notification.status !== 0 ? "" :
        notification.action === "request_into_table" ?
          <div className="text-center e-flex item-center content-center">
            <Button type="s4"
              style={{ marginRight: 10 }}
              disabled={disabled}
              onClick={() => handleChangeAction(notification, STATUS_ACTION_CONFIRM)}
            >{t("notifications.confirm")}
            </Button>
            <Button type="s2"
              disabled={disabled}
              onClick={() => handleChangeAction(notification, STATUS_ACTION_CANCEL)}
            >{t("notifications.cancel")}</Button>
          </div> :
          notification.type_notification === TYPE_NOTI.JUST_SHOW_CONTENT ?
            <div className="text-center e-flex item-center content-center">
              <Button
                type="s4"
                onClick={() => handleChangeAction(notification, STATUS_ACTION_CONFIRM)}
              >OK
              </Button>
            </div> :
            notification.type_notification === TYPE_NOTI.GUEST_ORDER ? (
              <div className="text-center e-flex item-center content-center">
                <Button
                  type="s4"
                  onClick={() => handleChangeAction(notification, STATUS_ACTION_CONFIRM)}
                >OK
              </Button>
              </div>
            ) : (
              <div className="text-center e-flex item-center content-center">
                <Button type="s4"
                  style={{ marginRight: 10 }}
                  disabled={disabled}
                  onClick={() => handleChangeAction(notification, STATUS_ACTION_CONFIRM)}
                >{t("notifications.confirm")}
                </Button>
                <Button type="s2"
                  disabled={disabled}
                  onClick={() => handleChangeAction(notification, STATUS_ACTION_CANCEL)}
                >{t("notifications.cancel")}</Button>
              </div>
            )
      }
    </div>
  )
};
class Notification extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.state = {
      notifications: props.notifications,
      topic: null
    }
  }

  componentDidMount = () => {
    const { actions, total } = this.props;
    this.props.parentCallback({
      noti: this.props.notifications,
      action: actions,
      total: total
    })
    document.addEventListener("click", this.handleClick);
    this.props.actions.getListNotiUnread();

    // Event Focus tab browser
    window.addEventListener("focus", this.onFocus);
    let infoToken = common.decodeToken(get("accessToken"));
    this.props.actions.getListAreaByPartnerId({
      partner_id: infoToken.partner_id,
    });
  }

  componentDidUpdate() {
    if ((this.state.topic === null || (this.props.selectedArea !== null && this.state.topic !== this.props.selectedArea.id)) && (this.props.selectedArea !== null || this.props.listAreaByPartner.length > 0)) {
      let topic = this.props.selectedArea !== null
        && this.props.selectedArea.id !== null
        ? this.props.selectedArea.id : this.props.listAreaByPartner[0].id;
      this.props.actions.getNotifications({ topic: topic });
      this.setState({
        topic: topic
      })
    }
  }


  /**
   * Focus tab web
   */
  onFocus = () => {
    if (this.state.topic !== null) {
      this.props.actions.getNotifications({ topic: this.state.topic });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.notifications) !== JSON.stringify(prevState.notifications)) {
      let newData = [];
      let data = [];
      nextProps.parentCallback({ noti: nextProps.notifications, action: nextProps.actions, total: nextProps.total })
      const reducer = (acc, notify) => {
        const dataPar = notify.body_data
        if (acc[notify.body_data.table_id + '_' + notify.action]) {
          acc[dataPar.table_id + '_' + notify.action] = [notify, ...acc[dataPar.table_id + '_' + notify.action]]
        } else {
          newData.push(notify)
          acc[dataPar.table_id + '_' + notify.action] = [notify]
        }
        return acc
      };
      let list = nextProps.notifications.reduce(reducer, {})
      newData.map(item => {
        const dataPar = item.body_data
        data.push({
          ...item,
          amount: list[dataPar.table_id + '_' + item.action].length
        })
        return item
      })
      return {
        notifications: data
      }
    }
    return null
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }
  handleClick = (event) => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }

    if (
      !this.wrapperRef.current.contains(target) &&
      target.outerHTML !== `<img src="/images/bell2.png" alt="notification_ico" class="notification-icon">` && target.id !== "icon-noti-table-list"
    ) {
      this.props.close();
    }
  };
  showSuccess = () => {
    this.props.actions.getNotifications({ topic: this.state.topic })
    this.props.actions.getNotificationsList({ topic: this.state.topic })
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("notifications.updateSuccess")}`,
      showConfirmButton: true
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("notifications.error")}`,
      text: `${t("notifications.reqCheckAgain")}`
    })
  }
  /**
   * update status noti
   * @param {*} noti
   * @param {*} statusAction
   */
  handleChangeAction = (noti, statusAction) => {
    const { t, notifications } = this.props;
    const newData = noti.body_data;
    let lstNotisUpdateStatus = [];
    notifications.map(itemNoti => {
      if (noti.action === itemNoti.action
        && noti.body_data.table_id === itemNoti.body_data.table_id) {
        lstNotisUpdateStatus.push(itemNoti);
      }
    })
    if (statusAction === STATUS_ACTION_CANCEL) {
      this.props.actions.deleteNotification({
        notification_id: noti.id,
        topic: this.state.topic,
      })
    } else {
      // Swal.fire({
      //   title: `${t("notifications.youSure")}`,
      //   text: `${t("notifications.confirmUpdate")}`,
      //   icon: "question",
      //   showCancelButton: true,
      //   confirmButtonText: `${t("notifications.agree")}`,
      //   cancelButtonText: `${t("notifications.cancel")}`,
      // }).then(async (result) => {
      //   if (result.value) {
      this.props.actions.updateStatusNoti({
        notification_id: noti.notification_create_id,
        status: STATUS_CONFIRM,
        topic: this.state.topic,
        lstNotisUpdateStatus
      })
      if (noti.action === "request_into_table") {
        this.props.createOrder({
          notification_id: noti.notification_create_id, order: newData,
          updateSuccess: this.showSuccess,
          updateFail: this.showErr
        })
      } else {
        this.props.actions.changeActionStatus({
          notification_id: noti.notification_create_id,
          status_action: statusAction,
          updateSuccess: this.showSuccess,
          updateFail: this.showErr,
          topic: this.state.topic
        })
      }
    }
  }
  insertNoti = (noti) => {
    if (this.state.topic) {
      this.props.actions.getNotifications({ topic: this.state.topic });
      this.props.actions.getNotificationsList({ topic: this.state.topic })
    }
  }
  // loadMore = index => {
  //   if (index < this.props.total) {
  //     this.props.actions.getNotifications({ index });
  //   }
  // }
  onScroll = (event) => {
    const { target } = event;
    const { scrollHeight, clientHeight, scrollTop } = target;
    const { indexNoti, total } = this.props;
    if (clientHeight + scrollTop >= scrollHeight) {
      if (indexNoti < total) {
        this.props.actions.getNotifications({ topic: this.state.topic, index: indexNoti });
      }
    }
  };

  /**
   * neu trung return true
   * @param {*} table_id
   */
  render() {
    const { show, t } = this.props;
    const { notifications } = this.state;
    if (messaging != null) {
      new Promise((resolve) => {
        messaging.onMessage((payload) => {
          console.log('Message received: ', payload)
          if (payload.data) {
            this.props.onCallNoti()
            // Update màn hình bếp và bar khi có noti
            this.props.actions.updateKitchenBar(payload);
            // Update màn hình danh sách bàn khi có noti
            this.props.actions.updateTableByNoti(payload);
            // Update màn hình danh sách bàn gọi order khi có noti
            this.props.actions.updateIconTableByNoti(payload);
            // Update số lượng noti trên button của header
            this.props.actions.updateHeaderByNoti(payload);
            // Add and update booking
            if (payload.data.action === "reservation") {
              if (payload.data.booking_id !== "") {
                this.props.actions.updateBookingTableById(payload);
              }
            }
          }
          this.insertNoti(payload.data)
          resolve(payload);
        });
      });
    }
    if (!show) {
      return null;
    } else {
      return (
        <div className="notification-container" ref={this.wrapperRef}>
          <div
            className="flex-view "
            style={{ borderBottom: "1px solid #e1e1e1" }}
          >
            <h3 className="e-m-left-10">{t("notifications.listNoti")}</h3>
            <span className="total">{this.props.total}</span>
          </div>
          <div className="notifications" onScroll={this.onScroll}>
            {
              notifications.length > 0 ?
                notifications.map((notification, index) => (
                  <Noti
                    notification={notification}
                    more key={index}
                    handleChangeAction={this.handleChangeAction}
                    t={this.props.t}
                  >
                    {notification.title} {notification.amount > 1 ?
                      <span className="amount-noti-duplicate">
                        ({notification.amount})</span> : ""}
                  </Noti>
                )) : <h3 className="no-data">{t("notifications.notiNodata")}</h3>
            }
          </div>
          {/* <div className="text-right more" onClick={() => this.loadMore(this.props.indexNoti)}>
            {iconEye} {t("notifications.seeMore")}</div> */}
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[name],
    ...state[AreaReducerName]
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
    ...callStaffAction,
    ...areaActions,
    ...callKitchenAction,
    ...callTableManagementAction,
    ...callTableListAction,
    ...bookingActions
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Notification));
