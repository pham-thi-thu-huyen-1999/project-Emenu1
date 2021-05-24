import React from "react";
import "../../styles.scss";
import { connect } from "react-redux";
import * as action from "../../actions";
import { bindActionCreators, compose } from "redux";
import { name } from "../../reducers";
import { withNamespaces } from "react-i18next";
import _ from "lodash";
import { get } from "../../../../services/localStorage";
import Loading from "../../../../components/common/Loading";
import common from "../../../../utils/common";
import DateStart from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import { CheckBox } from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import moment from "moment";
import TakeLeaveTable from "./TakeLeaveTable";
import Dialog from "../../../../components/common/Dialog";
import { TextArea, Button } from "../../../../components/common";
import * as CONSTS from "./../../consts";
const user_id = common.decodeToken(get("accessToken")).sub;
class TakeLeavePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      calendarOfUser: this.props.calendarOfUser,
      showTakeLeaveTable: false,
      listChecked: [],
      atCheckInPage: props.atCheckInPage,
    };
    this.props.actions.getUserInfo();
    const data = {
      userId: user_id,
      fromDate: moment(new Date()).format("DD-MM-YYYY"),
      toDate: moment(new Date()).format("DD-MM-YYYY"),
    };
    this.props.actions.getCalendarOfUser(data);
  }

  setSelectedDate = (date) => {
    this.setState({
      selectedDate: date,
      listChecked: [],
    });
    const data = {
      userId: user_id,
      fromDate: moment(date).format("DD-MM-YYYY"),
      toDate: moment(date).format("DD-MM-YYYY"),
    };
    this.props.actions.getCalendarOfUser(data);
  };

  onToggleTakeLeaveTable = () => {
    this.setState({
      showTakeLeaveTable: !this.state.showTakeLeaveTable,
    });
  };

  onChange = (checked, idShift) => {
    let listChecked = [...this.state.listChecked];
    if (checked) {
      listChecked = [...listChecked, idShift];
    } else {
      listChecked = this.state.listChecked.filter((item) => item !== idShift);
    }
    this.setState({ listChecked });
  };

  showSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: `${t("user.createShift.addSuccess")}`,
      showConfirmButton: true,
    });
    this.onToggleTakeLeaveTable();
  };
  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      title: "",
      html: `<div class="alert-error">${t(
        "checkInOutManagement.registerError"
      )}. 
      <br/>${t("checkInOutManagement.pleaseCheckAgain")}</div>`,
      imageUrl: require("../../../../images/CheckInOut/grin-tears-regular.png"),
      imageAlt: "Custom image",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.value) {
      }
    });
  };
  onSave = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `Bạn có chắc chắn muốn nghỉ ca này`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`,
    }).then((result) => {
      if (result.value) {
        const { selectedDate, descReason } = this.state;
        let take_leave_at = moment(selectedDate).format("DD-MM-YYYY");
        let shifts = [...this.state.listChecked];
        const data = {
          user_id: user_id,
          take_leave_at,
          description: descReason ? descReason : "",
          shifts,
        };
        this.props.actions.addTakeLeave({
          data,
          showSuccess: this.showSuccess,
          showErr: this.showErr,
        });
      }
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(prevState.calendarOfUser) !==
      JSON.stringify(nextProps.calendarOfUser)
    ) {
      return {
        calendarOfUser: nextProps.calendarOfUser,
      };
    }
    return null;
  }
  componentWillUnmount() {
    this.props.actions.setNoAtCheckInPage();
  }

  render() {
    const {
      selectedDate,
      calendarOfUser,
      showTakeLeaveTable,
      atCheckInPage,
    } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    return (
      <main
        id={atCheckInPage ? "main-full-header" : "site-main"}
        className="check-in-out-management"
      >
        <section id="main-cont" className="full clear body-management">
          <Loading show={this.props.isLoading} />
          <aside className="full-p-width full-p-height">
            <div className="full-p-height e-flex item-center">
              <div
                className={
                  atCheckInPage
                    ? "popup-box wrap-box-management wrap-box-full-screen"
                    : "popup-box wrap-box-management "
                }
              >
                <Dialog
                  show={true}
                  close={() => {
                    this.props.actions.setNoAtCheckInPage();
                    this.props.history.goBack("");
                  }}
                  innerClass="popup-take-leave-in-out"
                >
                  {showTakeLeaveTable ? (
                    <>
                      <h3 className="main-lbl text-center text-upper">
                        {t("checkInOutManagement.listTakeLeave")}
                      </h3>
                      <div className="contain-take-leave-table">
                        <TakeLeaveTable {...rest}></TakeLeaveTable>
                      </div>
                      <div className="btn-group">
                        <Button
                          type="s3"
                          style={{ marginRight: "10px", fontSize: "1.125em" }}
                          onClick={() => {
                            this.props.history.goBack("");
                          }}
                        >
                          {t("checkInOutManagement.back")}
                        </Button>
                        <Button
                          style={{ marginLeft: "10px", fontSize: "1.125em" }}
                          onClick={() => {
                            this.onToggleTakeLeaveTable();
                          }}
                        >
                          {t("checkInOutManagement.registerTakeLeaveNew")}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="main-lbl text-center text-upper">
                        {t("checkInOutManagement.titleTakeLeave")}
                      </h3>
                      <div className="take-leave">
                        <div className="form-group">
                          <label className="control-label">
                            {t("checkInOutManagement.chooseDateTakeLeave")}
                          </label>
                          <div className="select-date">
                            <DateStart
                              className="form-control"
                              selected={selectedDate}
                              onChange={(date) => this.setSelectedDate(date)}
                              dateFormat="dd / MM / yyyy "
                              minDate={new Date()}
                            />
                            <span className="icon-calendar">
                              <FontAwesomeIcon icon={faCalendarAlt} />
                            </span>
                          </div>
                        </div>
                        <div className="shift-group">
                          {calendarOfUser &&
                          calendarOfUser[0] &&
                          calendarOfUser[0].shifts &&
                          calendarOfUser[0].shifts.length > 0 ? (
                            <div className="has-shift">
                              <div className="text-select-shift">
                                {t("checkInOutManagement.chooseShift")}
                              </div>
                              <div className="group-checkbox-shift">
                                {calendarOfUser[0].shifts.map(
                                  (shift, index) => {
                                    let checked = this.state.listChecked.includes(
                                      shift.id
                                    );
                                    if (
                                      shift.status_calendar === CONSTS.WORK ||
                                        shift.status_calendar === CONSTS.OVER_TIME && shift.status_overtimve_shift === CONSTS.ACCEPT ||
                                        shift.status_calendar === CONSTS.INSTEAD_WORK && shift.status_replace_shift === CONSTS.ACCEPT
                                    ) {
                                      return (
                                        <div
                                          key={index}
                                          className="checbox-item-shift"
                                        >
                                          <CheckBox
                                            checked={checked}
                                            label={`  ${shift.name}   -    Từ   ${shift.start_time}   Đến   ${shift.end_time}`}
                                            onChange={(checked) =>
                                              this.onChange(checked, shift.id)
                                            }
                                          />
                                        </div>
                                      );
                                    } else {
                                      return null;
                                    }
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="no-shift">
                              <img
                                alt=""
                                className="ohazo-logo"
                                src={require("./../../../../images/ohazo_logo.png")}
                              ></img>

                              <div className="no-shift__text">
                                {t("checkInOutManagement.noShift")}
                              </div>
                              <div className="no-shift__text">
                                {t(
                                  "checkInOutManagement.pleaseChooseAnotherDate"
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {calendarOfUser &&
                        calendarOfUser[0] &&
                        calendarOfUser[0].shifts &&
                        calendarOfUser[0].shifts.length > 0 ? (
                          <div className="reason">
                            <div className="reason__lable">
                              {t("checkInOutManagement.reason")}
                            </div>
                            <div className="reason__txt">
                              <TextArea
                                name="Mô tả"
                                value=""
                                style={{
                                  fontSize: "1.2em",
                                  padding: "10px",
                                  height: "200px",
                                }}
                                onChange={(e) =>
                                  this.setState({ descReason: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      {calendarOfUser &&
                      calendarOfUser[0] &&
                      calendarOfUser[0].shifts &&
                      calendarOfUser[0].shifts.length > 0 ? (
                        <div className="btn-group">
                          <Button
                            type="s3"
                            style={{ marginRight: "10px", fontSize: "1.125em" }}
                            onClick={() => {
                              this.props.actions.setNoAtCheckInPage();
                              this.props.history.goBack("");
                            }}
                          >
                            {t("checkInOutManagement.back")}
                          </Button>
                          <Button
                            style={{ marginLeft: "10px", fontSize: "1.125em" }}
                            onClick={() => {
                              this.onSave();
                            }}
                          >
                            {t("checkInOutManagement.registerTakeLeave")}
                          </Button>
                        </div>
                      ) : null}
                    </>
                  )}
                </Dialog>
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
)(withNamespaces()(TakeLeavePage));
