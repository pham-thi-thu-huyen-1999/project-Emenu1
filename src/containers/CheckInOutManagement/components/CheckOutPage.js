import React from "react";
import "../styles.scss";
import { connect } from "react-redux";
import * as action from "../actions";
import { bindActionCreators } from "redux";
import { name } from "../reducers";
import { withNamespaces } from "react-i18next";
import * as CONSTS from "../consts";
import CircleItem from "./CircleItem";
import moment from "moment";
import Swal from "../../../utils/sweetalert2";
import _ from "lodash";
import { get, save, remove } from "../../../services/localStorage";
import Loading from "../../../components/common/Loading";
import common from "../../../utils/common";
import { getStatusCheckIn } from "../../../api/partner";
import { history } from "../../../App";
import * as CONSTS_LOGIN from "../../Login/constants";
const user_id = common.decodeToken(get("accessToken")).sub;
class CheckOutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFunctionId: null,
      time: moment(),
      selectedDate: moment(),
      intervalID: null,
      listCheckIn: [],
    };

    const data = {
      userId: user_id,
      fromDate: moment(new Date()).format("DD-MM-YYYY"),
      toDate: moment(new Date()).format("DD-MM-YYYY"),
    };
    this.props.actions.getCalendarOfUser(data);
  }

  componentDidMount() {
    this.startClock();
  }

  startClock = () => {
    let intervalId = setInterval(() => {
      this.setState({ time: moment()});
    }, 900);
    this.setState({
      intervalId,
    });
  };

  stopClock = () => {
    clearInterval(this.state.intervalId);
  };

  changeFunctionItem = (itemId) => {
    if (itemId === CONSTS.CODE_CHECK_OUT) {
      this.checkOut();
    }
    this.setState({
      selectedFunctionId: itemId,
    });
  };

  checkOut = async () => {
    const { calendarOfUser } = this.props;
    const { time } = this.state;
    if (
      calendarOfUser &&
      calendarOfUser[0] &&
      calendarOfUser[0].shifts &&
      calendarOfUser[0].shifts.length === 0
    ) {
      //no shifts at today
      this.showCustomAlertError();
    } else if (
      calendarOfUser &&
      calendarOfUser[0] &&
      calendarOfUser[0].shifts &&
      calendarOfUser[0].shifts.length !== 0
    ) {
      // found shift in current time or before
      let currentTime = _.toNumber(_.split(time.format("LTS"), ":", 2).join("."));
      let tempCalendar = calendarOfUser[0].shifts.map((shift) => {
        return {
          id: shift.id,
          startTime: _.toNumber(_.split(shift.start_time, ":", 2).join(".")),
          endTime: _.toNumber(_.split(shift.end_time, ":", 2).join(".")),
        };
      });
      let shiftId = "";
      let minDist = 24;
      for (const shift of tempCalendar) {
        if (currentTime >= shift.startTime && currentTime <= shift.endTime) {
          shiftId = shift.id;
          break;
        }
        let dist = currentTime - shift.startTime;
        if (dist > 0 && dist < minDist) {
          minDist = dist;
          shiftId = shift.id;
        }
      }

      if (shiftId !== "") {
        // has shift to checkout
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
              // not yet check in
              this.showCustomAlertError();
            } else {
              // checked in
              this.onSaveCheckOut(shiftId, moment().format("LT"));
            }
          }
        } catch (error) {
          // error for call api
          this.showCustomAlertError();
        }
      } else {
        // no shift to checkout
        this.showCustomAlertError();
      }
    } else {
      this.showCustomAlertError();
    }
  };

  onSaveCheckOut = (shiftId, timeCheckOut) => {
    const { t } = this.props;
    const { selectedDate } = this.state;
    Swal.fire({
      title: `Check Out`,
      text: `Bấm đồng ý để tiến hành check out`,
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
          check_in: "",
          check_out: timeCheckOut,
          description: "",
        };
        this.props.actions.addCheckInOut({
          data,
          showSuccess: this.showSuccess,
          showError: this.showCustomAlertError,
        });
      }
    });
  };

  showSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: t("checkInOutManagement.checkOutSuccess"),
      showConfirmButton: true,
    });
    remove("checkIn");
    save("checkIn", CONSTS_LOGIN.NOT_YET_CHECK_IN);
    history.push("/checkin")
  };

  showCustomAlertError = () => {
    const t = this.props.t;
    Swal.fire({
      title: "",
      html: `<div className="alert-error">${t(
        "checkInOutManagement.hasErrorWhenCheckOut"
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

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentWillUnmount() {
    this.stopClock();
  }

  render() {
    const { selectedFunctionId, time, selectedDate } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    return (
      <main id="site-main" className="check-in-out-management">
        <section id="main-cont" className="full clear body-management">
          <Loading show={this.props.isLoading} />
          <aside className="full-p-width full-p-height">
            <div className="full-p-height e-flex item-center">
              <div className="popup-box wrap-box-management">
                <h3 className="main-lbl text-center text-upper">
                  {t("checkInOutManagement.pleaseCheckOut")}
                </h3>
                <div className="function-list">
                  {CONSTS.funtionCheckOutList.map((item, index) => {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(CheckOutPage));
