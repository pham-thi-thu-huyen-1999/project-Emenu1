import React from "react";
import "../styles.scss";
import { connect } from "react-redux";
import * as action from "../actions";
import { bindActionCreators, compose } from "redux";
import { name } from "../reducers";
import { withNamespaces } from "react-i18next";
import * as CONSTS from "../consts";
import CircleItem from "./CircleItem";
import moment from "moment";
import Swal from "../../../utils/sweetalert2";
import _ from "lodash";
import { get, remove, save } from "../../../services/localStorage";
import Loading from "../../../components/common/Loading";
import common from "../../../utils/common";
import { withRouter } from "react-router-dom";
import { getStatusCheckIn } from "../../../api/partner";
import { getAccountInfoStaff } from "../../../api/account";
import iconLogout from "../../../images/logout.png";
import iconOmenu from "../../../images/logo-omenu.png";
const user_id = common.decodeToken(get("accessToken")).sub;
class CheckInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFunctionId: null,
      time: moment(),
      selectedDate: moment(),
      intervalID: null,
      userInfo: null,
    };
    const data = {
      userId: user_id,
      fromDate: moment(new Date()).format("DD-MM-YYYY"),
      toDate: moment(new Date()).format("DD-MM-YYYY"),
    };
    this.props.actions.getCalendarOfUser(data);
    this.getStaffInfo();
  }

  componentDidMount() {
    this.startClock();
  }

  startClock = () => {
    let intervalId = setInterval(() => {
      this.setState({ time: moment() });
    }, 900);
    this.setState({
      intervalId,
    });
  };

  stopClock = () => {
    clearInterval(this.state.intervalId);
  };

  getStaffInfo = async () => {
    try {
      let infoToken = common.decodeToken(get("accessToken"));
      const data = await getAccountInfoStaff({ id: user_id });
      if (data.data && data.data.data) {
        this.setState({
          userInfo: data.data.data,
        });
      }
    } catch (error) {}
  };

  changeFunctionItem = (itemId) => {
    if (itemId === CONSTS.CODE_CHECK_IN) {
      this.checkIn();
    } else if (itemId === CONSTS.CODE_ADD_OT) {
      this.props.actions.setAtCheckInPage();
      this.props.history.push("/add-ot-shift");
    } else if (itemId === CONSTS.CODE_WORK_INSTEAD) {
      this.props.actions.setAtCheckInPage();
      this.props.history.push("/work-instead");
    } else if (itemId === CONSTS.CODE_SHOW_CALENDAR) {
      this.props.actions.setAtCheckInPage();
      this.props.history.push("/calendar-staff");
    } else if (itemId === CONSTS.CODE_TAKE_LEAVE) {
      this.props.actions.setAtCheckInPage();
      this.props.history.push("/take-leave");
    }
    this.setState({
      selectedFunctionId: itemId,
    });
  };

  checkIn = async () => {
    const { calendarOfUser } = this.props;
    const { time } = this.state;
    if (
      calendarOfUser &&
      calendarOfUser[0] &&
      calendarOfUser[0].shifts &&
      calendarOfUser[0].shifts.length === 0
    ) {
      //have no shifts in day
      this.showAlertError();
    } else if (
      calendarOfUser &&
      calendarOfUser[0] &&
      calendarOfUser[0].shifts &&
      calendarOfUser[0].shifts.length !== 0
    ) {
      let currentTime = _.toNumber(_.split(time.format("LTS"), ":", 2).join("."));
      let tempCalendar = calendarOfUser[0].shifts.map((shift) => {
        return {
          id: shift.id,
          startTime: _.toNumber(_.split(shift.start_time, ":", 2).join(".")),
          endTime: _.toNumber(_.split(shift.end_time, ":", 2).join(".")),
        };
      });
      let shiftId = "";
      let selectedShift = null;
      let minDist = 24;
      for (const shift of tempCalendar) {
        if (currentTime >= shift.startTime && currentTime <= shift.endTime) {
          shiftId = shift.id;
          break;
        }
        let dist = shift.startTime - currentTime;
        if (dist > 0 && dist < minDist) {
          minDist = dist;
          shiftId = shift.id;
        }
      }
      for (const shift of calendarOfUser[0].shifts) {
        if (shift.id === shiftId) {
          selectedShift = shift;
          break;
        }
      }
      if (shiftId !== "") {
        const todayTime = moment(new Date()).format("DD-MM-YYYY");
        const params = {
          check_in_out_at: todayTime,
          shift_id: shiftId,
        };
        try {
          const resStatusCheckin = await getStatusCheckIn({ user_id, params });
          if (
            resStatusCheckin &&
            resStatusCheckin.data &&
            resStatusCheckin.data.data
          ) {
            const { status } = resStatusCheckin.data.data;
            if (status === CONSTS.NOT_YET_CHECK_IN) {
              this.onSaveCheckIn(shiftId, moment().format("LT"), selectedShift);
            } else {
              this.showAlertCheckedIn(
                shiftId,
                moment().format("LT"),
                selectedShift
              );
            }
          }
        } catch (error) {
          this.showAlertError();
        }
      } else {
        this.showAlertError();
      }
    } else {
      this.showAlertError();
    }
  };

  onSaveCheckIn = (shiftId, timeCheckIn, selectedShift) => {
    const { t } = this.props;
    const { selectedDate } = this.state;
    Swal.fire({
      title: `Bạn có muốn check-in vào ${selectedShift.name} bắt đầu vào lúc ${selectedShift.start_time}`,
      text: `Bấm đồng ý để tiến hành check in`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`,
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          user_id: common.decodeToken(get("accessToken")).sub,
          shift_id: shiftId,
          check_in_out_at: selectedDate.format("DD-MM-YYYY"),
          check_in: timeCheckIn,
          check_out: "",
          description: "",
        };
        this.props.actions.addCheckInOut({
          data,
          showSuccess: () => this.showSuccess(),
          showError: this.showError,
        });
      }
    });
  };

  showSuccess = async() => {
    await save("checkIn", CONSTS.CHECKED_IN);
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: t("checkInOutManagement.checkInSuccess"),
      showConfirmButton: true,
    });
    this.props.history.push("/");
  };

  showError = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "error",
      title: `${t("user.createShift.addError")}`,
      text: `${t("user.createShift.reqCheckAgain")}`,
    });
  };

  showAlertError = () => {
    const t = this.props.t;
    Swal.fire({
      title: "",
      html: `<div className="alert-error">${t(
        "checkInOutManagement.hasErrorWhenCheckIn"
      )}. 
      <br/>${t("checkInOutManagement.pleaseCheckAgain")}</div>`,
      imageUrl: require("../../../images/CheckInOut/grin-tears-regular.png"),
      imageAlt: "Custom image",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.value) {
      }
    });
  };

  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: "success",
      text: t("calendarManagement.swalUpdateSuccess"),
      title: t("calendarManagement.swalTitle"),
    });
  };

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: "error",
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalUpdateFail"),
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  clickLogout = () => {
    remove("accessToken");
    remove("refreshToken");
    remove("is_table");
    this.props.history.push("/login");
  };

  componentWillUnmount() {
    this.stopClock();
  }

  render() {
    const { selectedFunctionId, time, selectedDate, userInfo } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    return (
      <main id="main-full-header" className="check-in-out-management">
        <section id="main-cont" className="full clear body-management">
          <Loading show={this.props.isLoading} />
          <aside className="full-p-width full-p-height">
            <div className="full-p-height e-flex item-center">
              <div className="popup-box wrap-box-management wrap-box-full-screen">
                <div className="header-checkin">
                  <div className="logo-omenu">
                    <img className="omenu-icon" src={iconOmenu} alt="Omenu" />
                  </div>
                  <div className="user-name">
                    <div className="name">
                      {userInfo && userInfo.full_name
                        ? "Chào, " + userInfo.full_name
                        : ""}
                    </div>
                    <h3 className="main-lbl text-center text-upper">
                      {t("checkInOutManagement.pleaseCheckIn")}
                    </h3>
                  </div>
                  <div className="logout">
                    <div
                      className="logout-button-group"
                      onClick={this.clickLogout}
                    >
                      <div className="logout-icon-container" title="Đăng xuất">
                        <img
                          className="logout-icon"
                          src={iconLogout}
                          alt="logout"
                        />
                      </div>
                      <span></span>
                    </div>
                  </div>
                </div>

                <div className="function-list">
                  {CONSTS.funtionCheckInList.map((item, index) => {
                    return (
                      <CircleItem
                        key={index}
                        item={item}
                        selectedId={selectedFunctionId}
                        onChangeSelectedItem={() => {
                          this.changeFunctionItem(item.id);
                        }}
                      ></CircleItem>
                    );
                  })}
                </div>
                <div className="time-now">
                  <div className="time">
                    <div className="hour">
                    {time.hours().toString().length === 1 ? "0" + time.hours() : time.hours()}
                    </div>:
                    <div className="minute">
                    {time.minutes().toString().length === 1 ? "0" + time.minutes() : time.minutes()}
                    </div>:
                    <div className="second">
                    {time.seconds().toString().length === 1 ? "0" + time.seconds() : time.seconds()}
                    </div>
                  </div>
                  <div className="day">
                    {`Ngày ${selectedDate.format("DD/MM/YYYY")}`}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
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
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(CheckInPage));
