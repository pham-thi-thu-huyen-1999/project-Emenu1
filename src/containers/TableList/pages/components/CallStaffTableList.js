import React, { Component } from "react";
import { get } from "../../../../services/localStorage";
import Styles from "../../scss/TableList.module.scss";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";
import { bindActionCreators} from "redux";
import { name } from "../../reducers";
import * as action from "../../actions";
import * as headerNotifiAction from "../../../../components/Notification/actions";
import NotificationsList from "./CallStaffNotification/NotificationsList"
import { faAngleDoubleRight, faAngleDoubleLeft, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "../../../../utils/sweetalert2";
import { updateStatusRead } from "../../../../api/notification";
import { AreaReducerName } from "../../../AreaManagement/reducers";
import { STATUS_ACTION_CONFIRM, STATUS_CONFIRM } from "../../../../consts/settings/notification";



class CallStaffTableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callStaffNotifications: [],
      isShowNotiList: true,
      topic: null
    }
  }

  componentDidUpdate = async () => {
    if((this.state.topic === null || this.state.topic !== this.props.selectedArea.id) && this.props.selectedArea && this.props.selectedArea.id) {
      this.synceAllNotification();
    }
  }

  /**
   * Close modal
   */
  closeModal = () => {
    this.setState({
      isShowNotiList: false
    })
  }

  /**
   * Open modal
   */
  openModal = () => {
    this.setState({
      isShowNotiList: true
    })
  }

  showSuccess = (countSuccess, actionLength) => {
    if(countSuccess === actionLength) {
      const { t } = this.props
      Swal.fire({
        icon: 'success',
        title: `${t("notifications.updateSuccess")}`,
        showConfirmButton: true
      })
    }
  }
  showErr = (countFail, countAction, actionLength) => {
    if(countAction === actionLength && countFail > 0) {
      const { t } = this.props
      Swal.fire({
        icon: 'error',
        title: `${t("notifications.error")}`,
        text: `${t("notifications.reqCheckAgain")}`
      })
    }
  }


  /**
   * Reset Noti-List
   */
  actionAllNotification = () => {
    if(this.props.callStaffNotifications && this.props.callStaffNotifications.filter(item => item.status===0).length > 0)
      Swal.fire({
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Quay lại',
        html: (
          <div>
            <p className="content_Notification_modal">
              Bạn có muốn cập nhật trạng thái tất cả thông báo?
            </p>
          </div>
        )
      }).then(result => {
        if(result.isConfirmed && this.props.callStaffNotifications && this.props.callStaffNotifications.filter(item => item.status===0).length > 0) {
          let countSuccess = 0
          let countFail = 0
          let countAction = 0
          let actionLength = this.props.callStaffNotifications.filter(item => item.status===0).length
          this.props.callStaffNotifications.filter(item => item.status===0).map((item, index) => {
            countAction += 1
            this.updateStatusNotification(item.notification_create_id)
            this.props.actions.changeActionStatus({
              notification_id: item.notification_create_id,
              status_action: STATUS_ACTION_CONFIRM,
              updateSuccess: () => {countSuccess +=1; this.showSuccess(countSuccess, actionLength)},
              updateFail: () => {countFail+=1; this.showErr(countFail, countAction, actionLength)}
            })
          })
          this.props.actions.getNotifications({ topic: this.props.selectedArea.id });
          this.props.actions.getNotificationsList({ topic: this.props.selectedArea.id })
        }
      })
  }

  synceAllNotification = () => {
    this.props.actions.getNotificationsList({ topic: this.props.selectedArea.id })
    this.setState({
      topic: this.props.selectedArea.id
    })
  }

  updateStatusNotification = async (id) => {
    let data = await updateStatusRead({notification_id: id, status: STATUS_CONFIRM})
  }

  render() {
    return this.state.isShowNotiList ? (
      <div className={`${Styles["callStaff_tableList"]} ${Styles["isOpen"]}`}>
        <div className={Styles["btn-close-notiList"]}
          onClick={() => this.closeModal()}>
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </div>
        {
          !this.props.callStaffNotifications || this.props.callStaffNotifications.filter(item => item.status===0).length === 0 ?
          null :
          <div className={Styles["btn-reset-notiList"]}
            onClick={() => this.actionAllNotification()}>
            <FontAwesomeIcon icon={faRetweet} />
          </div>
        }
        <h6>DANH SÁCH BÀN ĐANG GỌI NHÂN VIÊN</h6>
        {
          !this.props.callStaffNotifications || this.props.callStaffNotifications.filter(item => item.status===0).length === 0 ?
          <p className={Styles["none-callStaffNoti"]}>Chưa có yêu cầu mới!</p> :
          <NotificationsList topic={this.state.topic} callStaffNotifications={this.props.callStaffNotifications.filter(item => item.status===0)}></NotificationsList>
        }
      </div>
    ) : (
      <div className={`${Styles["callStaff_tableList"]} ${Styles["isHide"]}`} >
        <div className={Styles["btn-open-notiList"]}
          onClick={() => this.openModal()}>
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </div>
      </div>
    ) ;
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
    ...headerNotifiAction
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(CallStaffTableList));
