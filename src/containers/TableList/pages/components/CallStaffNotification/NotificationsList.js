import React, { Component } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-magic-slider-dots/dist/magic-dots.css';
import {NOTIFICATIONSTOSHOW} from '../../TableContants'
import Swal from "../../../../../utils/sweetalert2";
import { updateStatusRead } from "../../../../../api/notification";
import * as action from "../../../actions";
import * as headerNotifiAction from "../../../../../components/Notification/actions";
import { bindActionCreators} from "redux";
import { connect } from "react-redux";
import { name } from "../../../reducers";
import { withNamespaces } from "react-i18next";
import { STATUS_ACTION_CONFIRM, STATUS_CONFIRM } from "../../../../../consts/settings/notification";


class NotificationsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      indexSlide: 0,
      callStaffNotifications: []
    };
  }

  componentDidMount() {
    this.setState({
      callStaffNotifications: this.props.callStaffNotifications ? this.props.callStaffNotifications.filter(item => item.status === 0) : []
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps !== this.props && this.props.callStaffNotifications && this.props.callStaffNotifications.length >0)
    {
      // this.setState({
      //   callStaffNotifications: this.props.callStaffNotifications
      // })
      this.setState({
        callStaffNotifications: this.props.callStaffNotifications.filter(item => item.status === 0)
      })
    }
  }

  showSuccess = () => {
    this.props.actions.getNotificationsList({ topic: this.props.topic })
    this.props.actions.getNotifications({ topic: this.props.topic });
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

  updateStatusNotification = async (id) => {
    let data = await updateStatusRead({notification_id: id, status: STATUS_CONFIRM})
    this.props.actions.changeActionStatus({
      notification_id: id,
      status_action: STATUS_ACTION_CONFIRM,
      updateSuccess: this.showSuccess,
      updateFail: this.showErr
    })
  }

  actionNotification = (item) => {
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại',
      title: <p className="title_Notification_modal">{item.title}</p>,
      html: (
        <div>
          <p className="content_Notification_modal">
            {item.content}
          </p>
        </div>
      )
    }).then(result => {
      if(result.isConfirmed) {
        this.updateStatusNotification(item.notification_create_id)
      }
    })
  }

  render() {
    const settings = {
      speed: 500,
      infinite: false,
      slidesToShow: this.state.callStaffNotifications.length >= NOTIFICATIONSTOSHOW ? NOTIFICATIONSTOSHOW : this.state.callStaffNotifications.length,
      slidesToScroll: Math.round(this.state.callStaffNotifications.length/NOTIFICATIONSTOSHOW),
      dots: false,
      arrows: false,
      afterChange: (current) => this.setState({ indexSlide: current }),
    };
    return (
      <div
        className={`slick-track notification_list`}
        style={{
          opacity: 1,
          transform: "translate3d(0px, 0px, 0px)",
        }}
      >
        <Slider
          ref={c => (this.slider = c)}
          {...settings}
        >
          {this.state.callStaffNotifications && this.state.callStaffNotifications.length > 0 && this.state.callStaffNotifications.map((item, index) => {
            return (
              <div className="notifi_item" key={index}  onClick={() => this.actionNotification(item)} >
                <p>Bàn { item.body_data.table_name}</p>
              </div>)
          })
          }
        </Slider>
      </div>
    )
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
    ...headerNotifiAction
  };
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(NotificationsList));
